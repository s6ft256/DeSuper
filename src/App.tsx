import React, { useState } from "react";
import { GameProvider, useGame } from "./context/GameContext";
import { Navigation } from "./components/Navigation";
import { MissionsView } from "./components/MissionsView";
import { PlaygroundView } from "./components/PlaygroundView";
import { SkillTreeView } from "./components/SkillTreeView";
import { BossBattlesView } from "./components/BossBattlesView";
import { ProjectsView } from "./components/ProjectsView";
import { MiniGamesView } from "./components/MiniGamesView";
import { ProfileView } from "./components/ProfileView";
import { StartupSplash } from "./components/StartupSplash";

function MainGameContainer() {
  const { activeTab } = useGame();
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <StartupSplash onStart={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header & Bottom Navigation */}
      <Navigation />

      {/* Main View Router */}
      <main className="flex-1 w-full overflow-x-hidden">
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
    <GameProvider>
      <MainGameContainer />
    </GameProvider>
  );
}
