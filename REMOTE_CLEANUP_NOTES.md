# PhysX-Omni Remote Cleanup Notes

Remote host: `light-47022`  
Remote root: `/data/light/repro/physx_omni_2605_21572`  
Remote repo: `/data/light/repro/physx_omni_2605_21572/code/PhysX-Omni`

## Intentional code changes

These are preserved and captured by `physx_omni_repro_quality.patch`:

- `decoder_each.py`: call `pipeline.run_decoder(..., formats=['mesh', 'gaussian'])` to avoid the unused `radiance_field` branch that OOMs on 24GB 4090.
- `trellis/pipelines/trellis_image_to_3d.py`: allow `DINO_LOCAL_REPO` so DINOv2 can load from a local repo/cache.

## Transient dirty files

The remote worktree also contains runtime files:

- `trellis/**/__pycache__/`
- `trellis/**/*.pyc`
- `exp_2infer.log`
- `exp_3urdf.log`
- backup files created during patching

Use:

```bash
bash /data/light/repro/physx_omni_2605_21572/cleanup_remote_worktree.sh --dry-run
bash /data/light/repro/physx_omni_2605_21572/cleanup_remote_worktree.sh --apply
```

The script does not touch `repro_runs`, downloaded assets, or the two intentional source-code changes.
