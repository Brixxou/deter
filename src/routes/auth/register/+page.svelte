<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { goto } from '$app/navigation';
	import GlassCard from '$lib/components/GlassCard.svelte';
	import GlassButton from '$lib/components/GlassButton.svelte';
	import GlassInput from '$lib/components/GlassInput.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import { Mail, Lock, User, ArrowLeft, Check } from 'lucide-svelte';
	
	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);
	let error = $state('');
	let step = $state(1);
	
	const passwordRequirements = $derived([
		{ label: 'Au moins 8 caractères', valid: password.length >= 8 },
		{ label: 'Une majuscule', valid: /[A-Z]/.test(password) },
		{ label: 'Un chiffre', valid: /[0-9]/.test(password) },
	]);
	
	const passwordsMatch = $derived(password === confirmPassword && confirmPassword.length > 0);
	
	async function handleRegister(e: Event) {
		e.preventDefault();
		
		if (!passwordRequirements.every(r => r.valid)) {
			error = 'Le mot de passe ne respecte pas tous les critères';
			return;
		}
		
		if (!passwordsMatch) {
			error = 'Les mots de passe ne correspondent pas';
			return;
		}
		
		loading = true;
		error = '';
		
		// TODO: Implement actual registration with Supabase
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
			class="mb-8"
			in:fly={{ y: 20, duration: 400, delay: 100, easing: cubicOut }}
		>
			<Logo size="lg" />
			<p class="text-sm text-white/50 mt-2 ml-1">Créer un compte</p>
		</div>
		
		<!-- Registration form -->
		<GlassCard variant="strong" delay={200}>
			<form onsubmit={handleRegister} class="p-8 space-y-6">
				{#if error}
					<div 
						class="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
						in:fly={{ y: -10, duration: 300 }}
					>
						{error}
					</div>
				{/if}
				
				<GlassInput 
					type="text"
					label="Nom complet"
					placeholder="John Doe"
					bind:value={name}
					required
				>
					{#snippet icon()}
						<User class="w-5 h-5" />
					{/snippet}
				</GlassInput>
				
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
				
				<!-- Password requirements -->
				{#if password.length > 0}
					<div class="space-y-2" in:fly={{ y: -10, duration: 300 }}>
						{#each passwordRequirements as req}
							<div class="flex items-center gap-2 text-sm">
								<div 
									class="w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-300
										{req.valid ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/30'}"
								>
									<Check class="w-3 h-3" />
								</div>
								<span class="{req.valid ? 'text-green-400' : 'text-white/50'}">
									{req.label}
								</span>
							</div>
						{/each}
					</div>
				{/if}
				
				<GlassInput 
					type="password"
					label="Confirmer le mot de passe"
					placeholder="••••••••"
					bind:value={confirmPassword}
					error={confirmPassword.length > 0 && !passwordsMatch ? 'Les mots de passe ne correspondent pas' : ''}
					required
				>
					{#snippet icon()}
						<Lock class="w-5 h-5" />
					{/snippet}
				</GlassInput>
				
				<GlassButton variant="primary" size="lg" class="w-full" {loading}>
					{loading ? 'Création...' : 'Créer mon compte'}
				</GlassButton>
				
				<!-- Divider -->
				<div class="flex items-center gap-4">
					<div class="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
					<span class="text-sm text-white/40">ou</span>
					<div class="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
				</div>
				
				<!-- Strava OAuth -->
				<a href="/api/auth/strava" class="block">
					<GlassButton type="button" variant="default" size="lg" class="w-full !bg-[#FC4C02]/20 hover:!bg-[#FC4C02]/30 border-[#FC4C02]/30">
						<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
							<path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/>
						</svg>
						S'inscrire avec Strava
					</GlassButton>
				</a>
				
				<p class="text-center text-sm text-white/50">
					Déjà un compte ? 
					<a href="/auth/login" class="text-primary-start hover:underline">Se connecter</a>
				</p>
			</form>
		</GlassCard>
	</div>
</div>
