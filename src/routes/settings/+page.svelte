<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import GlassCard from '$lib/components/GlassCard.svelte';
	import GlassButton from '$lib/components/GlassButton.svelte';
	import GlassInput from '$lib/components/GlassInput.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import { 
		User, Mail, Lock, Bell, Palette, Link, LogOut,
		ArrowLeft, Check, ChevronRight, Shield, Trash2
	} from 'lucide-svelte';
	
	let activeTab = $state('profile');
	
	// Mock user data
	let userName = $state('Nathan');
	let userEmail = $state('nathan@example.com');
	
	// Notification settings
	let notifications = $state({
		friendActivity: true,
		weeklyReport: true,
		achievements: true,
		reminders: false
	});
	
	// Connected services
	let stravaConnected = $state(false);
	
	const tabs = [
		{ id: 'profile', label: 'Profil', icon: User },
		{ id: 'notifications', label: 'Notifications', icon: Bell },
		{ id: 'connections', label: 'Connexions', icon: Link },
		{ id: 'security', label: 'Sécurité', icon: Shield },
	];
</script>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Header -->
	<div class="flex items-center gap-4 mb-8">
		<a 
			href="/dashboard"
			class="p-2 rounded-xl hover:bg-white/10 transition-colors"
			in:fly={{ x: -20, duration: 400, easing: cubicOut }}
		>
			<ArrowLeft class="w-5 h-5" />
		</a>
		<div in:fly={{ y: 20, duration: 500, easing: cubicOut }}>
			<h1 class="text-2xl font-bold">Paramètres</h1>
			<p class="text-white/50">Gère ton compte et tes préférences</p>
		</div>
	</div>
	
	<div class="grid lg:grid-cols-4 gap-6">
		<!-- Sidebar Navigation -->
		<div class="lg:col-span-1">
			<GlassCard delay={100}>
				<div class="p-4 space-y-1">
					{#each tabs as tab}
						{@const TabIcon = tab.icon}
						<button
							onclick={() => activeTab = tab.id}
							class="
								w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
								{activeTab === tab.id 
									? 'bg-white/15 text-white' 
									: 'text-white/60 hover:bg-white/5 hover:text-white'}
							"
						>
							<TabIcon class="w-5 h-5" />
							<span class="font-medium">{tab.label}</span>
						</button>
					{/each}
					
					<div class="h-px bg-white/10 my-2"></div>
					
					<button class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-300">
						<LogOut class="w-5 h-5" />
						<span class="font-medium">Déconnexion</span>
					</button>
				</div>
			</GlassCard>
		</div>
		
		<!-- Main Content -->
		<div class="lg:col-span-3">
			{#if activeTab === 'profile'}
				<GlassCard delay={200}>
					<div class="p-6">
						<h2 class="text-xl font-semibold mb-6">Informations du profil</h2>
						
						<!-- Avatar -->
						<div class="flex items-center gap-6 mb-8">
							<Avatar name={userName} size="xl" showRing />
							<div>
								<GlassButton variant="default" size="sm">
									Changer la photo
								</GlassButton>
								<p class="text-xs text-white/40 mt-2">JPG, PNG max 2MB</p>
							</div>
						</div>
						
						<!-- Form -->
						<div class="space-y-6">
							<GlassInput 
								type="text"
								label="Nom complet"
								bind:value={userName}
							>
								{#snippet icon()}
									<User class="w-5 h-5" />
								{/snippet}
							</GlassInput>
							
							<GlassInput 
								type="email"
								label="Email"
								bind:value={userEmail}
							>
								{#snippet icon()}
									<Mail class="w-5 h-5" />
								{/snippet}
							</GlassInput>
							
							<GlassButton variant="primary">
								<Check class="w-5 h-5" />
								Sauvegarder
							</GlassButton>
						</div>
					</div>
				</GlassCard>
			{:else if activeTab === 'notifications'}
				<GlassCard delay={200}>
					<div class="p-6">
						<h2 class="text-xl font-semibold mb-6">Préférences de notification</h2>
						
						<div class="space-y-4">
							{#each Object.entries({
								friendActivity: "Activité des amis",
								weeklyReport: "Rapport hebdomadaire",
								achievements: "Badges et accomplissements",
								reminders: "Rappels d'entraînement"
							}) as [key, label]}
								<label class="flex items-center justify-between p-4 rounded-xl bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
									<span class="font-medium">{label}</span>
									<div class="relative">
										<input 
											type="checkbox" 
											bind:checked={notifications[key as keyof typeof notifications]}
											class="sr-only peer"
										/>
										<div class="w-11 h-6 bg-white/20 rounded-full peer-checked:bg-primary-start transition-colors"></div>
										<div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
									</div>
								</label>
							{/each}
						</div>
					</div>
				</GlassCard>
			{:else if activeTab === 'connections'}
				<GlassCard delay={200}>
					<div class="p-6">
						<h2 class="text-xl font-semibold mb-6">Services connectés</h2>
						
						<div class="space-y-4">
							<!-- Strava -->
							<div class="flex items-center justify-between p-4 rounded-xl bg-white/5">
								<div class="flex items-center gap-4">
									<div class="w-12 h-12 rounded-xl bg-[#FC4C02] flex items-center justify-center">
										<svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
											<path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/>
										</svg>
									</div>
									<div>
										<h3 class="font-semibold">Strava</h3>
										<p class="text-sm text-white/50">
											{stravaConnected ? 'Connecté' : 'Non connecté'}
										</p>
									</div>
								</div>
								
								{#if stravaConnected}
									<GlassButton variant="ghost" size="sm" onclick={() => stravaConnected = false}>
										Déconnecter
									</GlassButton>
								{:else}
									<GlassButton variant="default" size="sm" onclick={() => stravaConnected = true}>
										Connecter
									</GlassButton>
								{/if}
							</div>
							
							<!-- Basic Fit (manual only) -->
							<div class="flex items-center justify-between p-4 rounded-xl bg-white/5">
								<div class="flex items-center gap-4">
									<div class="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center font-bold text-lg">
										BF
									</div>
									<div>
										<h3 class="font-semibold">Basic Fit</h3>
										<p class="text-sm text-white/50">
											Entrée manuelle uniquement
										</p>
									</div>
								</div>
								
								<span class="text-sm text-white/40 px-3 py-1 rounded-full bg-white/5">
									Pas d'API
								</span>
							</div>
						</div>
					</div>
				</GlassCard>
			{:else if activeTab === 'security'}
				<div class="space-y-6">
					<GlassCard delay={200}>
						<div class="p-6">
							<h2 class="text-xl font-semibold mb-6">Changer le mot de passe</h2>
							
							<div class="space-y-4">
								<GlassInput 
									type="password"
									label="Mot de passe actuel"
									placeholder="••••••••"
								>
									{#snippet icon()}
										<Lock class="w-5 h-5" />
									{/snippet}
								</GlassInput>
								
								<GlassInput 
									type="password"
									label="Nouveau mot de passe"
									placeholder="••••••••"
								>
									{#snippet icon()}
										<Lock class="w-5 h-5" />
									{/snippet}
								</GlassInput>
								
								<GlassInput 
									type="password"
									label="Confirmer le nouveau mot de passe"
									placeholder="••••••••"
								>
									{#snippet icon()}
										<Lock class="w-5 h-5" />
									{/snippet}
								</GlassInput>
								
								<GlassButton variant="primary">
									Mettre à jour
								</GlassButton>
							</div>
						</div>
					</GlassCard>
					
					<GlassCard delay={300}>
						<div class="p-6">
							<h2 class="text-xl font-semibold mb-2 text-red-400">Zone de danger</h2>
							<p class="text-sm text-white/50 mb-4">
								Ces actions sont irréversibles.
							</p>
							
							<GlassButton variant="ghost" class="!text-red-400 hover:!bg-red-500/20">
								<Trash2 class="w-5 h-5" />
								Supprimer mon compte
							</GlassButton>
						</div>
					</GlassCard>
				</div>
			{/if}
		</div>
	</div>
</div>
