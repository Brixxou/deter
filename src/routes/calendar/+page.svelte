<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import GlassCard from '$lib/components/GlassCard.svelte';
	import GlassButton from '$lib/components/GlassButton.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import { 
		ChevronLeft, ChevronRight, Activity, Dumbbell, 
		Bike, Timer, Plus 
	} from 'lucide-svelte';
	
	// State
	let currentDate = $state(new Date());
	let selectedDate = $state<Date | null>(null);
	
	// Derived values
	const currentMonth = $derived(currentDate.getMonth());
	const currentYear = $derived(currentDate.getFullYear());
	
	const monthNames = [
		'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
		'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
	];
	
	const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
	
	// Demo activities data
	const activities: Record<string, Array<{
		id: number;
		user: string;
		type: string;
		name: string;
		time: string;
		duration: string;
		distance?: string;
	}>> = {
		'2026-01-28': [
			{ id: 1, user: 'Nathan', type: 'run', name: 'Course matinale', time: '07:30', duration: '28:45', distance: '5.2 km' },
			{ id: 2, user: 'Marie D.', type: 'gym', name: 'Musculation', time: '18:00', duration: '1h 15' },
		],
		'2026-01-27': [
			{ id: 3, user: 'Nathan', type: 'gym', name: 'Upper Body', time: '18:00', duration: '1h 15' },
			{ id: 4, user: 'Thomas B.', type: 'cycling', name: 'Vélo', time: '08:15', duration: '45:00', distance: '18 km' },
			{ id: 5, user: 'Julie M.', type: 'hiit', name: 'HIIT', time: '12:00', duration: '30:00' },
		],
		'2026-01-26': [
			{ id: 6, user: 'Nathan', type: 'cycling', name: 'Trajet travail', time: '08:15', duration: '35:20', distance: '12.3 km' },
		],
		'2026-01-25': [
			{ id: 7, user: 'Lucas P.', type: 'run', name: 'Course longue', time: '09:00', duration: '1h 02', distance: '10.5 km' },
		],
		'2026-01-24': [
			{ id: 8, user: 'Nathan', type: 'hiit', name: 'HIIT Full Body', time: '12:00', duration: '30:00' },
			{ id: 9, user: 'Marie D.', type: 'run', name: 'Jogging', time: '19:00', duration: '35:00', distance: '5 km' },
		],
	};
	
	const activityIcons: Record<string, typeof Activity> = {
		run: Activity,
		gym: Dumbbell,
		cycling: Bike,
		hiit: Timer
	};
	
	const activityColors: Record<string, string> = {
		run: 'bg-green-500',
		gym: 'bg-blue-500',
		cycling: 'bg-orange-500',
		hiit: 'bg-pink-500'
	};
	
	// Calendar calculation
	function getDaysInMonth(year: number, month: number): number {
		return new Date(year, month + 1, 0).getDate();
	}
	
	function getFirstDayOfMonth(year: number, month: number): number {
		const day = new Date(year, month, 1).getDay();
		return day === 0 ? 6 : day - 1; // Convert to Monday-first
	}
	
	function getCalendarDays(year: number, month: number) {
		const daysInMonth = getDaysInMonth(year, month);
		const firstDay = getFirstDayOfMonth(year, month);
		const daysInPrevMonth = getDaysInMonth(year, month - 1);
		
		const days: Array<{ date: Date; isCurrentMonth: boolean; isToday: boolean }> = [];
		
		// Previous month days
		for (let i = firstDay - 1; i >= 0; i--) {
			days.push({
				date: new Date(year, month - 1, daysInPrevMonth - i),
				isCurrentMonth: false,
				isToday: false
			});
		}
		
		// Current month days
		const today = new Date();
		for (let i = 1; i <= daysInMonth; i++) {
			const date = new Date(year, month, i);
			days.push({
				date,
				isCurrentMonth: true,
				isToday: date.toDateString() === today.toDateString()
			});
		}
		
		// Next month days
		const remainingDays = 42 - days.length;
		for (let i = 1; i <= remainingDays; i++) {
			days.push({
				date: new Date(year, month + 1, i),
				isCurrentMonth: false,
				isToday: false
			});
		}
		
		return days;
	}
	
	function formatDateKey(date: Date): string {
		return date.toISOString().split('T')[0];
	}
	
	function getActivitiesForDate(date: Date) {
		return activities[formatDateKey(date)] || [];
	}
	
	function getUniqueUsersForDate(date: Date): string[] {
		const dateActivities = getActivitiesForDate(date);
		return [...new Set(dateActivities.map(a => a.user))];
	}
	
	function prevMonth() {
		currentDate = new Date(currentYear, currentMonth - 1, 1);
	}
	
	function nextMonth() {
		currentDate = new Date(currentYear, currentMonth + 1, 1);
	}
	
	function selectDate(date: Date) {
		selectedDate = date;
	}
	
	const calendarDays = $derived(getCalendarDays(currentYear, currentMonth));
	const selectedDateActivities = $derived(selectedDate ? getActivitiesForDate(selectedDate) : []);
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Header -->
	<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
		<div in:fly={{ y: 20, duration: 500, easing: cubicOut }}>
			<h1 class="text-3xl font-bold mb-1">Calendrier</h1>
			<p class="text-white/50">
				Visualise les séances de ton groupe
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
	
	<div class="grid lg:grid-cols-3 gap-6">
		<!-- Calendar -->
		<div class="lg:col-span-2">
			<GlassCard delay={100}>
				<div class="p-6">
					<!-- Month navigation -->
					<div class="flex items-center justify-between mb-6">
						<button 
							onclick={prevMonth}
							class="p-2 rounded-xl hover:bg-white/10 transition-colors"
						>
							<ChevronLeft class="w-5 h-5" />
						</button>
						
						<h2 class="text-xl font-semibold">
							{monthNames[currentMonth]} {currentYear}
						</h2>
						
						<button 
							onclick={nextMonth}
							class="p-2 rounded-xl hover:bg-white/10 transition-colors"
						>
							<ChevronRight class="w-5 h-5" />
						</button>
					</div>
					
					<!-- Day headers -->
					<div class="grid grid-cols-7 gap-1 mb-2">
						{#each dayNames as day}
							<div class="text-center text-sm text-white/50 py-2">
								{day}
							</div>
						{/each}
					</div>
					
					<!-- Calendar grid -->
					<div class="grid grid-cols-7 gap-1">
						{#each calendarDays as day, i}
							{@const dayActivities = getActivitiesForDate(day.date)}
							{@const users = getUniqueUsersForDate(day.date)}
							{@const isSelected = selectedDate?.toDateString() === day.date.toDateString()}
							
							<button
								onclick={() => selectDate(day.date)}
								class="
									relative aspect-square p-1 rounded-xl transition-all duration-300
									{day.isCurrentMonth ? 'hover:bg-white/10' : 'opacity-30'}
									{day.isToday ? 'ring-2 ring-primary-start' : ''}
									{isSelected ? 'bg-white/15 ring-2 ring-white/30' : ''}
								"
								in:fly={{ y: 10, duration: 300, delay: i * 10, easing: cubicOut }}
							>
								<span class="
									text-sm font-medium
									{day.isToday ? 'text-primary-start' : ''}
								">
									{day.date.getDate()}
								</span>
								
								<!-- Activity indicators -->
								{#if dayActivities.length > 0}
									<div class="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
										{#each dayActivities.slice(0, 3) as activity}
											<div class="w-1.5 h-1.5 rounded-full {activityColors[activity.type]}"></div>
										{/each}
										{#if dayActivities.length > 3}
											<div class="w-1.5 h-1.5 rounded-full bg-white/50"></div>
										{/if}
									</div>
								{/if}
								
								<!-- User avatars (on hover/selected) -->
								{#if users.length > 0 && (isSelected)}
									<div 
										class="absolute -top-2 -right-2 flex -space-x-1"
										in:scale={{ duration: 200 }}
									>
										{#each users.slice(0, 2) as user}
											<Avatar name={user} size="xs" />
										{/each}
									</div>
								{/if}
							</button>
						{/each}
					</div>
					
					<!-- Legend -->
					<div class="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-white/10">
						{#each Object.entries(activityColors) as [type, color]}
							<div class="flex items-center gap-2 text-sm text-white/60">
								<div class="w-3 h-3 rounded-full {color}"></div>
								<span class="capitalize">{type === 'gym' ? 'Muscu' : type}</span>
							</div>
						{/each}
					</div>
				</div>
			</GlassCard>
		</div>
		
		<!-- Selected Day Details -->
		<div>
			<GlassCard delay={200}>
				<div class="p-6">
					{#if selectedDate}
						<div in:fade={{ duration: 200 }}>
							<h3 class="text-lg font-semibold mb-1">
								{selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
							</h3>
							<p class="text-sm text-white/50 mb-6">
								{selectedDateActivities.length} activité{selectedDateActivities.length > 1 ? 's' : ''}
							</p>
							
							{#if selectedDateActivities.length > 0}
								<div class="space-y-3">
									{#each selectedDateActivities as activity, i}
										{@const Icon = activityIcons[activity.type]}
										<div 
											class="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
											in:fly={{ x: 20, duration: 300, delay: i * 100 }}
										>
											<div class="flex items-start gap-3">
												<div class="w-10 h-10 rounded-xl {activityColors[activity.type]} flex items-center justify-center group-hover:scale-110 transition-transform">
													<Icon class="w-5 h-5 text-white" />
												</div>
												<div class="flex-1 min-w-0">
													<div class="flex items-center gap-2 mb-1">
														<Avatar name={activity.user} size="xs" />
														<span class="text-xs text-white/60">{activity.user}</span>
													</div>
													<h4 class="font-medium text-sm">{activity.name}</h4>
													<div class="flex items-center gap-3 mt-2 text-xs text-white/50">
														<span>{activity.time}</span>
														<span>•</span>
														<span>{activity.duration}</span>
														{#if activity.distance}
															<span>•</span>
															<span>{activity.distance}</span>
														{/if}
													</div>
												</div>
											</div>
										</div>
									{/each}
								</div>
							{:else}
								<div class="text-center py-8">
									<div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
										<Activity class="w-8 h-8 text-white/30" />
									</div>
									<p class="text-white/50 mb-4">Aucune activité ce jour</p>
									<a href="/workout/new">
										<GlassButton variant="default" size="sm">
											<Plus class="w-4 h-4" />
											Ajouter une séance
										</GlassButton>
									</a>
								</div>
							{/if}
						</div>
					{:else}
						<div class="text-center py-12" in:fade={{ duration: 200 }}>
							<div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
								<Activity class="w-8 h-8 text-white/30" />
							</div>
							<p class="text-white/50">Sélectionne un jour pour voir les détails</p>
						</div>
					{/if}
				</div>
			</GlassCard>
			
			<!-- Friends Summary -->
			<GlassCard delay={300} class="mt-6">
				<div class="p-6">
					<h3 class="text-lg font-semibold mb-4">Ce mois-ci</h3>
					
					<div class="space-y-4">
						{#each ['Nathan', 'Marie D.', 'Thomas B.', 'Julie M.'] as friend, i}
							{@const randomSessions = Math.floor(Math.random() * 12) + 3}
							<div 
								class="flex items-center gap-3"
								in:fly={{ x: 20, duration: 300, delay: 400 + (i * 100) }}
							>
								<Avatar name={friend} size="sm" showRing />
								<div class="flex-1 min-w-0">
									<p class="text-sm font-medium">{friend}</p>
									<p class="text-xs text-white/50">{randomSessions} séances</p>
								</div>
								<div class="w-20 h-2 rounded-full bg-white/10 overflow-hidden">
									<div 
										class="h-full rounded-full bg-gradient-to-r from-primary-start to-primary-end"
										style="width: {(randomSessions / 15) * 100}%"
									></div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</GlassCard>
		</div>
	</div>
</div>
