import { redirect } from '@sveltejs/kit';
import { STRAVA_CLIENT_ID } from '$env/static/private';
import { PUBLIC_APP_URL } from '$env/static/public';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const redirectUri = `${PUBLIC_APP_URL}/api/auth/strava/callback`;
	
	const params = new URLSearchParams({
		client_id: STRAVA_CLIENT_ID,
		redirect_uri: redirectUri,
		response_type: 'code',
		scope: 'activity:read_all,profile:read_all',
		approval_prompt: 'auto'
	});
	
	throw redirect(302, `https://www.strava.com/oauth/authorize?${params.toString()}`);
};
