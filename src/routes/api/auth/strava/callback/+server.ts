import { redirect } from '@sveltejs/kit';
import { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_APP_URL } from '$env/static/public';
import { supabaseAdmin } from '$lib/server/supabase';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const error = url.searchParams.get('error');
	
	// Handle error from Strava
	if (error) {
		console.error('Strava OAuth error:', error);
		throw redirect(302, '/auth/login?error=strava_denied');
	}
	
	// No code received
	if (!code) {
		throw redirect(302, '/auth/login?error=no_code');
	}
	
	try {
		// Exchange code for tokens
		const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				client_id: STRAVA_CLIENT_ID,
				client_secret: STRAVA_CLIENT_SECRET,
				code: code,
				grant_type: 'authorization_code'
			})
		});
		
		if (!tokenResponse.ok) {
			const errorData = await tokenResponse.text();
			console.error('Strava token exchange failed:', errorData);
			throw redirect(302, '/auth/login?error=token_exchange_failed');
		}
		
		const tokenData = await tokenResponse.json();
		const athlete = tokenData.athlete;
		
		console.log('Strava auth successful for athlete:', athlete?.firstname, athlete?.lastname);
		
		// Create email from Strava ID (Strava doesn't provide email)
		const stravaEmail = `strava_${athlete.id}@deter.app`;
		const fullName = `${athlete.firstname || ''} ${athlete.lastname || ''}`.trim() || 'Athlete';
		const avatarUrl = athlete.profile || athlete.profile_medium;
		
		// Check if user already exists with this Strava ID
		const { data: existingConnection } = await supabaseAdmin
			.from('strava_connections')
			.select('user_id')
			.eq('strava_athlete_id', athlete.id)
			.single();
		
		let userId: string;
		
		if (existingConnection) {
			// User already exists, update tokens
			userId = existingConnection.user_id;
			
			await supabaseAdmin
				.from('strava_connections')
				.update({
					access_token: tokenData.access_token,
					refresh_token: tokenData.refresh_token,
					expires_at: new Date(tokenData.expires_at * 1000).toISOString(),
					scope: tokenData.scope || 'activity:read_all,profile:read_all'
				})
				.eq('strava_athlete_id', athlete.id);
				
			console.log('Updated existing Strava connection for user:', userId);
		} else {
			// Create new user in Supabase Auth
			const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
				email: stravaEmail,
				email_confirm: true,
				user_metadata: {
					full_name: fullName,
					avatar_url: avatarUrl,
					strava_id: athlete.id
				}
			});
			
			if (authError) {
				console.error('Failed to create user:', authError);
				throw redirect(302, '/auth/login?error=user_creation_failed');
			}
			
			userId = authData.user.id;
			
			// Create Strava connection
			const { error: connectionError } = await supabaseAdmin
				.from('strava_connections')
				.insert({
					user_id: userId,
					strava_athlete_id: athlete.id,
					access_token: tokenData.access_token,
					refresh_token: tokenData.refresh_token,
					expires_at: new Date(tokenData.expires_at * 1000).toISOString(),
					scope: tokenData.scope || 'activity:read_all,profile:read_all'
				});
			
			if (connectionError) {
				console.error('Failed to create Strava connection:', connectionError);
			}
			
			console.log('Created new user with Strava:', userId);
		}
		
		// Create a session for the user directly
		const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
			type: 'magiclink',
			email: stravaEmail
		});
		
		if (sessionError) {
			console.error('Failed to generate session:', sessionError);
			throw redirect(302, '/auth/login?error=session_failed');
		}
		
		// Now verify the token to get a proper session
		const token_hash = sessionData.properties.hashed_token;
		
		const { data: verifyData, error: verifyError } = await supabaseAdmin.auth.verifyOtp({
			token_hash,
			type: 'magiclink'
		});
		
		if (verifyError || !verifyData.session) {
			console.error('Failed to verify OTP:', verifyError);
			throw redirect(302, '/auth/login?error=session_creation_failed');
		}
		
		// Set session cookies
		cookies.set('sb-access-token', verifyData.session.access_token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 60 * 60 * 24 * 7 // 7 days
		});
		
		cookies.set('sb-refresh-token', verifyData.session.refresh_token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 60 * 60 * 24 * 30 // 30 days
		});
		
		console.log('Session cookies set for user:', verifyData.user?.email);
		
		throw redirect(302, '/dashboard');
		
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err && 'location' in err) {
			throw err; // Re-throw redirects
		}
		console.error('Strava callback error:', err);
		throw redirect(302, '/auth/login?error=callback_failed');
	}
};
