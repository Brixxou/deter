<script lang="ts">
	import { fly, fade, scale } from 'svelte/transition';
	import { cubicOut, elasticOut } from 'svelte/easing';
	import GlassCard from '$lib/components/GlassCard.svelte';
	import GlassButton from '$lib/components/GlassButton.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import { 
		Trophy, Medal, TrendingUp, Activity, Flame, 
		Clock, MapPin, ChevronUp, ChevronDown, Minus
	} from 'lucide-svelte';
	
	type TimeFilter = 'week' | 'month' | 'all';
	type MetricFilter = 'sessions' | 'distance' | 'time' | 'calories';
	
	let timeFilter = $state<TimeFilter>('week');
	let metricFilter = $state<MetricFilter>('sessions');
	
	// Demo leaderboard data
	const leaderboardData = {
		sessions: [
			{ rank: 1, name: 'Julie Martin', value: 8, change: 0, avatar: null },
			{ rank: 2, name: 'Nathan', value: 7, change: 2, avatar: null, isYou: true },
			{ rank: 3, name: 'Marie Dupont', value: 6, change: -1, avatar: null },
			{ rank: 4, name: 'Thomas Bernard', value: 5, change: 1, avatar: null },
			{ rank: 5, name: 'Lucas Petit', value: 4, change: -2, avatar: null },
		],
		distance: [
			{ rank: 1, name: 'Thomas Bernard', value: 68.5, change: 1, avatar: null },
			{ rank: 2, name: 'Julie Martin', value: 52.3, change: -1, avatar: null },
			{ rank: 3, name: 'Nathan', value: 45.2, change: 0, avatar: null, isYou: true },
			{ rank: 4, name: 'Marie Dupont', value: 38.7, change: 2, avatar: null },
			{ rank: 5, name: 'Lucas Petit', value: 22.1, change: -1, avatar: null },
		],
		time: [
			{ rank: 1, name: 'Julie Martin', value: 12.5, change: 0, avatar: null },
			{ rank: 2, name: 'Marie Dupont', value: 10.2, change: 1, avatar: null },
			{ rank: 3, name: 'Thomas Bernard', value: 9.8, change: -1, avatar: null },
			{ rank: 4, name: 'Nathan', value: 8.5, change: 1, avatar: null, isYou: true },
			{ rank: 5, name: 'Lucas Petit', value: 6.2, change: 0, avatar: null },
		],
		calories: [
			{ rank: 1, name: 'Julie Martin', value: 4520, change: 0, avatar: null },
			{ rank: 2, name: 'Nathan', value: 3840, change: 2, avatar: null, isYou: true },
			{ rank: 3, name: 'Thomas Bernard', value: 3650, change: -1, avatar: null },
			{ rank: 4, name: 'Marie Dupont', value: 3200, change: 0, avatar: null },
			{ rank: 5, name: 'Lucas Petit', value: 2100, change: -1, avatar: null },
		],
	};
	
	const metricLabels: Record<MetricFilter, { label: string; unit: string; icon: typeof Activity }> = {
		sessions: { label: 'Séances', unit: '', icon: Activity },
		distance: { label: 'Distance', unit: 'km', icon: MapPin },
		time: { label: 'Temps', unit: 'h', icon: Clock },
		calories: { label: 'Calories', unit: 'kcal', icon: Flame }
	};
	
	const timeLabels: Record<TimeFilter, string> = {
		week: 'Cette semaine',
		month: 'Ce mois',
		all: 'Tout temps'
	};
	
	const currentLeaderboard = $derived(leaderboardData[metricFilter]);
	const yourRank = $derived(currentLeaderboard.find(p => p.isYou)?.rank || 0);
	const yourValue = $derived(currentLeaderboard.find(p => p.isYou)?.value || 0);
	
	function formatValue(value: number, metric: MetricFilter): string {
		if (metric === 'time') return value.toFixed(1);
		if (metric === 'distance') return value.toFixed(1);
		return value.toString();
	}
	
	function getRankColor(rank: number): string {
		switch (rank) {
			case 1: return 'from-yellow-400 to-yellow-600';
			case 2: return 'from-gray-300 to-gray-500';
			case 3: return 'from-orange-400 to-orange-600';
			default: return 'from-white/20 to-white/10';
		}
	}
	
	function getMedal(rank: number): string {
		switch (rank) {
			case 1: return '🥇';
			case 2: return '🥈';
			case 3: return '🥉';
			default: return '';
		}
	}
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Header -->
	<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
		<div in:fly={{ y: 20, duration: 500, easing: cubicOut }}>
			<h1 class="text-3xl font-bold mb-1">Classement</h1>
			<p class="text-white/50">
				Compare tes performances avec tes amis
			</p>
		</div>
	</div>
	
	<!-- Your Position Card -->
	<GlassCard delay={100} glow class="mb-8">
		<div class="p-8">
			<div class="flex flex-col md:flex-row items-center gap-8">
				<!-- Rank badge -->
				<div 
					class="relative"
					in:scale={{ duration: 600, delay: 300, easing: elasticOut }}
				>
					<div class="w-32 h-32 rounded-full bg-gradient-to-br {getRankColor(yourRank)} flex items-center justify-center shadow-2xl">
						<span class="text-5xl font-bold">#{yourRank}</span>
					</div>
					{#if yourRank <= 3}
						<div class="absolute -top-2 -right-2 text-4xl">
							{getMedal(yourRank)}
						</div>
					{/if}
				</div>
				
				<!-- Stats -->
				<div class="flex-1 text-center md:text-left">
					<h2 class="text-2xl font-bold mb-2">Ta position</h2>
					<p class="text-white/60 mb-4">
						Tu es #{yourRank} sur {currentLeaderboard.length} dans le classement {metricLabels[metricFilter].label.toLowerCase()}
					</p>
					
					<div class="flex flex-wrap justify-center md:justify-start gap-4">
						<div class="glass px-6 py-3 rounded-2xl">
							<p class="text-2xl font-bold bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">
								{formatValue(yourValue, metricFilter)}
								<span class="text-lg text-white/50">{metricLabels[metricFilter].unit}</span>
							</p>
							<p class="text-sm text-white/50">{timeLabels[timeFilter]}</p>
						</div>
						
						{#if yourRank > 1}
							{@const ahead = currentLeaderboard[yourRank - 2]}
							<div class="glass px-6 py-3 rounded-2xl">
								<p class="text-lg font-semibold text-orange-400">
									+{formatValue(ahead.value - yourValue, metricFilter)} {metricLabels[metricFilter].unit}
								</p>
								<p class="text-sm text-white/50">pour dépasser {ahead.name.split(' ')[0]}</p>
							</div>
						{/if}
					</div>
				</div>
				
				<!-- Trophy animation -->
				<div 
					class="hidden lg:block"
					in:fly={{ y: 30, duration: 600, delay: 400, easing: cubicOut }}
				>
					<Trophy class="w-24 h-24 text-yellow-400/30" />
				</div>
			</div>
		</div>
	</GlassCard>
	
	<div class="grid lg:grid-cols-3 gap-6">
		<!-- Leaderboard -->
		<div class="lg:col-span-2">
			<GlassCard delay={200}>
				<div class="p-6">
					<!-- Filters -->
					<div class="flex flex-col sm:flex-row gap-4 mb-6">
						<!-- Metric filter -->
						<div class="flex gap-2">
							{#each Object.entries(metricLabels) as [key, { label, icon: MetricIcon }]}
								<button 
									onclick={() => metricFilter = key as MetricFilter}
									class="
										flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
										{metricFilter === key 
											? 'bg-white/15 text-white' 
											: 'text-white/50 hover:text-white hover:bg-white/5'}
									"
								>
									<MetricIcon class="w-4 h-4" />
									<span class="hidden sm:inline">{label}</span>
								</button>
							{/each}
						</div>
						
						<!-- Time filter -->
						<div class="sm:ml-auto flex gap-2">
							{#each Object.entries(timeLabels) as [key, label]}
								<button 
									onclick={() => timeFilter = key as TimeFilter}
									class="
										px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
										{timeFilter === key 
											? 'bg-gradient-to-r from-primary-start to-primary-end text-white' 
											: 'text-white/50 hover:text-white hover:bg-white/5'}
									"
								>
									{label}
								</button>
							{/each}
						</div>
					</div>
					
					<!-- Leaderboard list -->
					<div class="space-y-3">
						{#each currentLeaderboard as player, i}
							<div 
								class="
									flex items-center gap-4 p-4 rounded-2xl transition-all duration-300
									{player.isYou 
										? 'bg-gradient-to-r from-primary-start/20 to-primary-end/20 ring-1 ring-primary-start/30' 
										: 'bg-white/5 hover:bg-white/10'}
								"
								in:fly={{ x: -30, duration: 400, delay: 300 + (i * 80), easing: cubicOut }}
							>
								<!-- Rank -->
								<div class="w-12 text-center">
									{#if player.rank <= 3}
										<span class="text-3xl">{getMedal(player.rank)}</span>
									{:else}
										<span class="text-2xl font-bold text-white/40">#{player.rank}</span>
									{/if}
								</div>
								
								<!-- Avatar & Name -->
								<div class="flex items-center gap-3 flex-1 min-w-0">
									<Avatar name={player.name} size="md" showRing={player.rank <= 3} />
									<div class="min-w-0">
										<h3 class="font-semibold truncate">
											{player.name}
											{#if player.isYou}
												<span class="text-xs text-primary-start ml-2">(toi)</span>
											{/if}
										</h3>
										{#if player.change !== 0}
											<div class="flex items-center gap-1 text-xs">
												{#if player.change > 0}
													<ChevronUp class="w-3 h-3 text-green-400" />
													<span class="text-green-400">+{player.change}</span>
												{:else}
													<ChevronDown class="w-3 h-3 text-red-400" />
													<span class="text-red-400">{player.change}</span>
												{/if}
											</div>
										{:else}
											<div class="flex items-center gap-1 text-xs text-white/40">
												<Minus class="w-3 h-3" />
												<span>stable</span>
											</div>
										{/if}
									</div>
								</div>
								
								<!-- Value -->
								<div class="text-right">
									<p class="text-2xl font-bold">
										{formatValue(player.value, metricFilter)}
									</p>
									<p class="text-xs text-white/40">{metricLabels[metricFilter].unit || metricLabels[metricFilter].label.toLowerCase()}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</GlassCard>
		</div>
		
		<!-- Sidebar -->
		<div>
			<!-- Personal Bests -->
			<GlassCard delay={400}>
				<div class="p-6">
					<h3 class="text-lg font-semibold mb-4">Tes records</h3>
					
					<div class="space-y-4">
						<div class="p-4 rounded-xl bg-white/5">
							<div class="flex items-center gap-3 mb-2">
								<div class="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
									<MapPin class="w-5 h-5 text-orange-400" />
								</div>
								<div>
									<p class="text-sm text-white/60">Plus longue distance</p>
									<p class="font-bold">21.5 km</p>
								</div>
							</div>
							<p class="text-xs text-white/40">Course du 15 janvier</p>
						</div>
						
						<div class="p-4 rounded-xl bg-white/5">
							<div class="flex items-center gap-3 mb-2">
								<div class="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
									<Clock class="w-5 h-5 text-green-400" />
								</div>
								<div>
									<p class="text-sm text-white/60">Plus longue séance</p>
									<p class="font-bold">2h 15min</p>
								</div>
							</div>
							<p class="text-xs text-white/40">Musculation du 8 janvier</p>
						</div>
						
						<div class="p-4 rounded-xl bg-white/5">
							<div class="flex items-center gap-3 mb-2">
								<div class="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
									<Flame class="w-5 h-5 text-pink-400" />
								</div>
								<div>
									<p class="text-sm text-white/60">Max calories brûlées</p>
									<p class="font-bold">850 kcal</p>
								</div>
							</div>
							<p class="text-xs text-white/40">HIIT du 12 janvier</p>
						</div>
					</div>
				</div>
			</GlassCard>
			
			<!-- Achievements -->
			<GlassCard delay={500} class="mt-6">
				<div class="p-6">
					<h3 class="text-lg font-semibold mb-4">Badges récents</h3>
					
					<div class="grid grid-cols-3 gap-3">
						{#each ['🔥', '💪', '🏃', '🚴', '⭐', '🎯'] as badge, i}
							<div 
								class="aspect-square rounded-2xl bg-white/5 flex items-center justify-center text-2xl hover:bg-white/10 hover:scale-110 transition-all duration-300 cursor-pointer"
								in:scale={{ duration: 400, delay: 600 + (i * 100), easing: elasticOut }}
							>
								{badge}
							</div>
						{/each}
					</div>
					
					<button class="w-full mt-4 text-center text-sm text-white/50 hover:text-white transition-colors">
						Voir tous les badges →
					</button>
				</div>
			</GlassCard>
		</div>
	</div>
</div>
