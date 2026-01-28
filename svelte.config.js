import adapterVercel from '@sveltejs/adapter-vercel';
import adapterNode from '@sveltejs/adapter-node';

// Use Node adapter for Docker builds, Vercel for Vercel deployments
const isDocker = process.env.DOCKER_BUILD === 'true';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: isDocker 
			? adapterNode({
				out: 'build',
				precompress: true
			})
			: adapterVercel({
				runtime: 'nodejs22.x'
			}),
		alias: {
			$components: 'src/lib/components',
			$stores: 'src/lib/stores',
			$utils: 'src/lib/utils'
		}
	}
};

export default config;
