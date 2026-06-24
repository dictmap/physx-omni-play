#!/usr/bin/env python3
"""Low-VRAM TRELLIS mesh decode for PhysX-Omni VLM voxel outputs.

This keeps the official TRELLIS model path and mesh decoder, but avoids
Pipeline.cuda(), which moves every submodel to GPU at once.
"""

from __future__ import annotations

import argparse
import gc
import json
import os
import re
import time
from collections import OrderedDict
from pathlib import Path

os.environ.setdefault("SPCONV_ALGO", "native")
os.environ.setdefault("ATTN_BACKEND", "xformers")

import numpy as np
import torch
import torch.nn.functional as F
import trimesh
from PIL import Image

from trellis.modules.sparse.basic import SparseTensor
from trellis.pipelines import TrellisImageTo3DPipeline


def gpu_snapshot(label: str) -> dict:
    if not torch.cuda.is_available():
        return {"label": label, "cuda": False}
    torch.cuda.synchronize()
    return {
        "label": label,
        "allocated_mib": round(torch.cuda.memory_allocated() / 1024**2, 2),
        "reserved_mib": round(torch.cuda.memory_reserved() / 1024**2, 2),
        "max_allocated_mib": round(torch.cuda.max_memory_allocated() / 1024**2, 2),
    }


def sorted_ind_files(folder: Path) -> list[Path]:
    items: list[tuple[int, Path]] = []
    pattern = re.compile(r"ind_(\d+)\.npy$")
    for path in folder.iterdir():
        match = pattern.match(path.name)
        if match:
            items.append((int(match.group(1)), path))
    return [path for _, path in sorted(items)]


def put_first(mapping: dict, key: str) -> OrderedDict:
    return OrderedDict([(key, mapping[key]), *[(k, v) for k, v in mapping.items() if k != key]])


def model_to(model: torch.nn.Module, device: str) -> None:
    model.to(torch.device(device))


@torch.no_grad()
def encode_condition(pipeline: TrellisImageTo3DPipeline, image: Image.Image) -> dict:
    model = pipeline.models["image_cond_model"]
    model_to(model, "cuda")
    image = image.resize((518, 518), Image.LANCZOS)
    arr = np.array(image.convert("RGB")).astype(np.float32) / 255.0
    tensor = torch.from_numpy(arr).permute(2, 0, 1).float()[None].cuda()
    tensor = pipeline.image_cond_model_transform(tensor).cuda()
    features = model(tensor, is_training=True)["x_prenorm"]
    cond = F.layer_norm(features, features.shape[-1:])
    neg_cond = torch.zeros_like(cond)
    model_to(model, "cpu")
    del tensor, features
    gc.collect()
    torch.cuda.empty_cache()
    return {"cond": cond, "neg_cond": neg_cond}


@torch.no_grad()
def sample_slat_lowmem(
    pipeline: TrellisImageTo3DPipeline,
    cond: dict,
    coords: torch.Tensor,
) -> SparseTensor:
    model = pipeline.models["slat_flow_model"]
    model_to(model, "cuda")
    pipeline.models = put_first(pipeline.models, "slat_flow_model")
    slat = pipeline.sample_slat(cond, coords, pipeline.slat_sampler_params)
    model_to(model, "cpu")
    del cond
    gc.collect()
    torch.cuda.empty_cache()
    return slat


@torch.no_grad()
def decode_mesh_lowmem(pipeline: TrellisImageTo3DPipeline, slat: SparseTensor) -> list:
    keep = pipeline.models["slat_decoder_mesh"]
    model_to(keep, "cuda")
    pipeline.models = put_first(pipeline.models, "slat_decoder_mesh")
    decoded = pipeline.decode_slat(slat, formats=["mesh"])
    model_to(keep, "cpu")
    gc.collect()
    torch.cuda.empty_cache()
    return decoded["mesh"]


def export_mesh(mesh, out_dir: Path) -> dict:
    out_dir.mkdir(parents=True, exist_ok=True)
    vertices = mesh.vertices.detach().cpu().numpy()
    faces = mesh.faces.detach().cpu().numpy()
    tri = trimesh.Trimesh(vertices=vertices, faces=faces, process=False)
    obj_path = out_dir / "0_mesh_only.obj"
    glb_path = out_dir / "0_mesh_only.glb"
    ply_path = out_dir / "0_mesh_only.ply"
    tri.export(obj_path)
    tri.export(glb_path)
    tri.export(ply_path)
    return {
        "vertices": int(len(vertices)),
        "faces": int(len(faces)),
        "obj": str(obj_path),
        "glb": str(glb_path),
        "ply": str(ply_path),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--case-dir", required=True)
    parser.add_argument("--model", default="microsoft/TRELLIS-image-large")
    parser.add_argument("--part-index", type=int, default=0)
    parser.add_argument("--seed", type=int, default=1)
    args = parser.parse_args()

    case_dir = Path(args.case_dir)
    img_path = case_dir / "cond_img.png"
    ind_files = sorted_ind_files(case_dir)
    if not ind_files:
        raise FileNotFoundError(f"No ind_*.npy files in {case_dir}")
    part_path = ind_files[args.part_index]
    part = np.load(part_path)
    coords_np = np.concatenate([np.zeros((len(part), 1), dtype=part.dtype), part], axis=1)
    coords = torch.as_tensor(coords_np, dtype=torch.int32, device="cuda")

    started = time.time()
    report = {
        "case_dir": str(case_dir),
        "model": args.model,
        "part_file": part_path.name,
        "voxels": int(part.shape[0]),
        "snapshots": [],
    }

    torch.manual_seed(args.seed)
    report["snapshots"].append(gpu_snapshot("before_load"))
    pipeline = TrellisImageTo3DPipeline.from_pretrained(args.model)
    report["model_keys"] = list(pipeline.models.keys())
    report["snapshots"].append(gpu_snapshot("after_cpu_load"))

    image = pipeline.preprocess_image(Image.open(img_path))
    cond = encode_condition(pipeline, image)
    report["snapshots"].append(gpu_snapshot("after_cond"))

    slat = sample_slat_lowmem(pipeline, cond, coords)
    report["slat_coords"] = int(slat.coords.shape[0])
    report["snapshots"].append(gpu_snapshot("after_slat"))

    part_slat = SparseTensor(coords=slat.coords, feats=slat.feats)
    meshes = decode_mesh_lowmem(pipeline, part_slat)
    report["snapshots"].append(gpu_snapshot("after_mesh"))
    if not meshes or not getattr(meshes[0], "success", False):
        report["status"] = "empty_mesh"
    else:
        report["status"] = "success"
        report["mesh"] = export_mesh(meshes[0], case_dir / "objs_lowmem" / "0")

    report["elapsed_sec"] = round(time.time() - started, 2)
    out = case_dir / "lowmem_mesh_report.json"
    out.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))
    return 0 if report["status"] == "success" else 2


if __name__ == "__main__":
    raise SystemExit(main())
