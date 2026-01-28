<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { goto } from '$app/navigation';
	import GlassCard from '$lib/components/GlassCard.svelte';
	import GlassButton from '$lib/components/GlassButton.svelte';
	import GlassInput from '$lib/components/GlassInput.svelte';
	import { Activity, Mail, Lock, ArrowLeft } from 'lucide-svelte';
	
	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state('');
	
	async function handleLogin(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';
		
		// TODO: Implement actual login with Supabase
		await new Promise(resolve => setTimeout(resolve, 1500));
		
		// For now, just redirect to dashboard
		goto('/dashboard');
	}
</script>

<div class="min-h-screen flex items-center justify-center px-4 py-12">
	<div class="w-full max-w-md">
		<!-- Back button -->
		<a 
			href="/"
			class="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors duration-300"
			in:fly={{ x: -20, duration: 400, delay: 0, easing: cubicOut }}
		>
			<ArrowLeft class="w-4 h-4" />
			<span>Retour</span>
		</a>
		
		<!-- Logo -->
		<div 
			class="flex items-center gap-3 mb-8"
			in:fly={{ y: 20, duration: 400, delay: 100, easing: cubicOut }}
		>
			<div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-start to-primary-end flex items-center justify-center shadow-lg">
				<Activity class="w-6 h-6 text-white" />
			</div>
			<div>
				<h1 class="text-2xl font-bold">DETER</h1>
				<p class="text-sm text-white/50">Connexion</p>
			</div>
		</div>
		
		<!-- Login form -->
		<GlassCard variant="strong" delay={200}>
			<form onsubmit={handleLogin} class="p-8 space-y-6">
				{#if error}
					<div 
						class="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
						in:fly={{ y: -10, duration: 300 }}
					>
						{error}
					</div>
				{/if}
				
				<GlassInput 
					type="email"
					label="Email"
					placeholder="ton@email.com"
					bind:value={email}
					required
				>
					{#snippet icon()}
						<Mail class="w-5 h-5" />
					{/snippet}
				</GlassInput>
				
				<GlassInput 
					type="password"
					label="Mot de passe"
					placeholder="••••••••"
					bind:value={password}
					required
				>
					{#snippet icon()}
						<Lock class="w-5 h-5" />
					{/snippet}
				</GlassInput>
				
				<div class="flex items-center justify-between text-sm">
					<label class="flex items-center gap-2 cursor-pointer">
						<input type="checkbox" class="w-4 h-4 rounded border-white/20 bg-white/10" />
						<span class="text-white/60">Se souvenir de moi</span>
					</label>
					<a href="/auth/forgot-password" class="text-primary-start hover:underline">
						Mot de passe oublié ?
					</a>
				</div>
				
				<GlassButton variant="primary" size="lg" class="w-full" {loading}>
					{loading ? 'Connexion...' : 'Se connecter'}
				</GlassButton>
				
				<!-- Divider -->
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<div class="w-full border-t border-white/10"></div>
					</div>
					<div class="relative flex justify-center text-sm">
						<span class="px-4 bg-transparent text-white/40">ou continuer avec</span>
					</div>
				</div>
				
				<!-- Strava OAuth -->
				<GlassButton variant="default" size="lg" class="w-full !bg-[#FC4C02]/20 hover:!bg-[#FC4C02]/30">
					<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
						<path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/>
					</svg>
					Connecter Strava
				</GlassButton>
				
				<p class="text-center text-sm text-white/50">
					Pas encore de compte ? 
					<a href="/auth/register" class="text-primary-start hover:underline">Créer un compte</a>
				</p>
			</form>
		</GlassCard>
	</div>
</div>
