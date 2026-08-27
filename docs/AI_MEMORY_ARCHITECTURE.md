# DeSuper AI: Persistent Memory & Skill Retention Architecture

## 1. Long-Term Memory & Skill Storage Strategy

### Memory Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        AI MEMORY SYSTEM                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Short-Term  │  │   Working    │  │    Long-Term         │  │
│  │   Context    │  │   Memory     │  │    Memory            │  │
│  │  (Session)   │  │  (Session)   │  │  (Persistent)        │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│         │                 │                    │                 │
│         └─────────────────┴────────────────────┘                 │
│                           │                                      │
│                    ┌──────┴──────┐                               │
│                    │  Supabase   │                               │
│                    │  Database   │                               │
│                    └─────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
```

### Memory Types

| Type | Storage | Retention | Use Case |
|------|---------|-----------|----------|
| **Session Context** | In-memory | Current conversation | Active chat context |
| **Working Memory** | `ai_memory_logs` (recent) | Last 30 days | Recent interactions |
| **Long-Term Memory** | `ai_long_term_memory` | Permanent | Key facts, preferences |
| **Skill Memory** | `ai_skills` | Permanent | Acquired competencies |

### Memory Consolidation Strategy

```
Daily Cron Job:
1. Analyze recent `ai_memory_logs`
2. Extract key facts, preferences, patterns
3. Store in `ai_long_term_memory` with relevance score
4. Archive old working memory to cold storage
5. Update skill proficiency based on usage
```

---

## 2. Supabase Database Schema

```sql
-- ============================================
-- AI MEMORY & SKILL RETENTION SCHEMA
-- ============================================

-- ============================================
-- 1. AI PROFILES (per user)
-- ============================================
create table if not exists public.ai_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null unique,
  ai_name text default 'Eli-v0.1',
  ai_personality text default 'cyber_mentor',
  system_prompt text,
  memory_consent boolean default false,
  total_interactions int default 0,
  last_interaction_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- 2. AI SKILLS (acquired competencies)
-- ============================================
create table if not exists public.ai_skills (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  skill_name text not null,
  skill_category text default 'general',
  proficiency_level int default 1 check (proficiency_level between 1 and 10),
  description text,
  source text default 'conversation', -- 'conversation', 'import', 'manual'
  source_file text, -- original filename if imported
  metadata jsonb default '{}'::jsonb,
  acquired_at timestamp with time zone default timezone('utc'::text, now()),
  last_used_at timestamp with time zone,
  use_count int default 0,
  unique(user_id, skill_name)
);

-- ============================================
-- 3. AI LONG-TERM MEMORY
-- ============================================
create table if not exists public.ai_long_term_memory (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  memory_type text not null, -- 'fact', 'preference', 'pattern', 'goal', 'context'
  content text not null,
  relevance_score float default 0.5 check (relevance_score between 0 and 1),
  source_interaction_id uuid,
  tags text[] default '{}',
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- 4. AI MEMORY LOGS (working memory)
-- ============================================
create table if not exists public.ai_memory_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  session_id text,
  role text not null, -- 'user', 'assistant', 'system'
  content text not null,
  tokens_used int,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- 5. AI SKILL IMPORTS (tracking)
-- ============================================
create table if not exists public.ai_skill_imports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  file_name text not null,
  file_size int,
  parse_status text default 'pending', -- 'pending', 'processing', 'completed', 'failed'
  skills_imported int default 0,
  skills_skipped int default 0,
  error_message text,
  raw_content text,
  processed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- 6. AI CONVERSATION SESSIONS
-- ============================================
create table if not exists public.ai_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  session_id text not null unique,
  title text,
  summary text,
  message_count int default 0,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ended_at timestamp with time zone,
  metadata jsonb default '{}'::jsonb
);

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_ai_skills_user_id on public.ai_skills(user_id);
create index if not exists idx_ai_skills_category on public.ai_skills(skill_category);
create index if not exists idx_ai_long_term_memory_user_id on public.ai_long_term_memory(user_id);
create index if not exists idx_ai_long_term_memory_type on public.ai_long_term_memory(memory_type);
create index if not exists idx_ai_memory_logs_user_id on public.ai_memory_logs(user_id);
create index if not exists idx_ai_memory_logs_session on public.ai_memory_logs(session_id);
create index if not exists idx_ai_sessions_user_id on public.ai_sessions(user_id);
create index if not exists idx_ai_skill_imports_user_id on public.ai_skill_imports(user_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.ai_profiles enable row level security;
alter table public.ai_skills enable row level security;
alter table public.ai_long_term_memory enable row level security;
alter table public.ai_memory_logs enable row level security;
alter table public.ai_skill_imports enable row level security;
alter table public.ai_sessions enable row level security;

-- AI Profiles policies
create policy "Users can manage own AI profile"
  on public.ai_profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- AI Skills policies
create policy "Users can manage own skills"
  on public.ai_skills for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Long-term memory policies
create policy "Users can manage own memory"
  on public.ai_long_term_memory for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Memory logs policies
create policy "Users can manage own memory logs"
  on public.ai_memory_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Skill imports policies
create policy "Users can manage own imports"
  on public.ai_skill_imports for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Sessions policies
create policy "Users can manage own sessions"
  on public.ai_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at
create or replace function public.handle_ai_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger on_ai_profiles_updated
  before update on public.ai_profiles
  for each row execute procedure public.handle_ai_updated_at();

create trigger on_ai_long_term_memory_updated
  before update on public.ai_long_term_memory
  for each row execute procedure public.handle_ai_updated_at();

-- Auto-create AI profile on user creation
create or replace function public.handle_new_ai_profile()
returns trigger as $$
begin
  insert into public.ai_profiles (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_ai_profile on auth.users;
create trigger on_auth_user_ai_profile
  after insert on auth.users
  for each row execute procedure public.handle_new_ai_profile();

-- Update interaction count
create or replace function public.handle_ai_interaction()
returns trigger as $$
begin
  update public.ai_profiles
  set 
    total_interactions = total_interactions + 1,
    last_interaction_at = timezone('utc'::text, now())
  where user_id = new.user_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_ai_memory_log_created
  after insert on public.ai_memory_logs
  for each row execute procedure public.handle_ai_interaction();
```

---

## 3. Skills.md Parsing Workflow

### Expected `skills.md` Format

```markdown
# My Skills

## Programming Languages
- **Python** (Advanced): 5 years experience, web scraping, data analysis
- **JavaScript** (Intermediate): React, Node.js, TypeScript
- **Rust** (Beginner): Systems programming basics

## Frameworks
- **React** (Advanced): Hooks, Context, Redux
- **Django** (Intermediate): REST APIs, ORM

## Soft Skills
- **Public Speaking** (Intermediate): Conference presentations
- **Technical Writing** (Advanced): Documentation, tutorials
```

### Parsing Algorithm

```
┌─────────────────────────────────────────────────────────────────┐
│                    SKILL IMPORT PIPELINE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. UPLOAD ──→ 2. PARSE ──→ 3. VALIDATE ──→ 4. STORE           │
│     │            │              │               │                │
│     ▼            ▼              ▼               ▼                │
│  File Input   Markdown      Deduplicate     Insert into         │
│  Validation   Extraction    Categorize      ai_skills           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Backend Parser (Python)

```python
# api/parse-skills.py
import re
from typing import List, Dict

def parse_skills_markdown(content: str) -> List[Dict]:
    """Parse skills.md file content into structured skill data."""
    skills = []
    current_category = 'general'
    
    for line in content.split('\n'):
        line = line.strip()
        
        # Detect category headers (## Category Name)
        if line.startswith('## '):
            current_category = line[3:].strip().lower().replace(' ', '_')
            continue
        
        # Parse skill entries (- **Skill Name** (Level): Description)
        if line.startswith('- **') or line.startswith('* **'):
            match = re.match(
                r'[-*]\s*\*\*(.+?)\*\*\s*\((.+?)\):\s*(.*)',
                line
            )
            if match:
                skill_name = match.group(1).strip()
                level_text = match.group(2).strip().lower()
                description = match.group(3).strip()
                
                # Map text levels to numeric
                level_map = {
                    'beginner': 1, 'basic': 2, 'novice': 3,
                    'intermediate': 4, 'medium': 5, 'competent': 6,
                    'advanced': 7, 'expert': 8, 'master': 9, 'guru': 10
                }
                proficiency = level_map.get(level_text, 5)
                
                skills.append({
                    'skill_name': skill_name,
                    'skill_category': current_category,
                    'proficiency_level': proficiency,
                    'description': description,
                    'source': 'import'
                })
    
    return skills
```

---

## 4. Frontend Integration

### Settings Icon & Panel Design

```
┌─────────────────────────────────────────────────────────────────┐
│                        GAME HEADER                              │
├─────────────────────────────────────────────────────────────────┤
│  [DS] DE SUPER                              🔊 🔧 [Eli-v0.1]   │
│                                              │                  │
│                                              ▼                  │
│                                    ┌─────────────────────┐      │
│                                    │   SETTINGS PANEL    │      │
│                                    ├─────────────────────┤      │
│                                    │ ⚙️ General          │      │
│                                    │ 🧠 AI Memory        │      │
│                                    │ 📚 My Skills        │      │
│                                    │ 📤 Import Skills    │      │
│                                    │ 📊 Statistics       │      │
│                                    └─────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

### Settings Panel Component Structure

```
SettingsPanel/
├── SettingsPanel.tsx          # Main panel with tabs
├── GeneralSettings.tsx        # Sound, haptics, theme
├── AIMemorySettings.tsx       # Memory consent, view/delete memory
├── SkillsSettings.tsx         # View, add, edit skills
├── ImportSkills.tsx           # Upload skills.md interface
└── StatisticsPanel.tsx        # AI interaction stats
```

### Import Skills UI Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     IMPORT SKILLS TAB                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │              📄 Drop skills.md here                     │   │
│  │                    or click to browse                    │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Expected Format:                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ## Category Name                                        │   │
│  │ - **Skill Name** (Level): Description                   │   │
│  │ - **Python** (Advanced): 5 years experience             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Upload & Import]                                              │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Import Results:                                                │
│  ✅ 12 skills imported successfully                            │
│  ⚠️ 3 skills skipped (duplicates)                             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Skill              Category        Level    Status      │   │
│  │ ─────────────────────────────────────────────────────── │   │
│  │ Python             programming     7        ✅ New       │   │
│  │ React              frameworks      7        ✅ New       │   │
│  │ Public Speaking    soft_skills     4        ⚠️ Exists   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Frontend Implementation

```typescript
// src/components/settings/ImportSkills.tsx
import React, { useState, useCallback } from 'react';
import { Upload, FileText, Check, X, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ImportResult {
  imported: number;
  skipped: number;
  skills: Array<{
    name: string;
    category: string;
    level: number;
    status: 'new' | 'updated' | 'exists';
  }>;
}

export const ImportSkills: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.name.endsWith('.md')) {
      setFile(selected);
      setError(null);
    } else {
      setError('Please select a .md file');
    }
  }, []);

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const content = await file.text();
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/skills/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          file_name: file.name,
          content: content
        })
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.result);
      } else {
        setError(data.error || 'Import failed');
      }
    } catch (err) {
      setError('Failed to import file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-mono font-bold text-white">Import Skills</h3>
      
      {/* File Upload Area */}
      <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-cyan-500/50 transition-colors">
        <input
          type="file"
          accept=".md"
          onChange={handleFileChange}
          className="hidden"
          id="skills-file"
        />
        <label htmlFor="skills-file" className="cursor-pointer">
          <FileText className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-sm font-mono text-slate-300">
            {file ? file.name : 'Drop skills.md here or click to browse'}
          </p>
        </label>
      </div>

      {/* Format Guide */}
      <div className="bg-slate-900/50 rounded-lg p-4">
        <p className="text-xs font-mono text-slate-400 mb-2">Expected format:</p>
        <pre className="text-xs font-mono text-cyan-300">
{`## Programming
- **Python** (Advanced): 5 years experience
- **JavaScript** (Intermediate): React, Node.js`}
        </pre>
      </div>

      {/* Import Button */}
      <button
        onClick={handleImport}
        disabled={!file || loading}
        className="w-full py-3 bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-cyan-300 font-mono font-bold disabled:opacity-50"
      >
        {loading ? 'Importing...' : 'Upload & Import'}
      </button>

      {/* Results */}
      {result && (
        <div className="bg-slate-900/50 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <Check className="w-4 h-4" />
            <span className="text-sm font-mono">{result.imported} skills imported</span>
          </div>
          {result.skills.map((skill, i) => (
            <div key={i} className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">{skill.name}</span>
              <span className={skill.status === 'new' ? 'text-emerald-400' : 'text-amber-400'}>
                {skill.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-rose-400 text-sm font-mono">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
};
```

---

## 5. Memory Retrieval for AI Context

```python
# Backend: Build context from memory
def build_ai_context(user_id: str) -> str:
    """Build AI system prompt with user memory context."""
    
    # Get user profile
    profile = supabase.table('profiles').select('*').eq('user_id', user_id).single().execute()
    
    # Get active long-term memories
    memories = supabase.table('ai_long_term_memory')\
        .select('*')\
        .eq('user_id', user_id)\
        .eq('is_active', True)\
        .order('relevance_score', desc=True)\
        .limit(10)\
        .execute()
    
    # Get top skills
    skills = supabase.table('ai_skills')\
        .select('*')\
        .eq('user_id', user_id)\
        .order('proficiency_level', desc=True)\
        .limit(10)\
        .execute()
    
    # Build context string
    context = "--- PLAYER CONTEXT ---\n"
    
    if profile.data:
        p = profile.data
        context += f"Name: {p.get('display_name', 'Operative')}\n"
        context += f"Level: {p.get('level', 1)} | Rank: {p.get('rank', 'ZERO')}\n"
    
    if skills.data:
        context += "\nSkills:\n"
        for s in skills.data:
            context += f"  - {s['skill_name']} (Lv.{s['proficiency_level']})\n"
    
    if memories.data:
        context += "\nKey Memories:\n"
        for m in memories.data:
            context += f"  - {m['content']}\n"
    
    context += "--- END CONTEXT ---"
    return context
```

---

## Summary

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Database** | Supabase/PostgreSQL | Persistent storage |
| **Memory Types** | Short-term, Working, Long-term | Tiered retention |
| **Skill Import** | Markdown parser | Bulk skill acquisition |
| **Settings UI** | React + Tailwind | User interface |
| **RLS Policies** | PostgreSQL | Data security |
| **AI Context** | Dynamic prompt building | Personalized responses |
