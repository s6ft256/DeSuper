import React, { useState, useRef } from "react";
import { useGame } from "../context/GameContext";
import { useAuth } from "../context/AuthContext";
import { RANKS, MISSIONS } from "../data/missions";
import {
  User,
  Award,
  Flame,
  CheckCircle2,
  Settings,
  Sparkles,
  Zap,
  RotateCcw,
  Camera,
  Save,
  X,
  Palette,
} from "lucide-react";
import { sound } from "../utils/audio";

const AVATAR_OPTIONS = [
  "cyber_ninja",
  "neon_warrior",
  "pixel_knight",
  "hologram_agent",
  "quantum_hacker",
  "binary_sage",
];

const THEME_COLORS = [
  { id: "cyan", color: "#06b6d4", name: "Cyan" },
  { id: "emerald", color: "#10b981", name: "Emerald" },
  { id: "violet", color: "#8b5cf6", name: "Violet" },
  { id: "rose", color: "#f43f5e", name: "Rose" },
  { id: "amber", color: "#f59e0b", name: "Amber" },
  { id: "blue", color: "#3b82f6", name: "Blue" },
];

export const ProfileView: React.FC = () => {
  const {
    player,
    dailyQuests,
    updateCustomization,
    resetGameProgress,
  } = useGame();
  const { updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<"stats" | "certificate" | "customizer" | "edit">("stats");
  const [nameInput, setNameInput] = useState(player.customization.name);
  const [badgeInput, setBadgeInput] = useState(player.customization.badgeTitle);
  const [selectedAvatar, setSelectedAvatar] = useState(player.customization.avatar);
  const [selectedTheme, setSelectedTheme] = useState(player.customization.themeAccent);
  const [selectedSuitColor, setSelectedSuitColor] = useState(player.customization.suitColor);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentRankInfo = RANKS.find((r) => r.id === player.rank) || RANKS[0];
  const completionPercentage = Math.round((player.completedMissions.length / MISSIONS.length) * 100);

  const handleSaveName = () => {
    sound.playKeyClick();
    updateCustomization({ name: nameInput });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setSaveMessage("Image must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setAvatarPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMessage(null);

    const updates: Record<string, string> = {
      display_name: nameInput,
      badge_title: badgeInput,
      avatar: avatarPreview || selectedAvatar,
      suit_color: selectedSuitColor,
      theme_accent: selectedTheme,
    };

    const result = await updateProfile(updates);
    
    if (result.success) {
      setSaveMessage("Profile saved successfully!");
      updateCustomization({
        name: nameInput,
        badgeTitle: badgeInput,
        avatar: avatarPreview || selectedAvatar,
        suitColor: selectedSuitColor,
        themeAccent: selectedTheme,
      });
    } else {
      setSaveMessage(result.error || "Failed to save profile");
    }
    
    setSaving(false);
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleCancelEdit = () => {
    setNameInput(player.customization.name);
    setBadgeInput(player.customization.badgeTitle);
    setSelectedAvatar(player.customization.avatar);
    setSelectedTheme(player.customization.themeAccent);
    setSelectedSuitColor(player.customization.suitColor);
    setAvatarPreview(null);
    setActiveTab("stats");
  };

  return (
    <div className="w-full px-3 sm:px-6 py-4 pb-24 space-y-6">
      <div className="p-5 sm:p-7 rounded-3xl bg-slate-900 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl border-2 flex items-center justify-center"
            style={{
              borderColor: player.customization.suitColor,
              backgroundColor: `${player.customization.suitColor}20`,
            }}
          >
            <User className="w-9 h-9" style={{ color: player.customization.suitColor }} />
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-slate-950 border border-slate-700 text-[10px] font-mono text-cyan-300 font-bold">
              {currentRankInfo.numericRank}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white font-mono">
                {player.customization.name}
              </h2>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-cyan-300 font-bold">
                {player.customization.badgeTitle}
              </span>
            </div>

            <p className="text-xs font-mono font-bold mt-0.5" style={{ color: currentRankInfo.color }}>
              RANK: {currentRankInfo.title} PYTHON CODER
            </p>
            <span className="text-[11px] font-mono text-slate-400">
              Level {player.level} • {player.xp} Total XP • {player.coins} Coins
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 font-mono text-amber-300">
          <Flame className="w-5 h-5 fill-current text-amber-400" />
          <div className="text-right">
            <span className="text-sm font-bold block">{player.streak} DAY STREAK</span>
            <span className="text-[9px] text-amber-300/90 font-medium">Active Protocol</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => {
            setActiveTab("stats");
            sound.playKeyClick();
          }}
          className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold cursor-pointer ${
            activeTab === "stats"
              ? "bg-slate-900 text-cyan-300 border border-slate-700"
              : "text-slate-400"
          }`}
        >
          Daily Quests & Stats
        </button>

        <button
          onClick={() => {
            setActiveTab("certificate");
            sound.playKeyClick();
          }}
          className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold cursor-pointer ${
            activeTab === "certificate"
              ? "bg-slate-900 text-cyan-300 border border-slate-700"
              : "text-slate-400"
          }`}
        >
          Rank Certificate
        </button>

        <button
          onClick={() => {
            setActiveTab("edit");
            sound.playKeyClick();
          }}
          className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold cursor-pointer flex items-center gap-1 ${
            activeTab === "edit"
              ? "bg-slate-900 text-cyan-300 border border-slate-700"
              : "text-slate-400"
          }`}
        >
          <Settings className="w-3 h-3" />
          Edit Profile
        </button>
      </div>

      {activeTab === "stats" && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-700 space-y-4">
            <div className="flex items-center justify-between font-mono text-xs text-slate-300 font-bold border-b border-slate-800 pb-2.5">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                ACTIVE DAILY PROTOCOLS
              </span>
              <span className="text-amber-400 bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-700">STREAK: {player.streak} DAYS</span>
            </div>

            <div className="space-y-2.5">
              {dailyQuests.map((q) => (
                <div
                  key={q.id}
                  className={`p-3.5 rounded-2xl border font-mono text-xs flex items-center justify-between ${
                    q.completed
                      ? "bg-slate-900 border-emerald-500/40 text-emerald-300"
                      : "bg-slate-950 border-slate-800 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${q.completed ? "bg-slate-800 text-emerald-300" : "bg-slate-800 text-slate-400"}`}>
                      {q.completed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Zap className="w-4 h-4 text-amber-400" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100">{q.title}</h4>
                      <p className="text-[11px] text-slate-400">{q.description}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-amber-300 font-bold block">
                      +{q.xpReward} XP / +{q.coinsReward} C
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {q.currentCount} / {q.targetCount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center font-mono">
              <span className="text-[10px] text-slate-400 block font-semibold">MISSIONS SOLVED</span>
              <span className="text-xl font-bold text-cyan-400 mt-1 block">
                {player.completedMissions.length} / {MISSIONS.length}
              </span>
              <span className="text-[10px] text-violet-400 font-semibold">{completionPercentage}% Mastered</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center font-mono">
              <span className="text-[10px] text-slate-400 block font-semibold">BOSS ANOMALIES</span>
              <span className="text-xl font-bold text-rose-400 mt-1 block">
                {player.defeatedBosses.length} Defeated
              </span>
              <span className="text-[10px] text-rose-400/80 font-semibold">Sector Guardians</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center font-mono">
              <span className="text-[10px] text-slate-400 block font-semibold">PROJECTS BUILT</span>
              <span className="text-xl font-bold text-emerald-400 mt-1 block">
                {player.completedProjects.length} Systems
              </span>
              <span className="text-[10px] text-emerald-400/80 font-semibold">Real-World Code</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center font-mono">
              <span className="text-[10px] text-slate-400 block font-semibold">SKILL NODES</span>
              <span className="text-xl font-bold text-amber-400 mt-1 block">
                {player.unlockedSkills.length} Unlocked
              </span>
              <span className="text-[10px] text-amber-400/80 font-semibold">Constellation Tree</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-300 font-bold block">Reset Local Game Progress</span>
              <span className="text-[10px] text-slate-500">
                Wipes all completed missions, XP, and returns to Rank 1.
              </span>
            </div>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to reset all game progress?")) {
                  resetGameProgress();
                }
              }}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-500/40 rounded-xl cursor-pointer"
            >
              Reset Data
            </button>
          </div>
        </div>
      )}

      {activeTab === "certificate" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-700 text-center space-y-6">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2 text-cyan-300 font-mono text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-4 h-4 text-slate-400" />
              <span>OFFICIAL PYTHON MASTERY CREDENTIAL</span>
              <Sparkles className="w-4 h-4 text-slate-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              DE SUPER — PYTHON CODER
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              DEVELOPED BY <strong className="text-cyan-300">s6ft</strong>
            </p>
          </div>

          <div className="py-4 border-y border-slate-700 space-y-2">
            <span className="text-xs font-mono text-slate-400">THIS CERTIFIES THAT OPERATIVE</span>
            <h2 className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">
              {player.customization.name.toUpperCase()}
            </h2>
            <span className="text-xs font-mono text-slate-400">
              HAS ATTAINED OFFICIAL COMPETENCY AND RANK:
            </span>

            <div className="inline-block px-6 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 mt-2">
              <span className="text-lg sm:text-xl font-black font-mono tracking-wider text-white">
                {currentRankInfo.title} PYTHON DEVELOPER
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono text-slate-400">
            <div>
              <span className="text-[10px] block">TOTAL XP</span>
              <strong className="text-cyan-300">{player.xp} XP</strong>
            </div>
            <div>
              <span className="text-[10px] block">COMPLETION</span>
              <strong className="text-emerald-300">{completionPercentage}%</strong>
            </div>
            <div>
              <span className="text-[10px] block">SECURITY CLEARANCE</span>
              <strong className="text-amber-300">TIER {currentRankInfo.numericRank} / 9</strong>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
            Verified by DeSuper Quantum Core • Cryptographic Seal #DS-{player.xp}-S6FT
          </div>
        </div>
      )}

      {activeTab === "edit" && (
        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-700 space-y-4">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              Avatar
            </h3>

            {/* Avatar Preview */}
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-2xl border-2 flex items-center justify-center overflow-hidden"
                style={{
                  borderColor: selectedSuitColor,
                  backgroundColor: `${selectedSuitColor}20`,
                }}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10" style={{ color: selectedSuitColor }} />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-600 rounded-xl text-xs font-mono cursor-pointer flex items-center gap-2"
                >
                  <Camera className="w-3 h-3" />
                  Upload Image
                </button>
                <p className="text-[10px] text-slate-500 font-mono">Max 2MB. PNG, JPG, or GIF.</p>
                {avatarPreview && (
                  <button
                    onClick={() => setAvatarPreview(null)}
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-mono cursor-pointer"
                  >
                    Remove upload
                  </button>
                )}
              </div>
            </div>

            {/* Avatar Presets */}
            <div>
              <p className="text-[10px] text-slate-400 font-mono mb-2">Or choose a preset:</p>
              <div className="flex flex-wrap gap-2">
                {AVATAR_OPTIONS.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => {
                      setSelectedAvatar(avatar);
                      setAvatarPreview(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono cursor-pointer border ${
                      selectedAvatar === avatar && !avatarPreview
                        ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                        : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {avatar.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-700 space-y-4">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              Profile Info
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">Display Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  maxLength={30}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">Badge Title</label>
                <input
                  type="text"
                  value={badgeInput}
                  onChange={(e) => setBadgeInput(e.target.value)}
                  maxLength={20}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
                  placeholder="REBOOT OPERATIVE"
                />
              </div>
            </div>
          </div>

          {/* Theme Customization */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-700 space-y-4">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-cyan-400" />
              Theme
            </h3>

            <div>
              <label className="text-[10px] text-slate-400 font-mono block mb-2">Accent Color</label>
              <div className="flex flex-wrap gap-2">
                {THEME_COLORS.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setSelectedTheme(theme.id);
                      setSelectedSuitColor(theme.color);
                    }}
                    className={`w-8 h-8 rounded-lg cursor-pointer border-2 ${
                      selectedTheme === theme.id ? "border-white" : "border-transparent"
                    }`}
                    style={{ backgroundColor: theme.color }}
                    title={theme.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-mono block mb-2">Suit Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={selectedSuitColor}
                  onChange={(e) => setSelectedSuitColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                />
                <span className="text-xs font-mono text-slate-400">{selectedSuitColor}</span>
              </div>
            </div>
          </div>

          {/* Save Message */}
          {saveMessage && (
            <div className={`p-3 rounded-xl text-xs font-mono ${
              saveMessage.includes("success")
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                : "bg-rose-500/20 border border-rose-500/40 text-rose-300"
            }`}>
              {saveMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex-1 px-4 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 rounded-xl text-cyan-300 font-mono text-sm font-bold cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Profile
                </>
              )}
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-400 font-mono text-sm font-bold cursor-pointer flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
