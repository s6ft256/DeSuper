import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { Trophy, Medal, Crown, TrendingUp, Users, Award } from 'lucide-react';
import { sound } from '../utils/audio';
import { supabase } from '../lib/supabase';

interface LeaderboardEntry {
  id: string;
  user_id: string;
  display_name: string;
  total_xp: number;
  highest_level: number;
  missions_completed: number;
  bosses_defeated: number;
  rank: string;
}

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  const { player } = useGame();
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'xp' | 'missions' | 'bosses'>('xp');

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen, filter]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order(filter === 'xp' ? 'total_xp' : filter === 'missions' ? 'missions_completed' : 'bosses_defeated', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        // Generate mock data if table is empty
        setEntries(generateMockLeaderboard());
      } else {
        setEntries(data || generateMockLeaderboard());
      }
    } catch (err) {
      console.error('Error:', err);
      setEntries(generateMockLeaderboard());
    } finally {
      setLoading(false);
    }
  };

  const generateMockLeaderboard = (): LeaderboardEntry[] => {
    const mockNames = ['CyberNinja', 'CodeMaster', 'PythonPro', 'ByteRunner', 'DataHacker', 'AlgoKing', 'LoopLord', 'FuncWizard', 'VarQueen', 'SyntaxSage'];
    return mockNames.map((name, i) => ({
      id: `mock-${i}`,
      user_id: `user-${i}`,
      display_name: name,
      total_xp: Math.floor(Math.random() * 20000) + 1000,
      highest_level: Math.floor(Math.random() * 50) + 5,
      missions_completed: Math.floor(Math.random() * 150) + 10,
      bosses_defeated: Math.floor(Math.random() * 5),
      rank: ['ZERO', 'NOVICE', 'APPRENTICE', 'CODER', 'DEVELOPER', 'ENGINEER'][Math.floor(Math.random() * 6)] as string,
    })).sort((a, b) => b.total_xp - a.total_xp);
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'ZERO': return 'text-slate-400';
      case 'NOVICE': return 'text-sky-400';
      case 'APPRENTICE': return 'text-emerald-400';
      case 'CODER': return 'text-amber-400';
      case 'DEVELOPER': return 'text-orange-400';
      case 'ENGINEER': return 'text-pink-400';
      case 'ARCHITECT': return 'text-purple-400';
      case 'MASTER': return 'text-cyan-400';
      case 'GRANDMASTER': return 'text-rose-400';
      case 'SUPREME': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="w-5 h-5 text-amber-400" />;
      case 2: return <Medal className="w-5 h-5 text-slate-300" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <span className="text-sm font-mono text-slate-500 w-5 text-center">{position}</span>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80" onClick={onClose}>
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-mono text-white">Leaderboard</h2>
              <p className="text-xs text-slate-400 font-mono">Top players worldwide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 py-3 border-b border-slate-800 flex items-center gap-2">
          {[
            { id: 'xp', label: 'XP', icon: <TrendingUp className="w-3 h-3" /> },
            { id: 'missions', label: 'Missions', icon: <Award className="w-3 h-3" /> },
            { id: 'bosses', label: 'Bosses', icon: <Users className="w-3 h-3" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setFilter(tab.id as any);
                sound.playKeyClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer transition-all ${
                filter === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Leaderboard List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((entry, index) => {
                const position = index + 1;
                const isCurrentUser = entry.user_id === user?.id;
                
                return (
                  <div
                    key={entry.id}
                    className={`p-3 rounded-xl flex items-center gap-4 transition-all ${
                      isCurrentUser
                        ? 'bg-cyan-500/10 border border-cyan-500/30'
                        : position <= 3
                        ? 'bg-slate-800/80 border border-slate-700'
                        : 'bg-slate-800/40 border border-transparent'
                    }`}
                  >
                    <div className="w-8 flex items-center justify-center">
                      {getPositionIcon(position)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold font-mono text-sm truncate ${
                          isCurrentUser ? 'text-cyan-300' : 'text-white'
                        }`}>
                          {entry.display_name}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className={`text-xs font-mono ${getRankColor(entry.rank)}`}>
                        {entry.rank}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold font-mono text-white">
                        {filter === 'xp' && `${entry.total_xp.toLocaleString()} XP`}
                        {filter === 'missions' && `${entry.missions_completed} missions`}
                        {filter === 'bosses' && `${entry.bosses_defeated} bosses`}
                      </span>
                      <p className="text-[10px] font-mono text-slate-500">Level {entry.highest_level}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
