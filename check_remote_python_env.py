import importlib

mods = [
    "torch",
    "transformers",
    "qwen_vl_utils",
    "accelerate",
    "PIL",
    "numpy",
    "trimesh",
    "rembg",
    "flash_attn",
    "bitsandbytes",
]

for name in mods:
    try:
        mod = importlib.import_module(name)
        print(f"{name}\tOK\t{getattr(mod, '__version__', 'unknown')}")
    except Exception as exc:
        print(f"{name}\tMISSING\t{type(exc).__name__}: {str(exc)[:160]}")
