import React, { useState, useCallback } from 'react';
import { Upload, FileText, Check, X, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ImportResult {
  imported: number;
  skipped: number;
  skills: Array<{
    skill_name?: string;
    name?: string;
    skill_category?: string;
    category?: string;
    proficiency_level?: number;
    level?: number;
    status: 'new' | 'updated' | 'exists' | 'error';
    error?: string;
  }>;
}

interface ImportSkillsProps {
  onImportComplete?: () => void;
}

export const ImportSkills: React.FC<ImportSkillsProps> = ({ onImportComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.name.endsWith('.md')) {
      setFile(selected);
      setError(null);
      setResult(null);
    } else {
      setError('Please select a .md file');
      setFile(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.name.endsWith('.md')) {
      setFile(droppedFile);
      setError(null);
      setResult(null);
    } else {
      setError('Please drop a .md file');
    }
  }, []);

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const content = await file.text();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/skills/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          file_name: file.name,
          content: content
        })
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.result);
        onImportComplete?.();
      } else {
        setError(data.error || 'Import failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold font-mono text-white">Import Skills</h3>
      <p className="text-xs text-slate-400">Upload a skills.md file to add your skills to the AI's knowledge.</p>
      
      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
          dragActive
            ? 'border-cyan-500 bg-cyan-500/10'
            : file
            ? 'border-emerald-500 bg-emerald-500/10'
            : 'border-slate-700 hover:border-slate-600'
        }`}
      >
        <input
          type="file"
          accept=".md"
          onChange={handleFileChange}
          className="hidden"
          id="skills-file-input"
        />
        <label htmlFor="skills-file-input" className="cursor-pointer">
          {file ? (
            <div className="flex items-center justify-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-mono text-emerald-300">{file.name}</span>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm font-mono text-slate-400">
                Drop skills.md here or click to browse
              </p>
            </>
          )}
        </label>
      </div>

      {/* Format Guide */}
      <div className="bg-slate-900/50 rounded-lg p-3">
        <p className="text-[10px] font-mono text-slate-500 mb-1">Expected format:</p>
        <pre className="text-[10px] font-mono text-cyan-300/70">
{`## Programming
- **Python** (Advanced): 5 years experience
- **JavaScript** (Intermediate): React, Node.js`}
        </pre>
      </div>

      {/* Import Button */}
      <button
        onClick={handleImport}
        disabled={!file || loading}
        className="w-full py-3 bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-cyan-300 font-mono font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Importing...</span>
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            <span>Upload & Import</span>
          </>
        )}
      </button>

      {/* Results */}
      {result && (
        <div className="bg-slate-900/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-mono">
            <Check className="w-4 h-4" />
            <span>{result.imported} skills imported</span>
          </div>
          {result.skipped > 0 && (
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono">
              <AlertCircle className="w-3 h-3" />
              <span>{result.skipped} skills skipped (duplicates)</span>
            </div>
          )}
          <div className="max-h-40 overflow-y-auto space-y-1">
            {result.skills.map((skill, i) => {
              const name = skill.skill_name || skill.name || 'Unknown';
              const category = skill.skill_category || skill.category || '';
              const level = skill.proficiency_level || skill.level || 0;
              return (
                <div key={i} className="flex items-center justify-between text-xs font-mono py-1 border-b border-slate-800 last:border-0">
                  <span className="text-slate-300">{name}</span>
                  <div className="flex items-center gap-2">
                    {category && <span className="text-slate-500 text-[9px]">{category}</span>}
                    {level > 0 && <span className="text-cyan-500 text-[9px]">Lvl {level}</span>}
                    <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                      skill.status === 'new' ? 'bg-emerald-500/20 text-emerald-400' :
                      skill.status === 'updated' ? 'bg-cyan-500/20 text-cyan-400' :
                      skill.status === 'error' ? 'bg-rose-500/20 text-rose-400' :
                      'bg-slate-700 text-slate-400'
                    }`}>
                      {skill.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-rose-400 text-sm font-mono bg-rose-500/10 p-3 rounded-lg">
          <X className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
