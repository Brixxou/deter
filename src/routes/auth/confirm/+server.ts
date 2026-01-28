import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/supabase';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const token_hash = url.searchParams.get('token_hash');
	const type = url.searchParams.get('type');
	const next = url.searchParams.get('next') || '/dashboard';
	
	if (!token_hash || !type) {
		throw redirect(302, '/auth/login?error=invalid_token');
	}
	
	// Verify the token and get the session
	const { data, error } = await supabaseAdmin.auth.verifyOtp({
		token_hash,
		type: type as 'magiclink' | 'signup' | 'recovery' | 'invite' | 'email_change'
	});
	
	if (error) {
		console.error('Token verification failed:', error);
		throw redirect(302, '/auth/login?error=verification_failed');
	}
	
	if (data.session) {
		// Set the session cookies
		cookies.set('sb-access-token', data.session.access_token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false, // Set to true in production with HTTPS
			maxAge: 60 * 60 * 24 * 7 // 7 days
		});
		
		cookies.set('sb-refresh-token', data.session.refresh_token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 60 * 60 * 24 * 30 // 30 days
		});
		
		console.log('Session created for user:', data.user?.email);
	}
	
	throw redirect(302, next);
};
