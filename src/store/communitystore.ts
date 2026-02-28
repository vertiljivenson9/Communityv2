import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Community, Membership, Post, Event, Poll, Category } from '@/types';

interface CommunityState {
  communities: Community[];
  myCommunities: Membership[];
  memberships: Membership[];
  currentCommunity: Community | null;
  currentMembership: Membership | null;
  posts: Post[];
  categories: Category[];
  events: Event[];
  polls: Poll[];
  isLoading: boolean;
  fetchCommunities: () => Promise<void>;
  fetchMyCommunities: () => Promise<void>;
  fetchCommunity: (slug: string) => Promise<void>;
  fetchCommunityBySlug: (slug: string) => Promise<void>;
  fetchCommunityPosts: (slug: string) => Promise<void>;
  fetchCommunityEvents: (slug: string) => Promise<void>;
  fetchCommunityPolls: (slug: string) => Promise<void>;
  fetchFeed: () => Promise<void>;
  createCommunity: (data: Partial<Community>) => Promise<{ data: Community | null; error: any }>;
  joinCommunity: (communityId: string) => Promise<{ error: any }>;
  leaveCommunity: (communityId: string) => Promise<{ error: any }>;
  fetchPosts: (communityId: string) => Promise<void>;
  fetchEvents: (communityId: string) => Promise<void>;
  fetchPolls: (communityId: string) => Promise<void>;
  createPost: (data: Partial<Post>) => Promise<{ error: any }>;
  createEvent: (data: Partial<Event>) => Promise<{ error: any }>;
  createPoll: (data: Partial<Poll>, options: string[]) => Promise<{ error: any }>;
  votePoll: (pollId: string, optionIds: string[]) => Promise<{ error: any }>;
  rsvpEvent: (eventId: string, status: 'confirmed' | 'cancelled') => Promise<{ error: any }>;
}

export const useCommunityStore = create<CommunityState>((set) => ({
  communities: [], myCommunities: [], memberships: [], currentCommunity: null, currentMembership: null,
  posts: [], categories: [], events: [], polls: [], isLoading: false,

  fetchCommunities: async () => {
    set({ isLoading: true });
    const { data } = await supabase.from('communities').select('*').order('created_at', { ascending: false });
    if (data) set({ communities: data as Community[] });
    set({ isLoading: false });
  },

  fetchMyCommunities: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('memberships').select('*, community:communities(*)').eq('user_id', user.id).eq('status', 'active').order('joined_at', { ascending: false });
    if (data) set({ myCommunities: data as Membership[] });
  },

  fetchCommunity: async (slug) => {
    set({ isLoading: true });
    const { data: { user } } = await supabase.auth.getUser();
    const { data: community } = await supabase.from('communities').select('*').eq('slug', slug).single();
    if (community) {
      set({ currentCommunity: community as Community });
      if (user) {
        const { data: membership } = await supabase.from('memberships').select('*').eq('community_id', (community as any).id).eq('user_id', user.id).single();
        set({ currentMembership: (membership as Membership) || null });
      }
    }
    set({ isLoading: false });
  },

  fetchCommunityBySlug: async (slug) => {
    set({ isLoading: true });
    const { data: { user } } = await supabase.auth.getUser();
    const { data: community } = await supabase.from('communities').select('*').eq('slug', slug).single();
    if (community) {
      set({ currentCommunity: community as Community });
      if (user) {
        const { data: membership } = await supabase.from('memberships').select('*').eq('community_id', (community as any).id).eq('user_id', user.id).single();
        set({ currentMembership: (membership as Membership) || null });
        const { data: memberships } = await supabase.from('memberships').select('*, community:communities(*)').eq('user_id', user.id);
        if (memberships) set({ memberships: memberships as Membership[] });
      }
    }
    set({ isLoading: false });
  },

  fetchCommunityPosts: async (slug) => {
    const { data: community } = await supabase.from('communities').select('id').eq('slug', slug).single();
    if (community) {
      const { data } = await supabase.from('posts').select('*, author:users(full_name, avatar_url)').eq('community_id', (community as any).id).order('created_at', { ascending: false });
      if (data) set({ posts: data as Post[] });
    }
  },

  fetchCommunityEvents: async (slug) => {
    const { data: community } = await supabase.from('communities').select('id').eq('slug', slug).single();
    if (community) {
      const { data } = await supabase.from('events').select('*').eq('community_id', (community as any).id).order('start_date', { ascending: true });
      if (data) set({ events: data as Event[] });
    }
  },

  fetchCommunityPolls: async (slug) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: community } = await supabase.from('communities').select('id').eq('slug', slug).single();
    if (community) {
      const { data: pollsData } = await supabase.from('polls').select('*').eq('community_id', (community as any).id);
      if (pollsData && user) {
        const pollsWithStatus = await Promise.all(pollsData.map(async (poll: any) => {
          const { data: options } = await supabase.from('poll_options').select('*').eq('poll_id', poll.id);
          const { data: vote } = await supabase.from('poll_votes').select('*').eq('poll_id', poll.id).eq('user_id', user.id).maybeSingle();
          return { ...poll, options, has_voted: !!vote };
        }));
        set({ polls: pollsWithStatus as Poll[] });
      }
    }
  },

  fetchFeed: async () => {
    set({ isLoading: true });
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: membershipsData } = await supabase.from('memberships').select('community_id').eq('user_id', user.id);
      if (membershipsData && membershipsData.length > 0) {
        const communityIds = membershipsData.map((m: any) => m.community_id);
        const { data: postsData } = await supabase.from('posts').select('*, author:users(full_name, avatar_url), community:communities(name, slug)').in('community_id', communityIds).order('created_at', { ascending: false }).limit(20);
        if (postsData) set({ posts: postsData as Post[] });
        const { data: eventsData } = await supabase.from('events').select('*, community:communities(name, slug)').in('community_id', communityIds).order('start_date', { ascending: true }).limit(10);
        if (eventsData) set({ events: eventsData as Event[] });
        const { data: pollsData } = await supabase.from('polls').select('*, community:communities(name, slug)').in('community_id', communityIds);
        if (pollsData) {
          const pollsWithOptions = await Promise.all(pollsData.map(async (poll: any) => {
            const { data: options } = await supabase.from('poll_options').select('*').eq('poll_id', poll.id);
            const { data: vote } = await supabase.from('poll_votes').select('*').eq('poll_id', poll.id).eq('user_id', user.id).maybeSingle();
            return { ...poll, options, has_voted: !!vote };
          }));
          set({ polls: pollsWithOptions as Poll[] });
        }
      }
      const { data: communitiesData } = await supabase.from('communities').select('*').limit(10);
      if (communitiesData) set({ communities: communitiesData as Community[] });
      const { data: memberships } = await supabase.from('memberships').select('*, community:communities(*)').eq('user_id', user.id);
      if (memberships) set({ memberships: memberships as Membership[] });
    }
    set({ isLoading: false });
  },

  createCommunity: async (data) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('Not authenticated') };
    const slug = data.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
    const { data: existing } = await supabase.from('communities').select('slug').eq('slug', slug).single();
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;
    const { data: community, error } = await supabase.from('communities').insert({
      ...data, slug: finalSlug, settings: { requireOnboarding: false, requireApproval: false, allowGuests: false, postsNeedApproval: false }
    }).select().single();
    if (!error && community) {
      await supabase.from('memberships').insert({ community_id: (community as any).id, user_id: user.id, role: 'admin', status: 'active' });
      return { data: community as Community, error: null };
    }
    return { data: null, error };
  },

  joinCommunity: async (communityId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: new Error('Not authenticated') };
    const { data: community } = await supabase.from('communities').select('settings').eq('id', communityId).single();
    const status = (community as any)?.settings?.requireApproval ? 'pending' : 'active';
    const { error } = await supabase.from('memberships').insert({ community_id: communityId, user_id: user.id, role: 'member', status });
    return { error };
  },

  leaveCommunity: async (communityId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: new Error('Not authenticated') };
    const { error } = await supabase.from('memberships').delete().eq('community_id', communityId).eq('user_id', user.id);
    if (!error) set({ currentMembership: null });
    return { error };
  },

  fetchPosts: async (communityId) => {
    const { data } = await supabase.from('posts').select('*, author:users(full_name, avatar_url), category:categories(name)').eq('community_id', communityId).order('is_pinned', { ascending: false }).order('created_at', { ascending: false });
    if (data) set({ posts: data as Post[] });
  },

  fetchEvents: async (communityId) => {
    const { data } = await supabase.from('events').select('*').eq('community_id', communityId).order('start_date', { ascending: true });
    if (data) set({ events: data as Event[] });
  },

  fetchPolls: async (communityId) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: pollsData } = await supabase.from('polls').select('*').eq('community_id', communityId).order('created_at', { ascending: false });
    if (pollsData && user) {
      const pollsWithStatus = await Promise.all(pollsData.map(async (poll: any) => {
        const { data: options } = await supabase.from('poll_options').select('*').eq('poll_id', poll.id).order('order', { ascending: true });
        const { data: vote } = await supabase.from('poll_votes').select('*').eq('poll_id', poll.id).eq('user_id', user.id).maybeSingle();
        return { ...poll, options, has_voted: !!vote };
      }));
      set({ polls: pollsWithStatus as Poll[] });
    }
  },

  createPost: async (data) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: new Error('Not authenticated') };
    const { error } = await supabase.from('posts').insert({ ...data, author_id: user.id });
    return { error };
  },

  createEvent: async (data) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: new Error('Not authenticated') };
    const { error } = await supabase.from('events').insert({ ...data, attendees_count: 0 });
    return { error };
  },

  createPoll: async (data, options) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: new Error('Not authenticated') };
    const { data: poll, error } = await supabase.from('polls').insert({ ...data, total_votes: 0 }).select().single();
    if (!error && poll) {
      const optionInserts = options.map((text, i) => ({ poll_id: (poll as any).id, option_text: text, votes_count: 0, order: i }));
      await supabase.from('poll_options').insert(optionInserts);
    }
    return { error };
  },

  votePoll: async (pollId, optionIds) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: new Error('Not authenticated') };
    const votes = optionIds.map(optionId => ({ poll_id: pollId, option_id: optionId, user_id: user.id }));
    const { error } = await supabase.from('poll_votes').insert(votes);
    if (!error) {
      for (const optionId of optionIds) {
        await supabase.rpc('increment_poll_option_votes', { option_id: optionId });
      }
      await supabase.rpc('increment_poll_total_votes', { poll_id: pollId });
    }
    return { error };
  },

  rsvpEvent: async (eventId, status) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: new Error('Not authenticated') };
    const { data: existing } = await supabase.from('event_attendees').select('*').eq('event_id', eventId).eq('user_id', user.id).single();
    if (existing) {
      await supabase.from('event_attendees').update({ status }).eq('id', (existing as any).id);
    } else {
      await supabase.from('event_attendees').insert({ event_id: eventId, user_id: user.id, status });
    }
    if (status === 'confirmed') await supabase.rpc('increment_event_attendees', { event_id: eventId });
    return { error: null };
  }
}));
