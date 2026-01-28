<script lang="ts">
	import { fly, fade, scale } from 'svelte/transition';
	import { cubicOut, elasticOut } from 'svelte/easing';
	import GlassButton from '$lib/components/GlassButton.svelte';
	import GlassCard from '$lib/components/GlassCard.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import { Activity, Users, Trophy, Zap, ChevronRight, Bike, Dumbbell, Timer } from 'lucide-svelte';
	
	// Fake demo users for the landing page
	const demoUsers = [
		{ name: 'Marie D.', activity: '5.2km Run', time: 'il y a 2h' },
		{ name: 'Thomas B.', activity: 'Musculation', time: 'il y a 3h' },
		{ name: 'Julie M.', activity: '45min Cycling', time: 'il y a 5h' },
	];
	
	const features = [
		{
			icon: Activity,
			title: 'Sync Strava',
			description: 'Connecte ton compte Strava pour synchroniser automatiquement tes séances'
		},
		{
			icon: Dumbbell,
			title: 'Log Basic Fit',
			description: 'Ajoute tes séances en salle manuellement avec nos templates rapides'
		},
		{
			icon: Users,
			title: 'Entre Amis',
			description: 'Invite tes amis et compare vos performances sur un calendrier partagé'
		},
		{
			icon: Trophy,
			title: 'Classements',
			description: 'Grimpe dans les classements et débloque des badges de progression'
		}
	];
</script>

<!-- Hero Section -->
<section class="relative min-h-screen flex items-center justify-center px-4 py-20">
	<div class="max-w-6xl mx-auto text-center">
		<!-- Animated badge -->
		<div 
			class="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8"
			in:fly={{ y: 30, duration: 600, delay: 100, easing: cubicOut }}
		>
			<div class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
			<span class="text-sm text-white/70">Disponible maintenant</span>
		</div>
		
		<!-- Main headline -->
		<h1 
			class="text-5xl md:text-7xl font-bold mb-6 leading-tight"
			in:fly={{ y: 30, duration: 600, delay: 200, easing: cubicOut }}
		>
			<span class="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
				Dépasse-toi
			</span>
			<br />
			<span class="bg-gradient-to-r from-primary-start via-primary-end to-accent-pink bg-clip-text text-transparent">
				Entre Amis
			</span>
		</h1>
		
		<p 
			class="text-xl text-white/60 max-w-2xl mx-auto mb-10"
			in:fly={{ y: 30, duration: 600, delay: 300, easing: cubicOut }}
		>
			Synchronise tes séances Strava et Basic Fit, visualise les entrainements de ton groupe, 
			et transforme chaque workout en compétition amicale.
		</p>
		
		<!-- CTA buttons -->
		<div 
			class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
			in:fly={{ y: 30, duration: 600, delay: 400, easing: cubicOut }}
		>
			<a href="/auth/register">
				<GlassButton variant="primary" size="lg">
					Créer un compte
					<ChevronRight class="w-5 h-5" />
				</GlassButton>
			</a>
			<a href="/auth/login">
				<GlassButton variant="default" size="lg">
					Se connecter
				</GlassButton>
			</a>
		</div>
		
		<!-- Demo activity feed -->
		<div 
			class="max-w-md mx-auto"
			in:fly={{ y: 30, duration: 600, delay: 500, easing: cubicOut }}
		>
			<GlassCard variant="strong">
				<div class="p-6">
					<div class="flex items-center justify-between mb-4">
						<h3 class="text-sm font-semibold text-white/80">Activité récente</h3>
						<div class="flex -space-x-2">
							{#each demoUsers as user}
								<Avatar name={user.name} size="xs" />
							{/each}
						</div>
					</div>
					
					<div class="space-y-3">
						{#each demoUsers as user, i}
							<div 
								class="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300"
								in:fly={{ x: -20, duration: 400, delay: 600 + (i * 100), easing: cubicOut }}
							>
								<Avatar name={user.name} size="sm" />
								<div class="flex-1 min-w-0">
									<p class="text-sm font-medium truncate">{user.name}</p>
									<p class="text-xs text-white/50">{user.activity}</p>
								</div>
								<span class="text-xs text-white/40">{user.time}</span>
							</div>
						{/each}
					</div>
				</div>
			</GlassCard>
		</div>
	</div>
	
	<!-- Scroll indicator -->
	<div 
		class="absolute bottom-8 left-1/2 -translate-x-1/2"
		in:fade={{ duration: 600, delay: 1000 }}
	>
		<div class="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
			<div class="w-1 h-2 rounded-full bg-white/40 animate-bounce"></div>
		</div>
	</div>
</section>

<!-- Features Section -->
<section class="py-24 px-4">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-16">
			<h2 class="text-3xl md:text-4xl font-bold mb-4">
				<span class="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
					Tout pour tracker ensemble
				</span>
			</h2>
			<p class="text-white/50 max-w-xl mx-auto">
				Une app simple et efficace pour suivre vos progrès fitness en groupe
			</p>
		</div>
		
		<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each features as feature, i}
				{@const FeatureIcon = feature.icon}
				<GlassCard delay={i * 100} glow>
					<div class="p-6">
						<div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-start to-primary-end flex items-center justify-center mb-4">
							<FeatureIcon class="w-6 h-6 text-white" />
						</div>
						<h3 class="text-lg font-semibold mb-2">{feature.title}</h3>
						<p class="text-sm text-white/50">{feature.description}</p>
					</div>
				</GlassCard>
			{/each}
		</div>
	</div>
</section>

<!-- Stats Preview Section -->
<section class="py-24 px-4">
	<div class="max-w-6xl mx-auto">
		<div class="grid lg:grid-cols-2 gap-12 items-center">
			<!-- Left: Stats cards -->
			<div class="space-y-4">
				<div class="grid grid-cols-2 gap-4">
					<GlassCard delay={0} glow>
						<div class="p-6 text-center">
							<div class="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-1">
								24.5
							</div>
							<div class="text-sm text-white/50">km cette semaine</div>
						</div>
					</GlassCard>
					
					<GlassCard delay={100} glow>
						<div class="p-6 text-center">
							<div class="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-1">
								7
							</div>
							<div class="text-sm text-white/50">séances</div>
						</div>
					</GlassCard>
					
					<GlassCard delay={200} glow>
						<div class="p-6 text-center">
							<div class="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-1">
								5h 32
							</div>
							<div class="text-sm text-white/50">temps actif</div>
						</div>
					</GlassCard>
					
					<GlassCard delay={300} glow>
						<div class="p-6 text-center">
							<div class="text-4xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent mb-1">
								#3
							</div>
							<div class="text-sm text-white/50">classement</div>
						</div>
					</GlassCard>
				</div>
			</div>
			
			<!-- Right: Description -->
			<div>
				<h2 class="text-3xl md:text-4xl font-bold mb-6">
					<span class="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
						Visualise tes stats<br />en un coup d'oeil
					</span>
				</h2>
				<p class="text-white/60 mb-8 leading-relaxed">
					Dashboard personnel avec toutes tes métriques importantes. Compare-toi à tes amis, 
					suis ta progression semaine après semaine, et reste motivé grâce aux classements.
				</p>
				<div class="flex flex-wrap gap-3">
					<div class="flex items-center gap-2 glass px-4 py-2 rounded-full">
						<Bike class="w-4 h-4 text-orange-400" />
						<span class="text-sm">Vélo</span>
					</div>
					<div class="flex items-center gap-2 glass px-4 py-2 rounded-full">
						<Activity class="w-4 h-4 text-green-400" />
						<span class="text-sm">Course</span>
					</div>
					<div class="flex items-center gap-2 glass px-4 py-2 rounded-full">
						<Dumbbell class="w-4 h-4 text-blue-400" />
						<span class="text-sm">Musculation</span>
					</div>
					<div class="flex items-center gap-2 glass px-4 py-2 rounded-full">
						<Timer class="w-4 h-4 text-pink-400" />
						<span class="text-sm">HIIT</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Final CTA -->
<section class="py-24 px-4">
	<div class="max-w-4xl mx-auto">
		<GlassCard variant="strong">
			<div class="p-12 text-center">
				<Zap class="w-12 h-12 mx-auto mb-6 text-yellow-400" />
				<h2 class="text-3xl md:text-4xl font-bold mb-4">
					<span class="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
						Prêt à te dépasser ?
					</span>
				</h2>
				<p class="text-white/60 mb-8 max-w-xl mx-auto">
					Rejoins la communauté DETER et commence à tracker tes séances avec tes amis dès aujourd'hui.
				</p>
				<a href="/auth/register">
					<GlassButton variant="primary" size="lg">
						Commencer gratuitement
						<ChevronRight class="w-5 h-5" />
					</GlassButton>
				</a>
			</div>
		</GlassCard>
	</div>
</section>

<!-- Footer -->
<footer class="py-12 px-4 border-t border-white/5">
	<div class="max-w-6xl mx-auto">
		<div class="flex flex-col md:flex-row items-center justify-between gap-4">
			<div class="flex items-center gap-3">
				<div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-start to-primary-end flex items-center justify-center">
					<Activity class="w-4 h-4 text-white" />
				</div>
				<span class="font-bold">DETER</span>
			</div>
			
			<p class="text-sm text-white/40">
				© 2026 DETER. Fait avec 💪 pour les sportifs.
			</p>
		</div>
	</div>
</footer>
