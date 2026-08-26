import os
import sys
import httpx
from llama_cpp import Llama

MODEL_PATH = os.getenv("MODEL_PATH", "/app/models/Qwen2.5-Coder-0.5B-Instruct-abliterated-f16.gguf")
MODEL_URL = os.getenv("MODEL_URL", "https://github.com/s6ft256/DeSuper/releases/download/Cai/Qwen2.5-Coder-0.5B-Instruct-abliterated-f16.gguf")

def download_model():
    if os.path.exists(MODEL_PATH):
        print(f"[Eli] Model found at {MODEL_PATH}")
        return True
    
    print(f"[Eli] Downloading model from {MODEL_URL}...")
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    
    try:
        with httpx.stream("GET", MODEL_URL, follow_redirects=True, timeout=300) as resp:
            resp.raise_for_status()
            total = int(resp.headers.get("content-length", 0))
            downloaded = 0
            with open(MODEL_PATH, "wb") as f:
                for chunk in resp.iter_bytes(chunk_size=8192):
                    f.write(chunk)
                    downloaded += len(chunk)
                    if total:
                        pct = (downloaded / total) * 100
                        print(f"[Eli] Downloading: {pct:.1f}%", flush=True)
        print(f"[Eli] Model downloaded to {MODEL_PATH}")
        return True
    except Exception as e:
        print(f"[Eli] Download failed: {e}")
        return False

def load_model():
    if not download_model():
        return None
    
    print("[Eli] Loading model...")
    try:
        llm = Llama(
            model_path=MODEL_PATH,
            n_ctx=2048,
            n_threads=4,
            verbose=False,
        )
        print("[Eli] Model loaded successfully")
        return llm
    except Exception as e:
        print(f"[Eli] Failed to load model: {e}")
        return None
