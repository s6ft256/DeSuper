import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { PlayerState } from "../types";
import { fetchWithFallback } from "../utils/api";

interface AuthContextType {
  user: { id: string; email?: string } | null;
  player: PlayerState;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  syncPlayerToSupabase: () => Promise<void>;
  loadPlayerFromSupabase: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "desuper_game_save_v1";

const DEFAULT_PLAYER: PlayerState = {
  name: "CyberOperative",
  level: 1,
  xp: 0,
  coins: 100,
  rank: "ZERO",
  streak: 1,
  lastPlayedDate: new Date().toISOString().split("T")[0],
  completedMissions: [],
  unlockedSkills: ["py_print"],
  defeatedBosses: [],
  completedProjects: [],
  achievements: [
    {
      id: "first_signal",
      title: "First Transmission",
      description: "Successfully booted the DeSuper Core terminal.",
      icon: "Terminal",
      unlockedAt: Date.now(),
    },
  ],
  customization: {
    name: "CyberOperative",
    avatar: "cyber_ninja",
    suitColor: "#06b6d4",
    helmetStyle: "visor_alpha",
    companionSkin: "aura_cyan",
    themeAccent: "cyan",
    badgeTitle: "REBOOT OPERATIVE",
  },
  soundEnabled: true,
  hapticsEnabled: true,
  stats: {
    codeExecutions: 0,
    errorsEncountered: 0,
    bugsPatched: 0,
    hintsUsed: 0,
    totalLinesWritten: 0,
  },
};

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

async function getAuthHeader(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error("No session");
  }
  return `Bearer ${session.access_token}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [player, setPlayer] = useState<PlayerState>(DEFAULT_PLAYER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? undefined });
        loadPlayerFromBackend();
      } else {
        loadLocalPlayer();
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? undefined });
        await loadPlayerFromBackend();
      } else {
        setUser(null);
        loadLocalPlayer();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadLocalPlayer = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setPlayer(JSON.parse(saved));
      } else {
        setPlayer(DEFAULT_PLAYER);
      }
    } catch {
      setPlayer(DEFAULT_PLAYER);
    }
  };

  const mapBackendToPlayer = (data: any): PlayerState => ({
    name: data.display_name || "CyberOperative",
    level: data.level || 1,
    xp: data.xp || 0,
    coins: data.coins || 100,
    rank: (data.rank || "ZERO") as PlayerState["rank"],
    streak: data.streak || 1,
    lastPlayedDate: data.last_played_date || new Date().toISOString().split("T")[0],
    completedMissions: data.completed_missions || [],
    unlockedSkills: data.unlocked_skills || ["py_print"],
    defeatedBosses: data.defeated_bosses || [],
    completedProjects: data.completed_projects || [],
    achievements: [],
    customization: {
      name: data.display_name || "CyberOperative",
      avatar: data.avatar || "cyber_ninja",
      suitColor: data.suit_color || "#06b6d4",
      helmetStyle: data.helmet_style || "visor_alpha",
      companionSkin: data.companion_skin || "aura_cyan",
      themeAccent: data.theme_accent || "cyan",
      badgeTitle: data.badge_title || "REBOOT OPERATIVE",
    },
    soundEnabled: data.sound_enabled ?? true,
    hapticsEnabled: data.haptics_enabled ?? true,
    stats: (data.stats as PlayerState["stats"]) || DEFAULT_PLAYER.stats,
  });

  const loadPlayerFromBackend = async () => {
    if (!user) return;
    try {
      const authHeader = await getAuthHeader();
      const { data, error } = await fetchWithFallback(
        `/api/game/state`,
        { headers: { Authorization: authHeader } },
        null
      );
      if (!error && data) {
        const mapped = mapBackendToPlayer(data);
        setPlayer(mapped);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
        return;
      }
    } catch {
      // backend unavailable
    }
    loadLocalPlayer();
  };

  const syncPlayerToSupabase = async () => {
    if (!user) return;
    try {
      const authHeader = await getAuthHeader();
      const { error } = await fetchWithFallback(
        `/api/game/state`,
        {
          method: "POST",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            level: player.level,
            xp: player.xp,
            coins: player.coins,
            rank: player.rank,
            streak: player.streak,
            completed_missions: player.completedMissions,
            unlocked_skills: player.unlockedSkills,
            defeated_bosses: player.defeatedBosses,
            completed_projects: player.completedProjects,
            stats: player.stats,
            sound_enabled: player.soundEnabled,
            haptics_enabled: player.hapticsEnabled,
            last_played_date: player.lastPlayedDate,
            display_name: player.customization.name,
            avatar: player.customization.avatar,
            suit_color: player.customization.suitColor,
            helmet_style: player.customization.helmetStyle,
            companion_skin: player.customization.companionSkin,
            theme_accent: player.customization.themeAccent,
            badge_title: player.customization.badgeTitle,
          }),
        },
        null
      );
      if (error) {
        console.warn("Backend sync deferred:", error);
      }
    } catch (err) {
      console.warn("Backend sync error:", err);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName || "CyberOperative" } },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    loadLocalPlayer();
  };

  return (
    <AuthContext.Provider
      value={{ user, player, loading, signIn, signUp, signOut, syncPlayerToSupabase, loadPlayerFromSupabase: loadPlayerFromBackend }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

