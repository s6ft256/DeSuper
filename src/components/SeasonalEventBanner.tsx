import React, { useState, useEffect } from "react";
import { useToast } from "./ui/Toast";

interface SeasonalEvent {
  id: string;
  name: string;
  description: string;
  theme: "cyberpunk" | "neon" | "glitch" | "matrix";
  startDate: Date;
  endDate: Date;
  specialMissions: string[];
  exclusiveRewards: { name: string; icon: string; cost: number }[];
  leaderboard: boolean;
  bannerColor: string;
  icon: string;
}

const seasonalEvents: SeasonalEvent[] = [
  {
    id: "neon_summer_2026",
    name: "Neon Summer",
    description: "The grids are overheating! Complete special missions to earn exclusive summer cosmetics.",
    theme: "neon",
    startDate: new Date("2026-06-01"),
    endDate: new Date("2026-08-31"),
    specialMissions: ["summer_m1", "summer_m2", "summer_m3"],
    exclusiveRewards: [
      { name: "Neon Shades", icon: "🕶️", cost: 500 },
      { name: "Summer Frame", icon: "🌴", cost: 300 },
      { name: "Beach Avatar", icon: "🏖️", cost: 450 },
    ],
    leaderboard: true,
    bannerColor: "from-amber-500/30 to-orange-500/30",
    icon: "☀️",
  },
  {
    id: "cyber_october_2026",
    name: "Cyber October",
    description: "The bugs are multiplying! Hunt them down for spooky rewards.",
    theme: "cyberpunk",
    startDate: new Date("2026-10-01"),
    endDate: new Date("2026-10-31"),
    specialMissions: ["october_m1", "october_m2", "october_m3"],
    exclusiveRewards: [
      { name: "Ghost Protocol", icon: "👻", cost: 600 },
      { name: "Pumpkin Badge", icon: "🎃", cost: 250 },
      { name: "Spider Web Frame", icon: "🕸️", cost: 400 },
    ],
    leaderboard: true,
    bannerColor: "from-orange-500/30 to-red-500/30",
    icon: "🎃",
  },
];

export const SeasonalEventBanner: React.FC = () => {
  const { info } = useToast();
  const [currentEvent, setCurrentEvent] = useState<SeasonalEvent | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const now = new Date();
    const active = seasonalEvents.find((e) => now >= e.startDate && now <= e.endDate);
    setCurrentEvent(active || seasonalEvents[0]); // Show next event if none active
  }, []);

  useEffect(() => {
    if (!currentEvent) return;

    const updateTimer = () => {
      const now = new Date();
      const end = currentEvent.endDate;
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Event Ended");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h left`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m left`);
      } else {
        setTimeLeft(`${minutes}m left`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [currentEvent]);

  if (!currentEvent || isDismissed) return null;

  return (
    <div
      className={`fixed top-16 left-4 right-4 z-30 px-4 py-2.5 rounded-xl bg-gradient-to-r ${currentEvent.bannerColor} border border-white/20 backdrop-blur-sm flex items-center gap-3 shadow-lg`}
      role="banner"
      aria-label="Seasonal event"
    >
      <span className="text-2xl animate-bounce" aria-hidden="true">
        {currentEvent.icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold font-mono text-white truncate">{currentEvent.name}</p>
        <p className="text-xs text-white/70 truncate">{currentEvent.description}</p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-xs font-mono text-white/80 px-2 py-1 rounded-lg bg-black/20">
          {timeLeft}
        </span>
        <button
          onClick={() => info(`Check the ${currentEvent.name} event in the Events tab!`)}
          className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-mono cursor-pointer transition-colors"
        >
          View
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-white/60 hover:text-white text-lg cursor-pointer"
          aria-label="Dismiss banner"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export const EventsPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="events-title"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="events-title" className="text-xl font-bold font-mono text-white">
            Seasonal Events
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            aria-label="Close events panel"
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>

        <div className="space-y-4">
          {seasonalEvents.map((event) => {
            const isActive = new Date() >= event.startDate && new Date() <= event.endDate;
            const isUpcoming = new Date() < event.startDate;

            return (
              <div
                key={event.id}
                className={`p-4 rounded-xl border ${
                  isActive
                    ? "bg-gradient-to-r " + event.bannerColor + " border-white/20"
                    : "bg-slate-800/50 border-slate-700"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{event.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold font-mono text-white">{event.name}</h3>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
                          Active
                        </span>
                      )}
                      {isUpcoming && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono">
                          Upcoming
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 mb-3">{event.description}</p>

                    <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                      <span>
                        {event.startDate.toLocaleDateString()} - {event.endDate.toLocaleDateString()}
                      </span>
                      <span>{event.specialMissions.length} Special Missions</span>
                    </div>

                    {/* Rewards Preview */}
                    <div className="flex gap-2 mt-3">
                      {event.exclusiveRewards.map((reward, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/20 border border-white/10"
                        >
                          <span>{reward.icon}</span>
                          <span className="text-xs text-slate-300">{reward.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
