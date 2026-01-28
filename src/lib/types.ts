// Types for the DETER fitness tracker app

export interface User {
	id: string;
	email: string;
	name: string;
	avatar_url?: string;
	created_at: string;
	strava_connected: boolean;
	strava_athlete_id?: number;
}

export interface Activity {
	id: string;
	user_id: string;
	type: ActivityType;
	name: string;
	date: string;
	time: string;
	duration_minutes: number;
	distance_km?: number;
	calories?: number;
	notes?: string;
	source: 'manual' | 'strava';
	strava_activity_id?: number;
	created_at: string;
}

export type ActivityType = 'run' | 'gym' | 'cycling' | 'hiit' | 'swim' | 'other';

export interface GymExercise {
	id: string;
	activity_id: string;
	name: string;
	sets: number;
	reps: number;
	weight_kg: number;
	order: number;
}

export interface Friendship {
	id: string;
	requester_id: string;
	addressee_id: string;
	status: 'pending' | 'accepted' | 'rejected';
	created_at: string;
}

export interface Friend extends User {
	sessions_this_month: number;
	last_active: string;
	status: 'online' | 'offline';
}

export interface LeaderboardEntry {
	rank: number;
	user: User;
	value: number;
	change: number;
	isYou: boolean;
}

export interface Stats {
	total_sessions: number;
	total_distance_km: number;
	total_time_minutes: number;
	total_calories: number;
	weekly_sessions: number;
	weekly_distance_km: number;
	weekly_time_minutes: number;
	weekly_calories: number;
}

// Strava types
export interface StravaTokens {
	access_token: string;
	refresh_token: string;
	expires_at: number;
}

export interface StravaAthlete {
	id: number;
	username: string;
	firstname: string;
	lastname: string;
	profile: string;
	profile_medium: string;
}

export interface StravaActivity {
	id: number;
	name: string;
	type: string;
	start_date: string;
	start_date_local: string;
	elapsed_time: number;
	moving_time: number;
	distance: number;
	total_elevation_gain: number;
	average_speed: number;
	max_speed: number;
	average_heartrate?: number;
	max_heartrate?: number;
	calories?: number;
}
