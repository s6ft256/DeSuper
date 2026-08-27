import React, { useState } from "react";
import { AccessibleModal } from "./ui/AccessibleModal";
import { EmptyState } from "./ui/EmptyState";
import { LoadingButton, Badge, ProgressBar } from "./ui";
import { useToast } from "./ui/Toast";

interface GuildsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Guild {
  id: string;
  name: string;
  tag: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  totalXp: number;
  rank: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";
  emblem: string;
  isRecruiting: boolean;
}

interface GuildMember {
  id: string;
  name: string;
  rank: "leader" | "officer" | "member" | "recruit";
  level: number;
  contributionXp: number;
  avatar: string;
}

const mockGuilds: Guild[] = [
  { id: "g1", name: "Cyber Knights", tag: "CK", description: "Elite coders united", memberCount: 45, maxMembers: 50, totalXp: 125000, rank: "DIAMOND", emblem: "⚔️", isRecruiting: true },
  { id: "g2", name: "Python Warriors", tag: "PW", description: "Masters of Python", memberCount: 32, maxMembers: 50, totalXp: 89000, rank: "PLATINUM", emblem: "🐍", isRecruiting: true },
  { id: "g3", name: "Neon Hackers", tag: "NH", description: "Breaking boundaries", memberCount: 28, maxMembers: 50, totalXp: 67000, rank: "GOLD", emblem: "💻", isRecruiting: false },
  { id: "g4", name: "Data Dragons", tag: "DD", description: "Data science experts", memberCount: 41, maxMembers: 50, totalXp: 110000, rank: "DIAMOND", emblem: "🐉", isRecruiting: true },
  { id: "g5", name: "Code Ninjas", tag: "CN", description: "Silent but deadly", memberCount: 19, maxMembers: 50, totalXp: 45000, rank: "SILVER", emblem: "🥷", isRecruiting: true },
];

const mockMembers: GuildMember[] = [
  { id: "m1", name: "CyberLeader", rank: "leader", level: 50, contributionXp: 25000, avatar: "👑" },
  { id: "m2", name: "CodeMaster", rank: "officer", level: 42, contributionXp: 18000, avatar: "⚡" },
  { id: "m3", name: "PythonPro", rank: "officer", level: 38, contributionXp: 15000, avatar: "🐍" },
  { id: "m4", name: "NeonNinja", rank: "member", level: 35, contributionXp: 12000, avatar: "🥷" },
  { id: "m5", name: "DataWizard", rank: "member", level: 30, contributionXp: 9000, avatar: "🧙" },
];

const rankColors: Record<string, string> = {
  BRONZE: "text-amber-600",
  SILVER: "text-slate-400",
  GOLD: "text-yellow-400",
  PLATINUM: "text-cyan-400",
  DIAMOND: "text-purple-400",
};

export const GuildsModal: React.FC<GuildsModalProps> = ({ isOpen, onClose }) => {
  const { success, info, error } = useToast();
  const [activeTab, setActiveTab] = useState<"browse" | "my-guild" | "create">("browse");
  const [guilds] = useState<Guild[]>(mockGuilds);
  const [myGuild] = useState<Guild | null>(mockGuilds[0]);
  const [members] = useState<GuildMember[]>(mockMembers);
  const [createGuildName, setCreateGuildName] = useState("");
  const [createGuildTag, setCreateGuildTag] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleJoinGuild = (guild: Guild) => {
    if (!guild.isRecruiting) {
      info(`${guild.name} is not currently recruiting`);
      return;
    }
    success(`Join request sent to ${guild.name}!`);
  };

  const handleCreateGuild = () => {
    if (!createGuildName.trim() || !createGuildTag.trim()) {
      info("Please enter a guild name and tag");
      return;
    }
    if (createGuildTag.length > 4) {
      info("Guild tag must be 4 characters or less");
      return;
    }
    setIsCreating(true);
    setTimeout(() => {
      success(`Guild ${createGuildName} created!`);
      setIsCreating(false);
      setCreateGuildName("");
      setCreateGuildTag("");
      setActiveTab("my-guild");
    }, 1500);
  };

  const handleLeaveGuild = () => {
    info("You left the guild");
  };

  return (
    <AccessibleModal isOpen={isOpen} onClose={onClose} title="Guilds" size="xl">
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl">
          {(["browse", "my-guild", "create"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 rounded-lg font-mono text-sm cursor-pointer transition-colors ${
                activeTab === tab
                  ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab === "browse" && "Browse Guilds"}
              {tab === "my-guild" && "My Guild"}
              {tab === "create" && "Create Guild"}
            </button>
          ))}
        </div>

        {/* Browse Guilds */}
        {activeTab === "browse" && (
          <div className="space-y-3 max-h-[50vh] overflow-y-auto">
            {guilds.length === 0 ? (
              <EmptyState
                icon="🏰"
                title="No Guilds Found"
                description="Be the first to create a guild!"
              />
            ) : (
              guilds.map((guild) => (
                <div
                  key={guild.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700"
                >
                  <div className="w-14 h-14 rounded-xl bg-slate-700 flex items-center justify-center text-3xl">
                    {guild.emblem}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold font-mono text-white">{guild.name}</h3>
                      <Badge variant="info" size="sm">[{guild.tag}]</Badge>
                      <span className={`text-xs font-mono font-bold ${rankColors[guild.rank]}`}>
                        {guild.rank}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{guild.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>👥 {guild.memberCount}/{guild.maxMembers}</span>
                      <span>⚡ {guild.totalXp.toLocaleString()} XP</span>
                      {guild.isRecruiting && (
                        <span className="text-emerald-400">● Recruiting</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleJoinGuild(guild)}
                    disabled={!guild.isRecruiting}
                    className={`px-4 py-2 rounded-lg font-mono text-xs cursor-pointer transition-colors ${
                      guild.isRecruiting
                        ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30"
                        : "bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    {guild.isRecruiting ? "Join" : "Closed"}
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* My Guild */}
        {activeTab === "my-guild" && (
          <div className="space-y-4 max-h-[50vh] overflow-y-auto">
            {!myGuild ? (
              <EmptyState
                icon="🏰"
                title="Not in a Guild"
                description="Join a guild or create your own to compete with others!"
                action={{ label: "Browse Guilds", onClick: () => setActiveTab("browse") }}
              />
            ) : (
              <>
                {/* Guild Header */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-4xl">
                      {myGuild.emblem}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold font-mono text-white">{myGuild.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="info" size="sm">[{myGuild.tag}]</Badge>
                        <span className={`text-xs font-mono font-bold ${rankColors[myGuild.rank]}`}>
                          {myGuild.rank}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{myGuild.memberCount}</p>
                      <p className="text-xs text-slate-400">Members</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{myGuild.totalXp.toLocaleString()}</p>
                      <p className="text-xs text-slate-400">Total XP</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">#{Math.floor(Math.random() * 100)}</p>
                      <p className="text-xs text-slate-400">Rank</p>
                    </div>
                  </div>
                </div>

                {/* Members List */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold font-mono text-slate-300">Members</h4>
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700"
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-xl">
                        {member.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold font-mono text-white">{member.name}</p>
                          <Badge
                            variant={member.rank === "leader" ? "success" : member.rank === "officer" ? "info" : "default"}
                            size="sm"
                          >
                            {member.rank.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400">Level {member.level} • {member.contributionXp.toLocaleString()} XP</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleLeaveGuild}
                  className="w-full py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 font-mono text-sm cursor-pointer hover:bg-red-500/30"
                >
                  Leave Guild
                </button>
              </>
            )}
          </div>
        )}

        {/* Create Guild */}
        {activeTab === "create" && (
          <div className="space-y-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <div>
              <label className="text-xs font-mono text-slate-400 mb-1 block">Guild Name</label>
              <input
                type="text"
                value={createGuildName}
                onChange={(e) => setCreateGuildName(e.target.value)}
                placeholder="Enter guild name"
                className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                maxLength={30}
              />
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400 mb-1 block">Guild Tag (4 chars max)</label>
              <input
                type="text"
                value={createGuildTag}
                onChange={(e) => setCreateGuildTag(e.target.value.toUpperCase())}
                placeholder="TAG"
                className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                maxLength={4}
              />
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400 mb-1 block">Description</label>
              <textarea
                placeholder="Describe your guild..."
                className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 resize-none"
                rows={3}
              />
            </div>
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <p className="text-xs text-amber-300">Creating a guild costs 500 coins</p>
            </div>
            <LoadingButton isLoading={isCreating} onClick={handleCreateGuild} className="w-full">
              Create Guild
            </LoadingButton>
          </div>
        )}
      </div>
    </AccessibleModal>
  );
};
