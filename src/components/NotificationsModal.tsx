import React, { useState, useEffect } from "react";
import { AccessibleModal } from "./ui/AccessibleModal";
import { EmptyNotifications } from "./ui/EmptyState";
import { Badge } from "./ui";
import { useToast } from "./ui/Toast";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  type: "friend_request" | "friend_accepted" | "challenge_received" | "guild_invitation" | "achievement_unlocked" | "level_up" | "rank_up" | "daily_reminder" | "event_start" | "event_end" | "battle_pass_reward" | "streak_milestone" | "system";
  title: string;
  message?: string;
  isRead: boolean;
  createdAt: Date;
  data?: Record<string, unknown>;
}

const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "achievement_unlocked",
    title: "Achievement Unlocked!",
    message: "You earned 'First Blood' for completing your first mission.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "n2",
    type: "level_up",
    title: "Level Up!",
    message: "You reached Level 5! New missions are now available.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "n3",
    type: "streak_milestone",
    title: "3-Day Streak!",
    message: "Keep it up! Your dedication is paying off.",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "n4",
    type: "daily_reminder",
    title: "Daily Reward Available",
    message: "Don't forget to claim your daily login bonus!",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
];

const typeIcons: Record<string, string> = {
  friend_request: "👥",
  friend_accepted: "🤝",
  challenge_received: "⚔️",
  guild_invitation: "🏰",
  achievement_unlocked: "🏆",
  level_up: "⬆️",
  rank_up: "🎖️",
  daily_reminder: "📅",
  event_start: "🎉",
  event_end: "⏰",
  battle_pass_reward: "⭐",
  streak_milestone: "🔥",
  system: "📢",
};

const typeColors: Record<string, "info" | "success" | "warning" | "error"> = {
  friend_request: "info",
  friend_accepted: "success",
  challenge_received: "warning",
  guild_invitation: "info",
  achievement_unlocked: "success",
  level_up: "success",
  rank_up: "success",
  daily_reminder: "info",
  event_start: "info",
  event_end: "warning",
  battle_pass_reward: "success",
  streak_milestone: "warning",
  system: "info",
};

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const { success, info } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filteredNotifications = filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications;

  const formatTimeAgo = (date: Date): string => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    success("All notifications marked as read");
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    info("Notification dismissed");
  };

  return (
    <AccessibleModal isOpen={isOpen} onClose={onClose} title="Notifications" size="md">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs cursor-pointer transition-colors ${
                filter === "all"
                  ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300"
                  : "bg-slate-800 border border-slate-700 text-slate-400 hover:text-white"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs cursor-pointer transition-colors ${
                filter === "unread"
                  ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300"
                  : "bg-slate-800 border border-slate-700 text-slate-400 hover:text-white"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-2 max-h-[50vh] overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <EmptyNotifications />
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                  notification.isRead
                    ? "bg-slate-800/30 border-slate-800"
                    : "bg-slate-800/50 border-slate-700"
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <span className="text-2xl flex-shrink-0">{typeIcons[notification.type]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-bold font-mono ${notification.isRead ? "text-slate-400" : "text-white"}`}>
                      {notification.title}
                    </p>
                    {!notification.isRead && (
                      <span className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0" />
                    )}
                  </div>
                  {notification.message && (
                    <p className="text-xs text-slate-400 mt-0.5">{notification.message}</p>
                  )}
                  <p className="text-[10px] text-slate-500 mt-1">{formatTimeAgo(notification.createdAt)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissNotification(notification.id);
                  }}
                  className="text-slate-500 hover:text-white text-sm cursor-pointer"
                  aria-label="Dismiss notification"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </AccessibleModal>
  );
};
