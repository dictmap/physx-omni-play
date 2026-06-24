import importlib

mods = [
    "torch",
    "torchvision",
    "kaolin",
    "spconv",
    "xformers",
    "flash_attn",
    "nvdiffrast",
    "diffusers",
    "easydict",
    "utils3d",
    "plyfile",
    "trimesh",
]

for name in mods:
    try:
        mod = importlib.import_module(name)
        if name == "torch":
            print(f"{name}\tOK\t{mod.__version__}\tcuda={mod.version.cuda}\tavailable={mod.cuda.is_available()}")
        else:
            print(f"{name}\tOK\t{getattr(mod, '__version__', 'unknown')}")
    except Exception as exc:
        print(f"{name}\tMISSING\t{type(exc).__name__}: {str(exc)[:180]}")
