-- DeSuper Database Migration v2
-- Adds support for: Friends, Guilds, Notifications, Battle Pass, Content Moderation
-- Run this after the initial schema.sql

-- ============================================
-- FRIENDS SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS friendships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  addressee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, addressee_id)
);

CREATE INDEX IF NOT EXISTS idx_friendships_requester ON friendships(requester_id);
CREATE INDEX IF NOT EXISTS idx_friendships_addressee ON friendships(addressee_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON friendships(status);

CREATE TABLE IF NOT EXISTS friend_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'expired')),
  winner_id UUID REFERENCES profiles(id),
  sender_score INTEGER,
  receiver_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_friend_challenges_sender ON friend_challenges(sender_id);
CREATE INDEX IF NOT EXISTS idx_friend_challenges_receiver ON friend_challenges(receiver_id);

-- ============================================
-- GUILDS SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS guilds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tag TEXT UNIQUE NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES profiles(id),
  member_count INTEGER DEFAULT 1,
  max_members INTEGER DEFAULT 50,
  total_xp INTEGER DEFAULT 0,
  rank TEXT DEFAULT 'BRONZE' CHECK (rank IN ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND')),
  emblem TEXT DEFAULT '🛡️',
  is_recruiting BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guilds_leader ON guilds(leader_id);
CREATE INDEX IF NOT EXISTS idx_guilds_rank ON guilds(rank);

CREATE TABLE IF NOT EXISTS guild_memberships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('leader', 'officer', 'member', 'recruit')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  contribution_xp INTEGER DEFAULT 0,
  UNIQUE(guild_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_guild_memberships_guild ON guild_memberships(guild_id);
CREATE INDEX IF NOT EXISTS idx_guild_memberships_user ON guild_memberships(user_id);

CREATE TABLE IF NOT EXISTS guild_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
  inviter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  invitee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(guild_id, invitee_id)
);

-- ============================================
-- NOTIFICATIONS SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'friend_request', 'friend_accepted', 'challenge_received',
    'guild_invitation', 'achievement_unlocked', 'level_up',
    'rank_up', 'daily_reminder', 'event_start', 'event_end',
    'battle_pass_reward', 'streak_milestone', 'system'
  )),
  title TEXT NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- ============================================
-- BATTLE PASS SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS battle_pass_seasons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  season_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  premium_price_coins INTEGER DEFAULT 1000,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS battle_pass_tiers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  season_id UUID REFERENCES battle_pass_seasons(id) ON DELETE CASCADE,
  tier_number INTEGER NOT NULL,
  xp_required INTEGER NOT NULL,
  free_reward_type TEXT CHECK (free_reward_type IN ('coins', 'gems', 'item', 'xp')),
  free_reward_amount INTEGER DEFAULT 0,
  free_reward_item_id TEXT,
  premium_reward_type TEXT CHECK (premium_reward_type IN ('coins', 'gems', 'item', 'xp')),
  premium_reward_amount INTEGER DEFAULT 0,
  premium_reward_item_id TEXT,
  UNIQUE(season_id, tier_number)
);

CREATE TABLE IF NOT EXISTS user_battle_pass (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  season_id UUID REFERENCES battle_pass_seasons(id) ON DELETE CASCADE,
  current_tier INTEGER DEFAULT 0,
  total_xp_earned INTEGER DEFAULT 0,
  has_premium BOOLEAN DEFAULT FALSE,
  claimed_tiers INTEGER[] DEFAULT '{}',
  purchased_at TIMESTAMPTZ,
  UNIQUE(user_id, season_id)
);

CREATE INDEX IF NOT EXISTS idx_user_battle_pass_user ON user_battle_pass(user_id);
CREATE INDEX IF NOT EXISTS idx_user_battle_pass_season ON user_battle_pass(season_id);

-- ============================================
-- CONTENT MODERATION
-- ============================================

CREATE TABLE IF NOT EXISTS content_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('code', 'message', 'username', 'guild_name')),
  content_id TEXT NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('inappropriate', 'cheating', 'spam', 'harassment', 'other')),
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'actioned', 'dismissed')),
  reviewed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_content_reports_status ON content_reports(status);
CREATE INDEX IF NOT EXISTS idx_content_reports_reporter ON content_reports(reporter_id);

-- ============================================
-- SEASONAL EVENTS
-- ============================================

CREATE TABLE IF NOT EXISTS seasonal_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  theme TEXT DEFAULT 'cyberpunk',
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  banner_color TEXT DEFAULT 'from-purple-500/30 to-cyan-500/30',
  icon TEXT DEFAULT '🎉',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES seasonal_events(id) ON DELETE CASCADE,
  mission_id TEXT NOT NULL,
  xp_reward_multiplier NUMERIC(3,2) DEFAULT 2.00,
  coins_reward_multiplier NUMERIC(3,2) DEFAULT 2.00,
  UNIQUE(event_id, mission_id)
);

CREATE TABLE IF NOT EXISTS event_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES seasonal_events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  cost_coins INTEGER DEFAULT 0,
  cost_gems INTEGER DEFAULT 0,
  is_exclusive BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS user_event_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES seasonal_events(id) ON DELETE CASCADE,
  missions_completed INTEGER[] DEFAULT '{}',
  rewards_claimed UUID[] DEFAULT '{}',
  total_xp_earned INTEGER DEFAULT 0,
  UNIQUE(user_id, event_id)
);

-- ============================================
-- RLS POLICIES
-- ============================================

-- Friendships policies
DROP POLICY IF EXISTS "Users can view their friendships" ON friendships;
CREATE POLICY "Users can view their friendships" ON friendships
  FOR SELECT USING (requester_id = auth.uid() OR addressee_id = auth.uid());

DROP POLICY IF EXISTS "Users can create friend requests" ON friendships;
CREATE POLICY "Users can create friend requests" ON friendships
  FOR INSERT WITH CHECK (requester_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their friendships" ON friendships;
CREATE POLICY "Users can update their friendships" ON friendships
  FOR UPDATE USING (requester_id = auth.uid() OR addressee_id = auth.uid());

-- Guilds policies
DROP POLICY IF EXISTS "Anyone can view guilds" ON guilds;
CREATE POLICY "Anyone can view guilds" ON guilds FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create guilds" ON guilds;
CREATE POLICY "Users can create guilds" ON guilds FOR INSERT WITH CHECK (leader_id = auth.uid());

DROP POLICY IF EXISTS "Leaders can update guilds" ON guilds;
CREATE POLICY "Leaders can update guilds" ON guilds FOR UPDATE USING (leader_id = auth.uid());

-- Notifications policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "System can create notifications" ON notifications;
CREATE POLICY "System can create notifications" ON notifications FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- Battle Pass policies
DROP POLICY IF EXISTS "Users can view own battle pass" ON user_battle_pass;
CREATE POLICY "Users can view own battle pass" ON user_battle_pass FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own battle pass" ON user_battle_pass;
CREATE POLICY "Users can update own battle pass" ON user_battle_pass FOR ALL USING (user_id = auth.uid());

-- ============================================
-- SEED DATA
-- ============================================

-- Insert Season 1 Battle Pass
INSERT INTO battle_pass_seasons (season_number, name, description, start_date, end_date, is_active, premium_price_coins)
VALUES (
  1,
  'Genesis Protocol',
  'The inaugural season of DeSuper. Earn exclusive rewards as you progress through the ranks.',
  NOW(),
  NOW() + INTERVAL '90 days',
  TRUE,
  1000
)
ON CONFLICT DO NOTHING;

-- Insert Neon Summer Event
INSERT INTO seasonal_events (name, description, theme, start_date, end_date, is_active, banner_color, icon)
VALUES (
  'Neon Summer',
  'The grids are overheating! Complete special missions to earn exclusive summer cosmetics.',
  'neon',
  NOW(),
  NOW() + INTERVAL '45 days',
  TRUE,
  'from-amber-500/30 to-orange-500/30',
  '☀️'
)
ON CONFLICT DO NOTHING;
