// Analytics service - uses PostHog (free tier available)
// To enable: sign up at posthog.com, install posthog-js, and add API key to .env
// npm install posthog-js

const isDevelopment = import.meta.env.DEV;
const apiKey = import.meta.env.VITE_POSTHOG_API_KEY;
const apiHost = import.meta.env.VITE_POSTHOG_HOST || "https://app.posthog.com";

let posthog: any = null;
let isInitialized = false;

export const initAnalytics = async () => {
  if (isInitialized || !apiKey) {
    if (isDevelopment && !apiKey) {
      console.log("[Analytics] PostHog API key not set. Analytics disabled.");
    }
    return;
  }

  try {
    // Use fetch to dynamically load posthog-js at runtime
    // This avoids build-time resolution issues
    const script = document.createElement("script");
    script.src = "https://unpkg.com/posthog-js@latest/dist/array.js";
    script.onload = () => {
      posthog = (window as any).posthog;
      if (posthog) {
        posthog.init(apiKey, {
          api_host: apiHost,
          persistence: "localStorage",
          autocapture: !isDevelopment,
          capture_pageview: true,
          capture_pageleave: true,
          disable_session_recording: isDevelopment,
        });
        isInitialized = true;
      }
    };
    script.onerror = () => {
      console.warn("[Analytics] Failed to load PostHog script");
    };
    document.head.appendChild(script);
  } catch (error) {
    console.warn("[Analytics] Failed to initialize PostHog:", error);
    console.warn("[Analytics] Install posthog-js: npm install posthog-js");
  }
};

// Track custom events
export const trackEvent = (event: string, properties?: Record<string, unknown>) => {
  if (!isInitialized || !posthog) {
    if (isDevelopment) {
      console.log(`[Analytics] Event: ${event}`, properties);
    }
    return;
  }

  try {
    posthog.capture(event, properties);
  } catch (error) {
    console.warn("[Analytics] Track error:", error);
  }
};

// Track page views
export const trackPageView = (page: string) => {
  trackEvent("$pageview", { $current_url: page });
};

// Set user properties
export const identifyUser = (userId: string, properties?: Record<string, unknown>) => {
  if (!isInitialized || !posthog) return;

  try {
    posthog.identify(userId, properties);
  } catch (error) {
    console.warn("[Analytics] Identify error:", error);
  }
};

// Reset on logout
export const resetAnalytics = () => {
  if (!isInitialized || !posthog) return;

  try {
    posthog.reset();
  } catch (error) {
    console.warn("[Analytics] Reset error:", error);
  }
};

// Game-specific tracking events
export const GameAnalytics = {
  // Auth events
  signUp: (method: string) => trackEvent("user_signed_up", { method }),
  signIn: (method: string) => trackEvent("user_signed_in", { method }),
  signOut: () => trackEvent("user_signed_out"),

  // Mission events
  missionStarted: (missionId: string, difficulty: string) =>
    trackEvent("mission_started", { mission_id: missionId, difficulty }),
  missionCompleted: (missionId: string, xpEarned: number, attempts: number, timeSpentMs: number) =>
    trackEvent("mission_completed", {
      mission_id: missionId,
      xp_earned: xpEarned,
      attempts,
      time_spent_ms: timeSpentMs,
    }),
  missionFailed: (missionId: string, errorType: string) =>
    trackEvent("mission_failed", { mission_id: missionId, error_type: errorType }),

  // Boss events
  bossEncountered: (bossId: string) => trackEvent("boss_encountered", { boss_id: bossId }),
  bossDefeated: (bossId: string, attempts: number, timeSpentMs: number) =>
    trackEvent("boss_defeated", { boss_id: bossId, attempts, time_spent_ms: timeSpentMs }),
  bossFled: (bossId: string) => trackEvent("boss_fled", { boss_id: bossId }),

  // Skill events
  skillUnlocked: (skillId: string, branch: string) =>
    trackEvent("skill_unlocked", { skill_id: skillId, branch }),

  // Economy events
  coinsEarned: (amount: number, source: string) =>
    trackEvent("coins_earned", { amount, source }),
  coinsSpent: (amount: number, itemId: string) =>
    trackEvent("coins_spent", { amount, item_id: itemId }),
  gemsEarned: (amount: number, source: string) =>
    trackEvent("gems_earned", { amount, source }),
  gemsSpent: (amount: number, itemId: string) =>
    trackEvent("gems_spent", { amount, item_id: itemId }),

  // Subscription events
  subscriptionStarted: (plan: string, amount: number) =>
    trackEvent("subscription_started", { plan, amount }),
  subscriptionCancelled: (plan: string) =>
    trackEvent("subscription_cancelled", { plan }),

  // Social events
  friendAdded: (friendId: string) => trackEvent("friend_added", { friend_id: friendId }),
  challengeSent: (friendId: string) => trackEvent("challenge_sent", { friend_id: friendId }),
  leaderboardViewed: () => trackEvent("leaderboard_viewed"),

  // Engagement events
  dailyRewardClaimed: (streak: number) =>
    trackEvent("daily_reward_claimed", { streak }),
  battlePassTierReached: (tier: number) =>
    trackEvent("battle_pass_tier_reached", { tier }),
  achievementUnlocked: (achievementId: string) =>
    trackEvent("achievement_unlocked", { achievement_id: achievementId }),

  // Session events
  sessionStart: () => trackEvent("session_start"),
  sessionEnd: (durationMs: number) =>
    trackEvent("session_end", { duration_ms: durationMs }),

  // Error tracking
  errorOccurred: (errorType: string, context: string) =>
    trackEvent("error_occurred", { error_type: errorType, context }),
};

// Performance tracking
export const trackTiming = (name: string, durationMs: number) => {
  trackEvent("timing", { name, duration_ms: durationMs });
};

// Feature flag helpers
export const isFeatureEnabled = (flag: string): boolean => {
  if (!isInitialized || !posthog) return false;
  return posthog.isFeatureEnabled(flag) || false;
};
