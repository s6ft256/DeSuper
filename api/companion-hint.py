from http.server import BaseHTTPRequestHandler
import json
import os

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        
        try:
            data = json.loads(body.decode())
            mission_title = data.get("mission_title", "")
            concept = data.get("concept", "")
            player_code = data.get("player_code", "")
            error_message = data.get("error_message", "")
            hint_level = data.get("hint_level", 1)
        except json.JSONDecodeError:
            self.send_json(400, {"success": False, "error": "Invalid request"})
            return
        
        prompt = f"""You are Eli-v0.1, the intelligent cyber companion and Python mentor in the game "DeSuper" by s6ft.
The player is currently in mission: "{mission_title}" focusing on the Python concept "{concept}".
Player's Python code:
```python
{player_code or "(empty)"}
```
Detected issue/error: {error_message or "None / player requesting advice"}
Hint level requested (1=subtle nudge, 2=concept explanation, 3=analogous example, 4=structural outline): {hint_level}

Respond concisely in character as Eli-v0.1."""

        try:
            llm = self._load_model()
            if llm:
                output = llm.create_chat_completion(
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=256,
                    temperature=0.7,
                )
                text = output["choices"][0]["message"]["content"].strip()
                if text:
                    self.send_json(200, {"success": True, "source": "local-mentor", "hint": text})
                    return
        except Exception:
            pass
        
        hint = self._get_local_hint(mission_title, concept, error_message, hint_level)
        self.send_json(200, {"success": True, "source": "local-mentor-fallback", "hint": hint})

    def _load_model(self):
        try:
            from llama_cpp import Llama
            model_path = os.getenv("MODEL_PATH", "Qwen2.5-Coder-0.5B-Instruct-abliterated-f16.gguf")
            if os.path.exists(model_path):
                return Llama(model_path=model_path, n_ctx=2048, n_threads=4, verbose=False)
        except ImportError:
            pass
        return None

    def _get_local_hint(self, mission_title, concept, error, level):
        if error and "SyntaxError" in error:
            if level == 1:
                return "[Eli-v0.1 Alert]: Syntax anomaly detected. Check your punctuation and quotes carefully."
            if level == 2:
                return "[Eli-v0.1 Scan]: In Python, strings require matching quotes and blocks require colons."
            if level == 3:
                return '[Eli-v0.1 Example]: print("HELLO SYSTEM") or if condition: [indent] action()'
            return "[Eli-v0.1 Blueprint]: Ensure all brackets are closed and each statement follows proper Python syntax."
        if level == 1:
            return f"[Eli-v0.1]: Focus on the objective of {mission_title}. What data or action is requested?"
        if level == 2:
            return f"[Eli-v0.1 Guide]: Remember how {concept} works in Python. Build step-by-step."
        if level == 3:
            return "[Eli-v0.1 Simulation]: Test small pieces in the console first to inspect variables."
        return "[Eli-v0.1 Protocol]: Review the mission requirements and execute the standard Python command structure."

    def send_json(self, status, data):
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
