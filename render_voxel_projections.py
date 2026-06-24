from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont


COLORS = [
    (230, 57, 70),
    (29, 53, 87),
    (69, 123, 157),
    (42, 157, 143),
    (233, 196, 106),
    (244, 162, 97),
    (131, 56, 236),
    (255, 127, 80),
]


def project(points: np.ndarray, axes: tuple[int, int], size: int = 384) -> Image.Image:
    img = Image.new("RGB", (size, size), (12, 14, 18))
    draw = ImageDraw.Draw(img)
    if points.size == 0:
        return img
    pts = points[:, axes].astype(float)
    colors = points[:, 3].astype(int)
    mins = pts.min(axis=0)
    maxs = pts.max(axis=0)
    span = np.maximum(maxs - mins, 1)
    scaled = (pts - mins) / span
    xy = np.round(scaled * (size - 24) + 12).astype(int)
    xy[:, 1] = size - 1 - xy[:, 1]
    for (x, y), color_id in zip(xy, colors):
        color = COLORS[int(color_id) % len(COLORS)]
        draw.rectangle((x - 1, y - 1, x + 1, y + 1), fill=color)
    return img


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--run-dir", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    run_dir = Path(args.run_dir)
    point_chunks = []
    part_files = sorted(run_dir.glob("ind_*.npy"), key=lambda p: int(p.stem.split("_")[1]))
    for idx, path in enumerate(part_files):
        pts = np.load(path)
        if pts.size == 0:
            continue
        part_col = np.full((pts.shape[0], 1), idx, dtype=np.int64)
        point_chunks.append(np.concatenate([pts, part_col], axis=1))
    points = np.concatenate(point_chunks, axis=0) if point_chunks else np.zeros((0, 4), dtype=np.int64)

    size = 384
    margin_top = 54
    canvas = Image.new("RGB", (size * 3, size + margin_top), (248, 250, 252))
    draw = ImageDraw.Draw(canvas)
    title = f"PhysX-Omni VLM voxel output: {len(part_files)} parts, {points.shape[0]} voxels"
    draw.text((18, 16), title, fill=(20, 24, 31))
    labels = [("XY projection", (0, 1)), ("XZ projection", (0, 2)), ("YZ projection", (1, 2))]
    for i, (label, axes) in enumerate(labels):
        img = project(points, axes, size=size)
        canvas.paste(img, (i * size, margin_top))
        draw.text((i * size + 12, margin_top + 10), label, fill=(235, 238, 245))

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out)
    print(out)


if __name__ == "__main__":
    main()
