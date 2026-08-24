import React, { useState, useEffect } from "react";
import { GameProvider, useGame } from "./context/GameContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navigation } from "./components/Navigation";
import { WorldMapView } from "./components/WorldMapView";
import { ArcadeRacerView } from "./components/ArcadeRacerView";
import { MissionsView } from "./components/MissionsView";
import { PlaygroundView } from "./components/PlaygroundView";
import { SkillTreeView } from "./components/SkillTreeView";
import { BossBattlesView } from "./components/BossBattlesView";
import { ProjectsView } from "./components/ProjectsView";
import { MiniGamesView } from "./components/MiniGamesView";
import { ProfileView } from "./components/ProfileView";
import { StartupSplash } from "./components/StartupSplash";
import { Auth3D } from "./components/Auth3D";
import { sound } from "./utils/audio";
import { insertPairedChars } from "./utils/useKeyboardShortcuts";

function MainGameContainer() {
  const { activeTab, setActiveTab } = useGame();
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [shortcutFeedback, setShortcutFeedback] = useState<string | null>(null);
  const [authDone, setAuthDone] = useState(false);

  useEffect(() => {
    if (!loading && user && !authDone) {
      setAuthDone(true);
      setShowSplash(true);
    }
  }, [loading, user, authDone]);

  const handleAuthSuccess = () => {
    setAuthDone(true);
    setShowSplash(true);
  };

  // Global Keyboard Event Interceptor (Ctrl+R, Alt+Brackets/Quotes)
  useEffect(() => {
    let timeout: any;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // 1. Intercept Ctrl+R / Cmd+R to Run Mission Code & prevent page reload
      if ((e.ctrlKey || e.metaKey) && (e.key === "r" || e.key === "R")) {
        e.preventDefault();
        e.stopPropagation();

        sound.playRun();
        setShortcutFeedback("Triggering Python Run (Ctrl+R)...");
        clearTimeout(timeout);
        timeout = setTimeout(() => setShortcutFeedback(null), 1400);

        // Dispatch universal execution event for active editor
        window.dispatchEvent(new CustomEvent("desuper:run_code"));
        return;
      }

      // 2. Intercept Ctrl+Enter / Cmd+Enter
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();

        sound.playRun();
        setShortcutFeedback("Quick Executing (Ctrl+Enter)...");
        clearTimeout(timeout);
        timeout = setTimeout(() => setShortcutFeedback(null), 1400);

        window.dispatchEvent(new CustomEvent("desuper:run_code"));
        return;
      }

      // 3. Handle bracket and quote shortcuts on active textarea if focused
      const activeEl = document.activeElement;
      if (activeEl instanceof HTMLTextAreaElement) {
        if (e.altKey && (e.key === "9" || e.key === "(")) {
          e.preventDefault();
          sound.playKeyClick();
          const start = activeEl.selectionStart;
          const end = activeEl.selectionEnd;
          const val = activeEl.value;
          activeEl.value = val.substring(0, start) + "()" + val.substring(end);
          activeEl.setSelectionRange(start + 1, start + 1);
          activeEl.dispatchEvent(new Event("input", { bubbles: true }));
          setShortcutFeedback("Inserted ( ) Parentheses");
          clearTimeout(timeout);
          timeout = setTimeout(() => setShortcutFeedback(null), 1200);
        } else if (e.altKey && (e.key === "[" || e.key === "]")) {
          e.preventDefault();
          sound.playKeyClick();
          const start = activeEl.selectionStart;
          const end = activeEl.selectionEnd;
          const val = activeEl.value;
          activeEl.value = val.substring(0, start) + "[]" + val.substring(end);
          activeEl.setSelectionRange(start + 1, start + 1);
          activeEl.dispatchEvent(new Event("input", { bubbles: true }));
          setShortcutFeedback("Inserted [ ] Brackets");
          clearTimeout(timeout);
          timeout = setTimeout(() => setShortcutFeedback(null), 1200);
        } else if (e.altKey && (e.key === "{" || e.key === "}" || (e.shiftKey && e.key === "["))) {
          e.preventDefault();
          sound.playKeyClick();
          const start = activeEl.selectionStart;
          const end = activeEl.selectionEnd;
          const val = activeEl.value;
          activeEl.value = val.substring(0, start) + "{}" + val.substring(end);
          activeEl.setSelectionRange(start + 1, start + 1);
          activeEl.dispatchEvent(new Event("input", { bubbles: true }));
          setShortcutFeedback("Inserted { } Braces");
          clearTimeout(timeout);
          timeout = setTimeout(() => setShortcutFeedback(null), 1200);
        } else if (e.altKey && (e.key === '"' || (e.shiftKey && e.key === "'"))) {
          e.preventDefault();
          sound.playKeyClick();
          const start = activeEl.selectionStart;
          const end = activeEl.selectionEnd;
          const val = activeEl.value;
          activeEl.value = val.substring(0, start) + '""' + val.substring(end);
          activeEl.setSelectionRange(start + 1, start + 1);
          activeEl.dispatchEvent(new Event("input", { bubbles: true }));
          setShortcutFeedback('Inserted " " Double Quotes');
          clearTimeout(timeout);
          timeout = setTimeout(() => setShortcutFeedback(null), 1200);
        } else if (e.altKey && e.key === "'") {
          e.preventDefault();
          sound.playKeyClick();
          const start = activeEl.selectionStart;
          const end = activeEl.selectionEnd;
          const val = activeEl.value;
          activeEl.value = val.substring(0, start) + "''" + val.substring(end);
          activeEl.setSelectionRange(start + 1, start + 1);
          activeEl.dispatchEvent(new Event("input", { bubbles: true }));
          setShortcutFeedback("Inserted ' ' Single Quotes");
          clearTimeout(timeout);
          timeout = setTimeout(() => setShortcutFeedback(null), 1200);
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown, { capture: true });
      clearTimeout(timeout);
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Auth3D onAuthSuccess={handleAuthSuccess} />;
  }

  if (showSplash) {
    return <StartupSplash onStart={() => setShowSplash(false)} />;
  }

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-hidden">
      {/* Top Header & Bottom Navigation */}
      <Navigation />

      {/* Global Shortcut HUD Toast */}
      {shortcutFeedback && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs rounded-lg pointer-events-none flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>{shortcutFeedback}</span>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1 w-full overflow-y-auto overflow-x-hidden">
        {activeTab === "world" && <WorldMapView />}
        {activeTab === "arcade" && <ArcadeRacerView />}
        {activeTab === "missions" && <MissionsView />}
        {activeTab === "playground" && <PlaygroundView />}
        {activeTab === "skills" && <SkillTreeView />}
        {activeTab === "bosses" && <BossBattlesView />}
        {activeTab === "projects" && <ProjectsView />}
        {activeTab === "minigames" && <MiniGamesView />}
        {activeTab === "profile" && <ProfileView />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <MainGameContainer />
      </GameProvider>
    </AuthProvider>
  );
}
