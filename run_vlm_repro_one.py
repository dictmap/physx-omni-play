from __future__ import annotations

import argparse
import json
import os
import re
import runpy
import time
import traceback
from pathlib import Path

import numpy as np
import torch
import trimesh
from PIL import Image
from transformers import AutoProcessor, BitsAndBytesConfig, Qwen2_5_VLForConditionalGeneration
from qwen_vl_utils import process_vision_info


def load_original_helpers(repo: Path) -> dict:
    helpers = runpy.run_path(str(repo / "1vlm_demo.py"))
    return helpers


def apply_chat_and_generate(model, processor, messages, max_new_tokens: int) -> str:
    text = processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    image_inputs, video_inputs = process_vision_info(messages)
    inputs = processor(
        text=[text],
        images=image_inputs,
        videos=video_inputs,
        padding=True,
        return_tensors="pt",
    )
    inputs = inputs.to(model.device)

    with torch.inference_mode():
        generated_ids = model.generate(
            **inputs,
            do_sample=False,
            max_new_tokens=max_new_tokens,
        )
    generated_ids_trimmed = [
        out_ids[len(in_ids) :] for in_ids, out_ids in zip(inputs.input_ids, generated_ids)
    ]
    output_text = processor.batch_decode(
        generated_ids_trimmed,
        skip_special_tokens=True,
        clean_up_tokenization_spaces=False,
    )
    return output_text[0]


def load_model(model_path: Path, mode: str, max_gpu_memory: str):
    common = {
        "torch_dtype": torch.bfloat16,
        "device_map": "auto",
        "attn_implementation": "sdpa",
    }
    if mode == "4bit":
        quant_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_compute_dtype=torch.bfloat16,
            bnb_4bit_use_double_quant=True,
            bnb_4bit_quant_type="nf4",
        )
        return Qwen2_5_VLForConditionalGeneration.from_pretrained(
            str(model_path),
            quantization_config=quant_config,
            **common,
        )
    if mode == "bf16_offload":
        offload_dir = model_path.parent / "_offload_physx_omni"
        offload_dir.mkdir(exist_ok=True)
        return Qwen2_5_VLForConditionalGeneration.from_pretrained(
            str(model_path),
            max_memory={0: max_gpu_memory, "cpu": "96GiB"},
            offload_folder=str(offload_dir),
            **common,
        )
    if mode == "cpu":
        return Qwen2_5_VLForConditionalGeneration.from_pretrained(
            str(model_path),
            torch_dtype=torch.bfloat16,
            device_map={"": "cpu"},
            attn_implementation="eager",
        )
    raise ValueError(f"unknown mode: {mode}")


def count_parts(text: str) -> int:
    indices = [int(m.group(1)) for m in re.finditer(r"\bl_(\d+)\b", text)]
    return max(indices) + 1 if indices else 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", required=True)
    parser.add_argument("--model-path", required=True)
    parser.add_argument("--processor-path", default="Qwen/Qwen2.5-VL-7B-Instruct")
    parser.add_argument("--image", required=True)
    parser.add_argument("--output-root", required=True)
    parser.add_argument("--name", default=None)
    parser.add_argument("--mode", choices=["4bit", "bf16_offload", "cpu"], default="4bit")
    parser.add_argument("--max-gpu-memory", default="8GiB")
    parser.add_argument("--max-parts", type=int, default=1)
    parser.add_argument("--basic-max-new-tokens", type=int, default=4096)
    parser.add_argument("--coord-max-new-tokens", type=int, default=8192)
    args = parser.parse_args()

    start = time.time()
    repo = Path(args.repo)
    model_path = Path(args.model_path)
    image_path = Path(args.image)
    output_root = Path(args.output_root)
    name = args.name or image_path.stem
    save_dir = output_root / name
    save_dir.mkdir(parents=True, exist_ok=True)

    summary = {
        "status": "running",
        "repo": str(repo),
        "model_path": str(model_path),
        "processor_path": args.processor_path,
        "image": str(image_path),
        "output_dir": str(save_dir),
        "mode": args.mode,
        "max_parts": args.max_parts,
        "started_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
    }

    try:
        helpers = load_original_helpers(repo)
        addmessage = helpers["addmessage"]
        string_to_runs = helpers["string_to_runs_by_z_lossless_robust"]
        decode_rle = helpers["decode_voxel_2drle_by_z"]

        basic_prompt = (repo / "dataset" / "example_64_finetune_rle.txt").read_text(encoding="utf-8")
        image = Image.open(image_path).convert("RGB")
        image.save(save_dir / "cond_img.png")
        image_512 = image.resize((512, 512), Image.LANCZOS)

        model = load_model(model_path, args.mode, args.max_gpu_memory)
        processor = AutoProcessor.from_pretrained(args.processor_path, min_pixels=65536, max_pixels=262144)
        processor.image_processor.min_pixels = 65536
        processor.image_processor.max_pixels = 262144
        processor.image_processor.size["shortest_edge"] = 65536
        processor.image_processor.size["longest_edge"] = 262144

        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "image", "image": image_512},
                    {"type": "text", "text": basic_prompt},
                ],
            }
        ]

        basic_text = apply_chat_and_generate(model, processor, messages, args.basic_max_new_tokens)
        (save_dir / "basic_info.txt").write_text(basic_text, encoding="utf-8")
        n_parts = count_parts(basic_text)
        parts_to_run = min(n_parts, args.max_parts) if args.max_parts > 0 else n_parts
        summary["detected_parts"] = n_parts
        summary["parts_to_run"] = parts_to_run

        all_coords = []
        part_summaries = []
        for part in range(parts_to_run):
            question = (
                f"Based on the structured description of l_{part}, generate its 3D voxel "
                "(grid=64) in the 3D RLE (linear scan) format. Output one run per line as: "
                "start_index length"
            )
            messages_part = addmessage(messages, basic_text, question)
            coord_text = apply_chat_and_generate(
                model,
                processor,
                messages_part,
                args.coord_max_new_tokens,
            )
            (save_dir / f"coord_{part}.txt").write_text(coord_text, encoding="utf-8")

            runs_by_z = string_to_runs(coord_text, D=64)
            coords = decode_rle(runs_by_z, shape=(64, 64, 64))
            np.save(save_dir / f"ind_{part}.npy", coords)
            part_summary = {
                "part": part,
                "coord_text_chars": len(coord_text),
                "voxel_count": int(coords.shape[0]),
                "npy": str(save_dir / f"ind_{part}.npy"),
            }
            if coords.size:
                ply = save_dir / f"ind_{part}.ply"
                trimesh.points.PointCloud(coords).export(ply)
                part_summary["ply"] = str(ply)
                all_coords.append(coords)
            part_summaries.append(part_summary)

        if all_coords:
            allind = np.concatenate(all_coords, axis=0)
        else:
            allind = np.zeros((0, 3), dtype=np.int64)
        np.save(save_dir / "allind.npy", allind)
        if allind.size:
            trimesh.points.PointCloud(allind).export(save_dir / "allind.ply")

        summary.update(
            {
                "status": "success",
                "elapsed_sec": round(time.time() - start, 2),
                "total_voxels": int(allind.shape[0]),
                "parts": part_summaries,
                "outputs": [
                    "cond_img.png",
                    "basic_info.txt",
                    "coord_*.txt",
                    "ind_*.npy",
                    "ind_*.ply",
                    "allind.npy",
                    "allind.ply",
                ],
            }
        )
    except Exception:
        summary.update(
            {
                "status": "failed",
                "elapsed_sec": round(time.time() - start, 2),
                "traceback": traceback.format_exc(),
            }
        )
        (save_dir / "repro_summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
        print(json.dumps(summary, indent=2))
        return 1

    (save_dir / "repro_summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(json.dumps(summary, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
