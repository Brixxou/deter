import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Create Supabase client with cookies
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll() {
				return event.cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	// Check for our custom session cookies
	const accessToken = event.cookies.get('sb-access-token');
	const refreshToken = event.cookies.get('sb-refresh-token');

	if (accessToken) {
		// Set the session manually
		const { data: { user }, error } = await event.locals.supabase.auth.setSession({
			access_token: accessToken,
			refresh_token: refreshToken || ''
		});
		
		if (user && !error) {
			event.locals.user = user;
			
			// Get profile
			const { data: profile } = await event.locals.supabase
				.from('profiles')
				.select('*')
				.eq('id', user.id)
				.single();
			
			event.locals.profile = profile;
			
			// Check Strava connection
			const { data: stravaConnection } = await event.locals.supabase
				.from('strava_connections')
				.select('id')
				.eq('user_id', user.id)
				.single();
			
			event.locals.stravaConnected = !!stravaConnection;
		} else {
			// Invalid tokens, clear them
			event.cookies.delete('sb-access-token', { path: '/' });
			event.cookies.delete('sb-refresh-token', { path: '/' });
			event.locals.user = null;
			event.locals.profile = null;
			event.locals.stravaConnected = false;
		}
	} else {
		event.locals.user = null;
		event.locals.profile = null;
		event.locals.stravaConnected = false;
	}

	// Protect routes
	const protectedRoutes = ['/dashboard', '/calendar', '/friends', '/leaderboard', '/profile', '/settings'];
	const isProtectedRoute = protectedRoutes.some(route => event.url.pathname.startsWith(route));
	
	if (isProtectedRoute && !event.locals.user) {
		return new Response(null, {
			status: 302,
			headers: { Location: '/auth/login' }
		});
	}

	// Redirect logged-in users away from auth pages
	const authRoutes = ['/auth/login', '/auth/register'];
	const isAuthRoute = authRoutes.some(route => event.url.pathname.startsWith(route));
	
	if (isAuthRoute && event.locals.user) {
		return new Response(null, {
			status: 302,
			headers: { Location: '/dashboard' }
		});
	}

	return resolve(event);
};
