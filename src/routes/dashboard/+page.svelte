<script lang="ts">
	import { fly, fade, scale } from 'svelte/transition';
	import { cubicOut, elasticOut } from 'svelte/easing';
	import GlassCard from '$lib/components/GlassCard.svelte';
	import GlassButton from '$lib/components/GlassButton.svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import { 
		Activity, TrendingUp, Clock, Flame, Plus, 
		ChevronRight, Bike, Dumbbell, Timer, MapPin,
		Calendar as CalendarIcon
	} from 'lucide-svelte';
	
	// Demo data - will be replaced with real data from Supabase
	const stats = {
		distance: { value: 24.5, unit: 'km', change: 12 },
		sessions: { value: 7, unit: '', change: -5 },
		time: { value: '5h 32', unit: '', change: 8 },
		calories: { value: 2840, unit: 'kcal', change: 15 }
	};
	
	const recentActivities = [
		{ 
			id: 1,
			type: 'run',
			name: 'Course matinale',
			date: 'Aujourd\'hui, 07:30',
			distance: '5.2 km',
			duration: '28:45',
			calories: 320,
			icon: Activity
		},
		{ 
			id: 2,
			type: 'gym',
			name: 'Musculation - Upper Body',
			date: 'Hier, 18:00',
			distance: null,
			duration: '1h 15',
			calories: 450,
			icon: Dumbbell
		},
		{ 
			id: 3,
			type: 'cycling',
			name: 'Vélo - Trajet travail',
			date: 'Hier, 08:15',
			distance: '12.3 km',
			duration: '35:20',
			calories: 280,
			icon: Bike
		},
		{ 
			id: 4,
			type: 'hiit',
			name: 'HIIT - Full Body',
			date: 'Lun. 27, 12:00',
			distance: null,
			duration: '30:00',
			calories: 380,
			icon: Timer
		}
	];
	
	const friendsActivity = [
		{ name: 'Marie D.', activity: '5.2km Run', time: 'il y a 2h', avatar: null },
		{ name: 'Thomas B.', activity: 'Musculation', time: 'il y a 3h', avatar: null },
		{ name: 'Julie M.', activity: '45min Cycling', time: 'il y a 5h', avatar: null },
		{ name: 'Lucas P.', activity: 'HIIT 30min', time: 'il y a 8h', avatar: null },
	];
	
	const activityColors: Record<string, string> = {
		run: 'from-green-400 to-green-600',
		gym: 'from-blue-400 to-blue-600',
		cycling: 'from-orange-400 to-orange-600',
		hiit: 'from-pink-400 to-pink-600'
	};
	
	function getGreeting(): string {
		const hour = new Date().getHours();
		if (hour < 12) return 'Bonjour';
		if (hour < 18) return 'Bon après-midi';
		return 'Bonsoir';
	}
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Header -->
	<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
		<div in:fly={{ y: 20, duration: 500, easing: cubicOut }}>
			<h1 class="text-3xl font-bold mb-1">
				{getGreeting()}, <span class="bg-gradient-to-r from-primary-start to-primary-end bg-clip-text text-transparent">Nathan</span> 👋
			</h1>
			<p class="text-white/50">
				Tu as déjà fait <span class="text-white font-medium">3 séances</span> cette semaine. Continue comme ça !
			</p>
		</div>
		
		<div class="flex items-center gap-3" in:fly={{ y: 20, duration: 500, delay: 100, easing: cubicOut }}>
			<a href="/workout/new">
				<GlassButton variant="primary">
					<Plus class="w-5 h-5" />
					Nouvelle séance
				</GlassButton>
			</a>
		</div>
	</div>
	
	<!-- Stats Grid -->
	<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
		<StatCard 
			title="Distance" 
			value={stats.distance.value} 
			unit={stats.distance.unit}
			change={stats.distance.change}
			color="orange"
			delay={0}
		>
			{#snippet icon()}
				<MapPin class="w-6 h-6 text-white" />
			{/snippet}
		</StatCard>
		
		<StatCard 
			title="Séances" 
			value={stats.sessions.value} 
			change={stats.sessions.change}
			color="blue"
			delay={50}
		>
			{#snippet icon()}
				<CalendarIcon class="w-6 h-6 text-white" />
			{/snippet}
		</StatCard>
		
		<StatCard 
			title="Temps actif" 
			value={stats.time.value}
			change={stats.time.change}
			color="green"
			delay={100}
		>
			{#snippet icon()}
				<Clock class="w-6 h-6 text-white" />
			{/snippet}
		</StatCard>
		
		<StatCard 
			title="Calories" 
			value={stats.calories.value} 
			unit={stats.calories.unit}
			change={stats.calories.change}
			color="pink"
			delay={150}
		>
			{#snippet icon()}
				<Flame class="w-6 h-6 text-white" />
			{/snippet}
		</StatCard>
	</div>
	
	<!-- Main content grid -->
	<div class="grid lg:grid-cols-3 gap-6">
		<!-- Recent Activities -->
		<div class="lg:col-span-2">
			<GlassCard delay={200}>
				<div class="p-6">
					<div class="flex items-center justify-between mb-6">
						<h2 class="text-xl font-semibold">Activités récentes</h2>
						<a href="/calendar" class="text-sm text-white/50 hover:text-white flex items-center gap-1 transition-colors">
							Voir tout
							<ChevronRight class="w-4 h-4" />
						</a>
					</div>
					
					<div class="space-y-4">
						{#each recentActivities as activity, i}
						{@const ActivityIcon = activity.icon}
						<div 
							class="group flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
							in:fly={{ x: -20, duration: 400, delay: 300 + (i * 80), easing: cubicOut }}
						>
							<!-- Activity icon -->
							<div class="w-12 h-12 rounded-2xl bg-gradient-to-br {activityColors[activity.type]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
								<ActivityIcon class="w-6 h-6 text-white" />
							</div>
							
							<!-- Activity info -->
							<div class="flex-1 min-w-0">
								<h3 class="font-medium truncate group-hover:text-primary-start transition-colors">
									{activity.name}
								</h3>
								<p class="text-sm text-white/50">{activity.date}</p>
							</div>
							
							<!-- Stats -->
							<div class="hidden sm:flex items-center gap-6 text-sm">
								{#if activity.distance}
									<div class="text-center">
										<p class="font-semibold">{activity.distance}</p>
										<p class="text-white/40 text-xs">Distance</p>
									</div>
								{/if}
								<div class="text-center">
									<p class="font-semibold">{activity.duration}</p>
									<p class="text-white/40 text-xs">Durée</p>
								</div>
								<div class="text-center">
									<p class="font-semibold text-orange-400">{activity.calories}</p>
									<p class="text-white/40 text-xs">kcal</p>
								</div>
							</div>
							
							<ChevronRight class="w-5 h-5 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
						</div>
						{/each}
					</div>
				</div>
			</GlassCard>
		</div>
		
		<!-- Friends Activity Feed -->
		<div>
			<GlassCard delay={300}>
				<div class="p-6">
					<div class="flex items-center justify-between mb-6">
						<h2 class="text-xl font-semibold">Amis</h2>
						<a href="/friends" class="text-sm text-white/50 hover:text-white flex items-center gap-1 transition-colors">
							Voir tous
							<ChevronRight class="w-4 h-4" />
						</a>
					</div>
					
					<div class="space-y-4">
						{#each friendsActivity as friend, i}
							<div 
								class="flex items-center gap-3 group cursor-pointer"
								in:fly={{ x: 20, duration: 400, delay: 400 + (i * 80), easing: cubicOut }}
							>
								<Avatar name={friend.name} size="md" showRing />
								<div class="flex-1 min-w-0">
									<p class="font-medium text-sm truncate group-hover:text-primary-start transition-colors">
										{friend.name}
									</p>
									<p class="text-xs text-white/50">{friend.activity}</p>
								</div>
								<span class="text-xs text-white/30">{friend.time}</span>
							</div>
						{/each}
					</div>
					
					<!-- Add friend CTA -->
					<div class="mt-6 pt-6 border-t border-white/10">
						<a 
							href="/friends/add"
							class="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/20 text-white/50 hover:border-primary-start hover:text-primary-start transition-all duration-300"
						>
							<Plus class="w-5 h-5" />
							<span class="text-sm">Inviter un ami</span>
						</a>
					</div>
				</div>
			</GlassCard>
			
			<!-- Quick Actions -->
			<GlassCard delay={400} class="mt-6">
				<div class="p-6">
					<h2 class="text-lg font-semibold mb-4">Actions rapides</h2>
					
					<div class="grid grid-cols-2 gap-3">
						<a 
							href="/workout/new?type=run"
							class="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-green-500/20 transition-all duration-300 group"
						>
							<Activity class="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
							<span class="text-sm">Course</span>
						</a>
						<a 
							href="/workout/new?type=gym"
							class="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-blue-500/20 transition-all duration-300 group"
						>
							<Dumbbell class="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
							<span class="text-sm">Muscu</span>
						</a>
						<a 
							href="/workout/new?type=cycling"
							class="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-orange-500/20 transition-all duration-300 group"
						>
							<Bike class="w-6 h-6 text-orange-400 group-hover:scale-110 transition-transform" />
							<span class="text-sm">Vélo</span>
						</a>
						<a 
							href="/workout/new?type=hiit"
							class="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-pink-500/20 transition-all duration-300 group"
						>
							<Timer class="w-6 h-6 text-pink-400 group-hover:scale-110 transition-transform" />
							<span class="text-sm">HIIT</span>
						</a>
					</div>
				</div>
			</GlassCard>
		</div>
	</div>
</div>
