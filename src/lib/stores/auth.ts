import { writable } from 'svelte/store';
import type { User } from '@supabase/supabase-js';

interface AuthState {
	user: User | null;
	profile: {
		id: string;
		email: string;
		full_name: string | null;
		avatar_url: string | null;
	} | null;
	loading: boolean;
	stravaConnected: boolean;
}

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		profile: null,
		loading: true,
		stravaConnected: false
	});

	return {
		subscribe,
		setUser: (user: User | null) => update(state => ({ ...state, user, loading: false })),
		setProfile: (profile: AuthState['profile']) => update(state => ({ ...state, profile })),
		setStravaConnected: (connected: boolean) => update(state => ({ ...state, stravaConnected: connected })),
		setLoading: (loading: boolean) => update(state => ({ ...state, loading })),
		reset: () => set({ user: null, profile: null, loading: false, stravaConnected: false })
	};
}

export const auth = createAuthStore();
