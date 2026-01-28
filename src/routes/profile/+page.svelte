<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import GlassCard from '$lib/components/GlassCard.svelte';
	import GlassButton from '$lib/components/GlassButton.svelte';
	import { Activity, Calendar, Trophy, Flame, Clock, TrendingUp, Edit3, Camera, Link, Unlink } from 'lucide-svelte';
	
	// Get data from layout
	let { data } = $props();
	
	// Period selector
	type Period = 'week' | 'month' | 'year';
	let selectedPeriod = $state<Period>('week');
	
	const periodLabels = {
		week: 'Cette semaine',
		month: 'Ce mois',
		year: 'Cette année'
	};
	
	// Mock data per period
	const statsData = {
		week: {
			activities: 5,
			calories: 2450,
			hours: 6.5,
			distance: 28.3,
			avgCalories: 490,
			chartData: [4.2, 0, 5.1, 6.8, 0, 7.2, 5.0] // km per day
		},
		month: {
			activities: 18,
			calories: 9800,
			hours: 24,
			distance: 112,
			avgCalories: 545,
			chartData: [22, 28, 35, 27] // km per week
		},
		year: {
			activities: 127,
			calories: 45200,
			hours: 89,
			distance: 342,
			avgCalories: 520,
			chartData: [28, 32, 45, 38, 42, 55, 48, 52, 38, 42, 35, 28] // km per month
		}
	};
	
	const currentStats = $derived(statsData[selectedPeriod]);
	
	// Chart labels
	const chartLabels = {
		week: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
		month: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
		year: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
	};
	
	const maxChartValue = $derived(Math.max(...currentStats.chartData));
	
	const recentBadges = [
		{ name: 'Premier 10K', emoji: '🏃', date: 'Jan 2026' },
		{ name: 'Streak 7 jours', emoji: '🔥', date: 'Jan 2026' },
		{ name: 'Early Bird', emoji: '🌅', date: 'Déc 2025' },
	];
	
	function formatNumber(num: number): string {
		if (num >= 1000) {
			return (num / 1000).toFixed(1) + 'k';
		}
		return num.toString();
	}
	
	function getDisplayName(): string {
		if (data.profile?.full_name) return data.profile.full_name;
		if (data.user?.user_metadata?.full_name) return data.user.user_metadata.full_name;
		// Extract name from Strava email
		if (data.user?.email?.startsWith('strava_')) {
			return 'Athlete';
		}
		return 'Utilisateur';
	}
	
	function getInitials(): string {
		const name = getDisplayName();
		return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
	}
	
	function getAvatarUrl(): string | null {
		return data.profile?.avatar_url || data.user?.user_metadata?.avatar_url || null;
	}
</script>

<svelte:head>
	<title>Mon Profil - DETER</title>
</svelte:head>

<div class="min-h-screen pt-20 pb-12 px-4">
	<div class="max-w-4xl mx-auto space-y-6">
		<!-- Profile Header -->
		<div in:fly={{ y: 20, duration: 500, easing: cubicOut }}>
			<GlassCard variant="strong">
				<div class="p-8">
					<div class="flex flex-col sm:flex-row items-center gap-6">
						<!-- Avatar -->
						<div class="relative group">
							<div class="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary-start to-primary-end flex items-center justify-center text-4xl font-bold shadow-xl overflow-hidden">
								{#if getAvatarUrl()}
									<img 
										src={getAvatarUrl()} 
										alt="Avatar" 
										class="w-full h-full object-cover"
									/>
								{:else}
									{getInitials()}
								{/if}
							</div>
							<button class="absolute bottom-0 right-0 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/30">
								<Camera class="w-5 h-5" />
							</button>
						</div>
						
						<!-- Info -->
						<div class="flex-1 text-center sm:text-left">
							<h1 class="text-3xl font-bold mb-2">
								{getDisplayName()}
							</h1>
							
							<!-- Strava Connection Status -->
							<div class="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
								{#if data.stravaConnected}
									<div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FC4C02]/20 border border-[#FC4C02]/30">
										<Link class="w-4 h-4 text-[#FC4C02]" />
										<span class="text-sm text-[#FC4C02]">Strava connecté</span>
									</div>
								{:else}
									<a href="/api/auth/strava">
										<GlassButton size="sm" class="!bg-[#FC4C02]/20 hover:!bg-[#FC4C02]/30">
											<Unlink class="w-4 h-4" />
											Connecter Strava
										</GlassButton>
									</a>
								{/if}
								
								<a href="/settings">
									<GlassButton size="sm" variant="ghost">
										<Edit3 class="w-4 h-4" />
										Modifier
									</GlassButton>
								</a>
							</div>
						</div>
					</div>
				</div>
			</GlassCard>
		</div>
		
		<!-- Period Selector -->
		<div 
			class="flex justify-center"
			in:fly={{ y: 20, duration: 500, delay: 50, easing: cubicOut }}
		>
			<div class="inline-flex items-center gap-1 p-1 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
				{#each (['week', 'month', 'year'] as const) as period}
					<button
						class="px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
							{selectedPeriod === period 
								? 'bg-gradient-to-r from-primary-start to-primary-end text-white shadow-lg' 
								: 'text-white/60 hover:text-white hover:bg-white/10'}"
						onclick={() => selectedPeriod = period}
					>
						{periodLabels[period]}
					</button>
				{/each}
			</div>
		</div>
		
		<!-- Stats Grid -->
		<div 
			class="grid grid-cols-2 md:grid-cols-4 gap-4"
			in:fly={{ y: 20, duration: 500, delay: 100, easing: cubicOut }}
		>
			<GlassCard delay={150}>
				<div class="p-5 text-center">
					<div class="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
						<Activity class="w-5 h-5 text-white" />
					</div>
					<p class="text-2xl font-bold mb-0.5">{currentStats.activities}</p>
					<p class="text-xs text-white/50">Activités</p>
				</div>
			</GlassCard>
			
			<GlassCard delay={200}>
				<div class="p-5 text-center">
					<div class="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
						<Flame class="w-5 h-5 text-white" />
					</div>
					<p class="text-2xl font-bold mb-0.5">{formatNumber(currentStats.avgCalories)}</p>
					<p class="text-xs text-white/50">kcal/jour moy.</p>
				</div>
			</GlassCard>
			
			<GlassCard delay={250}>
				<div class="p-5 text-center">
					<div class="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
						<Clock class="w-5 h-5 text-white" />
					</div>
					<p class="text-2xl font-bold mb-0.5">{currentStats.hours}h</p>
					<p class="text-xs text-white/50">Temps total</p>
				</div>
			</GlassCard>
			
			<GlassCard delay={300}>
				<div class="p-5 text-center">
					<div class="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
						<TrendingUp class="w-5 h-5 text-white" />
					</div>
					<p class="text-2xl font-bold mb-0.5">{currentStats.distance} km</p>
					<p class="text-xs text-white/50">Distance</p>
				</div>
			</GlassCard>
		</div>
		
		<!-- Distance Chart -->
		<div in:fly={{ y: 20, duration: 500, delay: 150, easing: cubicOut }}>
			<GlassCard delay={350}>
				<div class="p-6">
					<div class="flex items-center justify-between mb-6">
						<h2 class="text-lg font-semibold flex items-center gap-2">
							<TrendingUp class="w-5 h-5 text-green-400" />
							Distance parcourue
						</h2>
						<span class="text-sm text-white/40">{periodLabels[selectedPeriod]}</span>
					</div>
					
					<!-- Chart -->
					<div class="flex items-end justify-between gap-2 h-40">
						{#each currentStats.chartData as value, i}
							{@const height = maxChartValue > 0 ? (value / maxChartValue) * 100 : 0}
							<div class="flex-1 flex flex-col items-center gap-2">
								<div class="w-full flex flex-col items-center justify-end h-32">
									<span class="text-xs text-white/60 mb-1">
										{value > 0 ? value.toFixed(1) : ''}
									</span>
									<div 
										class="w-full max-w-8 rounded-t-lg bg-gradient-to-t from-green-500/60 to-emerald-400/80 transition-all duration-500"
										style="height: {Math.max(height, 4)}%"
									></div>
								</div>
								<span class="text-xs text-white/40">{chartLabels[selectedPeriod][i]}</span>
							</div>
						{/each}
					</div>
					
					<!-- Total -->
					<div class="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
						<span class="text-white/50">Total</span>
						<span class="text-xl font-bold text-green-400">{currentStats.distance} km</span>
					</div>
				</div>
			</GlassCard>
		</div>
		
		<!-- Badges Section -->
		<div in:fly={{ y: 20, duration: 500, delay: 200, easing: cubicOut }}>
			<GlassCard delay={400}>
				<div class="p-6">
					<h2 class="text-lg font-semibold mb-5 flex items-center gap-2">
						<Trophy class="w-5 h-5 text-yellow-400" />
						Badges récents
					</h2>
					
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
						{#each recentBadges as badge, i}
							<div 
								class="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300"
								in:fly={{ x: -20, duration: 400, delay: 450 + i * 80, easing: cubicOut }}
							>
								<div class="text-3xl">{badge.emoji}</div>
								<div>
									<p class="font-medium text-sm">{badge.name}</p>
									<p class="text-xs text-white/40">{badge.date}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</GlassCard>
		</div>
		
		<!-- Bio Section -->
		<div in:fly={{ y: 20, duration: 500, delay: 250, easing: cubicOut }}>
			<GlassCard delay={500}>
				<div class="p-6">
					<h2 class="text-lg font-semibold mb-4">À propos</h2>
					{#if data.profile?.bio}
						<p class="text-white/70">{data.profile.bio}</p>
					{:else}
						<p class="text-white/40 italic">Aucune bio ajoutée. <a href="/settings" class="text-primary-start hover:underline">Ajouter une bio</a></p>
					{/if}
				</div>
			</GlassCard>
		</div>
	</div>
</div>
