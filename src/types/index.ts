export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  birth_date?: string;
  preferences: UserPreferences;
  last_login?: string;
  created_at: string;
}

export interface UserPreferences {
  lang: 'es' | 'fr';
  theme: string;
  unlockedThemes: string[];
  notifications?: boolean;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo_url: string;
  settings: CommunitySettings;
  max_members?: number;
  created_at: string;
  updated_at: string;
  member_count?: number;
}

export interface CommunitySettings {
  requireOnboarding: boolean;
  requireApproval: boolean;
  allowGuests: boolean;
  postsNeedApproval: boolean;
}

export interface Membership {
  id: string;
  community_id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'member' | 'guest';
  status: 'active' | 'suspended' | 'pending';
  joined_at: string;
  invited_by?: string;
  last_active?: string;
  onboarding_completed?: boolean;
  community?: Community;
  user?: User;
}

export interface Post {
  id: string;
  community_id: string;
  category_id?: string;
  author_id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  is_locked: boolean;
  replies_count: number;
  last_reply_at?: string;
  created_at: string;
  updated_at: string;
  author?: User;
  category?: { name: string };
}

export interface Event {
  id: string;
  community_id: string;
  title: string;
  description: string;
  location?: string;
  event_type: 'meetup' | 'webinar' | 'workshop' | 'social';
  start_date: string;
  end_date?: string;
  max_attendees?: number;
  attendees_count: number;
  created_at: string;
  updated_at: string;
}

export interface Poll {
  id: string;
  community_id: string;
  question: string;
  poll_type: 'single' | 'multiple';
  is_anonymous: boolean;
  expires_at?: string;
  total_votes: number;
  created_at: string;
  options?: PollOption[];
  has_voted?: boolean;
}

export interface PollOption {
  id: string;
  poll_id: string;
  option_text: string;
  votes_count: number;
  order: number;
}

export interface Category {
  id: string;
  community_id: string;
  name: string;
  description: string;
  order: number;
  created_at: string;
}

export type Theme = {
  id: string;
  name: string;
  nameEs: string;
  nameFr: string;
  isPremium: boolean;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
    card: string;
    border: string;
  };
};
