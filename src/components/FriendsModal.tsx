import React, { useState } from "react";
import { AccessibleModal } from "./ui/AccessibleModal";
import { EmptyFriends, ErrorState } from "./ui/EmptyState";
import { SkeletonList } from "./ui/Skeleton";
import { LoadingButton, Badge, ProgressBar } from "./ui";
import { useToast } from "./ui/Toast";

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Friend {
  id: string;
  name: string;
  rank: string;
  level: number;
  xp: number;
  status: "online" | "offline" | "in_mission";
  avatar: string;
  streak: number;
}

interface FriendRequest {
  id: string;
  name: string;
  rank: string;
  level: number;
  avatar: string;
  direction: "incoming" | "outgoing";
}

const mockFriends: Friend[] = [
  { id: "1", name: "CyberNinja42", rank: "CODER", level: 12, xp: 3200, status: "online", avatar: "🥷", streak: 7 },
  { id: "2", name: "PixelWizard", rank: "DEVELOPER", level: 18, xp: 4800, status: "in_mission", avatar: "🧙", streak: 14 },
  { id: "3", name: "ByteHunter", rank: "NOVICE", level: 5, xp: 800, status: "offline", avatar: "🎯", streak: 3 },
];

const mockRequests: FriendRequest[] = [
  { id: "r1", name: "QuantumCoder", rank: "ENGINEER", level: 22, avatar: "⚡", direction: "incoming" },
  { id: "r2", name: "NeonHacker", rank: "APPRENTICE", level: 8, avatar: "💻", direction: "outgoing" },
];

export const FriendsModal: React.FC<FriendsModalProps> = ({ isOpen, onClose }) => {
  const { success, info, error } = useToast();
  const [activeTab, setActiveTab] = useState<"friends" | "requests" | "add">("friends");
  const [friends, setFriends] = useState<Friend[]>(mockFriends);
  const [requests, setRequests] = useState<FriendRequest[]>(mockRequests);
  const [isLoading, setIsLoading] = useState(false);
  const [addFriendCode, setAddFriendCode] = useState("");
  const [searchResults, setSearchResults] = useState<Friend[]>([]);

  const handleAddFriend = () => {
    if (!addFriendCode.trim()) {
      info("Enter a friend code or username");
      return;
    }
    setIsLoading(true);
    // Simulate search
    setTimeout(() => {
      setSearchResults([
        { id: "new1", name: addFriendCode, rank: "NOVICE", level: 3, xp: 450, status: "offline", avatar: "🤖", streak: 1 },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const handleSendRequest = (friend: Friend) => {
    success(`Friend request sent to ${friend.name}!`);
    setSearchResults([]);
    setAddFriendCode("");
  };

  const handleAcceptRequest = (request: FriendRequest) => {
    setFriends((prev) => [
      ...prev,
      { id: request.id, name: request.name, rank: request.rank, level: request.level, xp: 0, status: "offline", avatar: request.avatar, streak: 0 },
    ]);
    setRequests((prev) => prev.filter((r) => r.id !== request.id));
    success(`You are now friends with ${request.name}!`);
  };

  const handleDeclineRequest = (request: FriendRequest) => {
    setRequests((prev) => prev.filter((r) => r.id !== request.id));
    info("Request declined");
  };

  const handleRemoveFriend = (friend: Friend) => {
    setFriends((prev) => prev.filter((f) => f.id !== friend.id));
    info(`Removed ${friend.name} from friends`);
  };

  const handleChallenge = (friend: Friend) => {
    info(`Challenge sent to ${friend.name}!`);
  };

  const statusColors = {
    online: "bg-emerald-500",
    offline: "bg-slate-500",
    in_mission: "bg-amber-500",
  };

  const statusLabels = {
    online: "Online",
    offline: "Offline",
    in_mission: "In Mission",
  };

  return (
    <AccessibleModal isOpen={isOpen} onClose={onClose} title="Friends" size="lg">
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl">
          {(["friends", "requests", "add"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 rounded-lg font-mono text-sm cursor-pointer transition-colors ${
                activeTab === tab
                  ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab === "friends" && `Friends (${friends.length})`}
              {tab === "requests" && `Requests (${requests.length})`}
              {tab === "add" && "Add Friend"}
            </button>
          ))}
        </div>

        {/* Friends List */}
        {activeTab === "friends" && (
          <div className="space-y-2 max-h-[50vh] overflow-y-auto">
            {friends.length === 0 ? (
              <EmptyFriends onAddFriend={() => setActiveTab("add")} />
            ) : (
              friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700"
                >
                  {/* Avatar with status */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-2xl">
                      {friend.avatar}
                    </div>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-800 ${statusColors[friend.status]}`}
                      aria-label={statusLabels[friend.status]}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold font-mono text-white truncate">{friend.name}</p>
                      <Badge variant="info" size="sm">{friend.rank}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-400">Lvl {friend.level}</span>
                      <span className="text-xs text-slate-400">🔥 {friend.streak} day streak</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleChallenge(friend)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono cursor-pointer hover:bg-cyan-500/30"
                    >
                      Challenge
                    </button>
                    <button
                      onClick={() => handleRemoveFriend(friend)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-mono cursor-pointer hover:bg-red-500/30"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Requests */}
        {activeTab === "requests" && (
          <div className="space-y-2 max-h-[50vh] overflow-y-auto">
            {requests.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">No pending requests</div>
            ) : (
              requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-2xl">
                    {request.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold font-mono text-white">{request.name}</p>
                      <Badge variant={request.direction === "incoming" ? "success" : "warning"} size="sm">
                        {request.direction === "incoming" ? "Incoming" : "Sent"}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {request.rank} • Level {request.level}
                    </p>
                  </div>
                  {request.direction === "incoming" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAcceptRequest(request)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono cursor-pointer hover:bg-emerald-500/30"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDeclineRequest(request)}
                        className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-mono cursor-pointer hover:bg-red-500/30"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Add Friend */}
        {activeTab === "add" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={addFriendCode}
                onChange={(e) => setAddFriendCode(e.target.value)}
                placeholder="Enter username or friend code"
                className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                aria-label="Friend code or username"
              />
              <LoadingButton isLoading={isLoading} onClick={handleAddFriend}>
                Search
              </LoadingButton>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-mono text-slate-400">Search Results:</p>
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-2xl">
                      {result.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold font-mono text-white">{result.name}</p>
                      <p className="text-xs text-slate-400">{result.rank} • Level {result.level}</p>
                    </div>
                    <button
                      onClick={() => handleSendRequest(result)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono cursor-pointer hover:bg-cyan-500/30"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Friend Code Display */}
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-center">
              <p className="text-xs text-slate-400 mb-2">Your Friend Code</p>
              <p className="text-2xl font-mono font-bold text-cyan-300">DS-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("DS-XXXXXX");
                  success("Friend code copied!");
                }}
                className="mt-2 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Copy to clipboard
              </button>
            </div>
          </div>
        )}
      </div>
    </AccessibleModal>
  );
};
