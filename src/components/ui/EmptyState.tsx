import React from "react";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "📭",
  title,
  description,
  action,
  className = "",
}) => (
  <div
    className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}
    role="status"
  >
    <span className="text-5xl mb-4 opacity-60" aria-hidden="true">
      {icon}
    </span>
    <h3 className="text-lg font-bold font-mono text-white mb-2">{title}</h3>
    {description && (
      <p className="text-sm text-slate-400 max-w-xs mb-4">{description}</p>
    )}
    {action && (
      <button
        onClick={action.onClick}
        className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 transition-colors text-sm font-mono cursor-pointer"
      >
        {action.label}
      </button>
    )}
  </div>
);

export const EmptyMissions: React.FC<{ onReset?: () => void }> = ({ onReset }) => (
  <EmptyState
    icon="🎯"
    title="All Missions Complete!"
    description="You've conquered every mission in this sector. Check back later for new content."
    action={onReset ? { label: "Reset Progress", onClick: onReset } : undefined}
  />
);

export const EmptyAchievements: React.FC = () => (
  <EmptyState
    icon="🏆"
    title="No Achievements Yet"
    description="Complete missions and challenges to unlock achievements."
  />
);

export const EmptyLeaderboard: React.FC = () => (
  <EmptyState
    icon="📊"
    title="Leaderboard Empty"
    description="Be the first to claim a spot on the leaderboard!"
  />
);

export const EmptyFriends: React.FC<{ onAddFriend?: () => void }> = ({ onAddFriend }) => (
  <EmptyState
    icon="👥"
    title="No Friends Yet"
    description="Add friends to compete and collaborate with them."
    action={onAddFriend ? { label: "Add Friend", onClick: onAddFriend } : undefined}
  />
);

export const EmptyNotifications: React.FC = () => (
  <EmptyState
    icon="🔔"
    title="No Notifications"
    description="You're all caught up! Check back later."
  />
);

export const ErrorState: React.FC<{
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}> = ({
  title = "Something went wrong",
  description = "An error occurred while loading this content.",
  onRetry,
  className = "",
}) => (
  <div
    className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}
    role="alert"
  >
    <span className="text-5xl mb-4 opacity-60" aria-hidden="true">
      ⚠️
    </span>
    <h3 className="text-lg font-bold font-mono text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-400 max-w-xs mb-4">{description}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 transition-colors text-sm font-mono cursor-pointer"
      >
        Try Again
      </button>
    )}
  </div>
);
