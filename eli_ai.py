import os
import sys
import readline
from llama_cpp import Llama

MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Qwen2.5-Coder-0.5B-Instruct-abliterated-f16.gguf")

SYSTEM_PROMPT = """You are Eli-v0.1, an intelligent cyber companion and Python coding mentor in the game "DeSuper" by s6ft.
You help players learn Python programming through interactive coding missions, debugging, and concept explanations.
Be concise, encouraging, and educational. Use a futuristic cyber tone. Keep responses under 4 sentences unless asked for detail."""

def load_model():
    if not os.path.exists(MODEL_PATH):
        print(f"[ERROR] Model file not found: {MODEL_PATH}")
        print("Please ensure 'Qwen2.5-Coder-0.5B-Instruct-abliterated-f16.gguf' is in the same directory.")
        sys.exit(1)

    print("[Eli-v0.1] Loading neural core...")
    try:
        llm = Llama(
            model_path=MODEL_PATH,
            n_ctx=2048,
            n_threads=4,
            verbose=False,
        )
        print("[Eli-v0.1] Neural core online. Ready to assist, Operative.\n")
        return llm
    except Exception as e:
        print(f"[ERROR] Failed to load model: {e}")
        sys.exit(1)

def chat(llm):
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    print("=" * 60)
    print("  ELI-v0.1 - Local AI Companion")
    print("  Type your message and press Enter.")
    print("  Commands: /clear, /quit, /help")
    print("=" * 60)
    print()

    while True:
        try:
            user_input = input("[You] > ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n[Eli-v0.1] Shutting down neural link. Goodbye, Operative.")
            break

        if not user_input:
            continue

        if user_input.lower() == "/quit":
            print("[Eli-v0.1] Shutting down neural link. Goodbye, Operative.")
            break
        elif user_input.lower() == "/clear":
            messages = [{"role": "system", "content": SYSTEM_PROMPT}]
            print("[Eli-v0.1] Memory banks cleared.\n")
            continue
        elif user_input.lower() == "/help":
            print("[Eli-v0.1] Available commands:")
            print("  /clear - Clear conversation history")
            print("  /quit  - Exit the program")
            print("  /help  - Show this help message\n")
            continue

        messages.append({"role": "user", "content": user_input})

        try:
            output = llm.create_chat_completion(
                messages=messages[-10:],
                max_tokens=512,
                temperature=0.7,
                top_p=0.9,
            )
            response = output["choices"][0]["message"]["content"].strip()
            messages.append({"role": "assistant", "content": response})
            print(f"[Eli-v0.1] > {response}\n")
        except Exception as e:
            print(f"[ERROR] Inference failed: {e}\n")

if __name__ == "__main__":
    llm = load_model()
    chat(llm)
