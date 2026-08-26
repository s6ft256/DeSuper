from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
import os
import httpx

app = FastAPI(title="DeSuper Backend", version="1.0.0")

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://izggdjegvyqoddflqfxp.supabase.co")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "sb_publishable_LjFci6VxYxBw8nZECH9kgg_riyAR1QA")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.getenv("MODEL_PATH", os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "Qwen2.5-Coder-0.5B-f16.gguf"))
llm = None

def load_model():
    global llm
    try:
        from llama_cpp import Llama
        if os.path.exists(MODEL_PATH):
            llm = Llama(
                model_path=MODEL_PATH,
                n_ctx=2048,
                n_threads=4,
                verbose=False,
            )
            return True
    except ImportError:
        pass
    return False

@app.on_event("startup")
async def startup_event():
    load_model()


class PlayerState(BaseModel):
    user_id: str
    level: int = 1
    xp: int = 0
    coins: int = 100
    rank: str = "ZERO"
    streak: int = 1
    completed_missions: list[str] = []
    unlocked_skills: list[str] = ["py_print"]
    defeated_bosses: list[str] = []
    completed_projects: list[str] = []
    stats: dict = {
        "codeExecutions": 0,
        "errorsEncountered": 0,
        "bugsPatched": 0,
        "hintsUsed": 0,
        "totalLinesWritten": 0,
    }
    sound_enabled: bool = True
    haptics_enabled: bool = True
    last_played_date: str = datetime.utcnow().isoformat().split("T")[0]


class LeaderboardEntry(BaseModel):
    user_id: str
    display_name: str
    xp: int
    level: int
    rank: str
    updated_at: str


class AIRequest(BaseModel):
    mission_title: str
    concept: str
    player_code: Optional[str] = ""
    error_message: Optional[str] = ""
    hint_level: int = 1


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    max_tokens: Optional[int] = 512


async def verify_supabase_token(authorization: str = Header(...)):
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": authorization,
            },
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        return resp.json()


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "desuper-backend", "timestamp": datetime.utcnow().isoformat()}


@app.get("/api/game/state")
async def get_game_state(user=Depends(verify_supabase_token)):
    user_id = user["id"]
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{SUPABASE_URL}/rest/v1/profiles",
            headers={
                "apikey": SUPABASE_SERVICE_ROLE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
            },
            params={"id": f"eq.{user_id}", "select": "*"},
        )
        if resp.status_code != 200 or not resp.json():
            raise HTTPException(status_code=404, detail="Profile not found")
        return resp.json()[0]


@app.post("/api/game/state")
async def save_game_state(state: PlayerState, user=Depends(verify_supabase_token)):
    user_id = user["id"]
    payload = state.dict()
    payload["id"] = user_id
    payload["updated_at"] = datetime.utcnow().isoformat()

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{SUPABASE_URL}/rest/v1/profiles",
            headers={
                "apikey": SUPABASE_SERVICE_ROLE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "resolution=merge-duplicates",
            },
            json=payload,
            params={"id": f"eq.{user_id}"},
        )

    if resp.status_code not in (200, 201):
        raise HTTPException(status_code=500, detail="Failed to save game state")

    return {"success": True, "message": "Game state saved"}


@app.get("/api/game/leaderboard", response_model=list[LeaderboardEntry])
async def get_leaderboard(limit: int = 50):
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{SUPABASE_URL}/rest/v1/profiles",
            headers={
                "apikey": SUPABASE_SERVICE_ROLE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
            },
            params={
                "select": "id,display_name,xp,level,rank,updated_at",
                "order": "xp.desc",
                "limit": str(limit),
            },
        )
    if resp.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch leaderboard")

    results = []
    for row in resp.json():
        results.append(
            LeaderboardEntry(
                user_id=row["id"],
                display_name=row.get("display_name", "CyberOperative"),
                xp=row.get("xp", 0),
                level=row.get("level", 1),
                rank=row.get("rank", "ZERO"),
                updated_at=row.get("updated_at", ""),
            )
        )
    return results


@app.post("/api/ai/companion-hint")
async def ai_companion_hint(request: AIRequest):
    prompt = f"""You are AURA-7, the intelligent cyber companion and Python mentor in the game "DeSuper" by s6ft.
The player is currently in mission: "{request.mission_title}" focusing on the Python concept "{request.concept}".
Player's Python code:
```python
{request.player_code or "(empty)"}
```
Detected issue/error: {request.error_message or "None / player requesting advice"}
Hint level requested (1=subtle nudge, 2=concept explanation, 3=analogous example, 4=structural outline): {request.hint_level or 1}

Respond concisely in character as AURA-7 (futuristic, encouraging, cybernetic, clear, max 3-4 sentences). Do NOT give away the exact full solution unless it's Level 4, but guide their thinking with high educational precision."""

    if llm:
        try:
            output = llm.create_chat_completion(
                messages=[{"role": "user", "content": prompt}],
                max_tokens=256,
                temperature=0.7,
            )
            text = output["choices"][0]["message"]["content"].strip()
            if text:
                return {"success": True, "source": "local-mentor", "hint": text}
        except Exception:
            pass

    return {
        "success": True,
        "source": "local-mentor-fallback",
        "hint": get_local_hint(request.mission_title, request.concept, request.error_message, request.hint_level),
    }


@app.post("/api/ai/chat")
async def ai_chat(request: ChatRequest):
    if not llm:
        if load_model():
            pass
        else:
            return {
                "success": False,
                "error": "Model not available",
                "message": "The local AI model could not be loaded. Ensure 'Qwen2.5-Coder-0.5B-f16.gguf' is in the project root and llama-cpp-python is installed.",
            }

    system_prompt = """You are AURA-7, an intelligent cyber companion and Python coding mentor in the game "DeSuper" by s6ft.
You help players learn Python programming through interactive coding missions, debugging, and concept explanations.
Be concise, encouraging, and educational. Use a futuristic cyber tone. Keep responses under 4 sentences unless asked for detail."""

    messages = [{"role": "system", "content": system_prompt}]
    for msg in request.messages[-10:]:
        messages.append({"role": msg.role, "content": msg.content})

    try:
        output = llm.create_chat_completion(
            messages=messages,
            max_tokens=request.max_tokens or 512,
            temperature=0.7,
            top_p=0.9,
        )
        text = output["choices"][0]["message"]["content"].strip()
        return {"success": True, "message": text}
    except Exception as e:
        return {"success": False, "error": str(e)}


def get_local_hint(mission_title: str, concept: str, error: str, level: int = 1) -> str:
    if error and "SyntaxError" in error:
        if level == 1:
            return "[AURA-7 Alert]: Syntax anomaly detected. Check your punctuation and quotes carefully."
        if level == 2:
            return "[AURA-7 Scan]: In Python, strings require matching quotes (\"\" or '') and blocks require colons (:)."
        if level == 3:
            return '[AURA-7 Example]: print("HELLO SYSTEM") or if condition: [indent] action()'
        return "[AURA-7 Blueprint]: Ensure all brackets are closed and each statement follows proper Python syntax."
    if level == 1:
        return f"[AURA-7]: Focus on the objective of {mission_title}. What data or action is requested?"
    if level == 2:
        return f"[AURA-7 Guide]: Remember how {concept} works in Python. Build step-by-step."
    if level == 3:
        return "[AURA-7 Simulation]: Test small pieces in the console first to inspect variables."
    return "[AURA-7 Protocol]: Review the mission requirements and execute the standard Python command structure."


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
