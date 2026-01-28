<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import GlassCard from '$lib/components/GlassCard.svelte';
	import GlassButton from '$lib/components/GlassButton.svelte';
	import GlassInput from '$lib/components/GlassInput.svelte';
	import { 
		Activity, Dumbbell, Bike, Timer, ArrowLeft,
		Clock, MapPin, Flame, Save, X, Plus, Minus
	} from 'lucide-svelte';
	
	// Get type from URL params
	const typeFromUrl = $page.url.searchParams.get('type');
	
	type WorkoutType = 'run' | 'gym' | 'cycling' | 'hiit' | 'other';
	
	let workoutType = $state<WorkoutType>((typeFromUrl as WorkoutType) || 'run');
	let name = $state('');
	let date = $state(new Date().toISOString().split('T')[0]);
	let time = $state('12:00');
	let durationHours = $state(0);
	let durationMinutes = $state(30);
	let distance = $state('');
	let calories = $state('');
	let notes = $state('');
	let loading = $state(false);
	
	// Gym specific
	let exercises = $state<Array<{ name: string; sets: number; reps: number; weight: number }>>([
		{ name: '', sets: 3, reps: 10, weight: 0 }
	]);
	
	const workoutTypes = [
		{ id: 'run', label: 'Course', icon: Activity, color: 'from-green-400 to-green-600' },
		{ id: 'gym', label: 'Musculation', icon: Dumbbell, color: 'from-blue-400 to-blue-600' },
		{ id: 'cycling', label: 'Vélo', icon: Bike, color: 'from-orange-400 to-orange-600' },
		{ id: 'hiit', label: 'HIIT', icon: Timer, color: 'from-pink-400 to-pink-600' },
	];
	
	const gymTemplates = [
		'Développé couché', 'Squat', 'Soulevé de terre', 'Tractions',
		'Rowing', 'Développé épaules', 'Curl biceps', 'Extensions triceps',
		'Leg press', 'Leg curl', 'Crunch', 'Planche'
	];
	
	function addExercise() {
		exercises = [...exercises, { name: '', sets: 3, reps: 10, weight: 0 }];
	}
	
	function removeExercise(index: number) {
		exercises = exercises.filter((_, i) => i !== index);
	}
	
	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;
		
		// TODO: Save to Supabase
		await new Promise(resolve => setTimeout(resolve, 1500));
		
		goto('/dashboard');
	}
	
	// Auto-generate name based on type
	$effect(() => {
		if (!name) {
			const typeLabel = workoutTypes.find(t => t.id === workoutType)?.label || 'Séance';
			const timeOfDay = parseInt(time.split(':')[0]) < 12 ? 'matinale' : 
							  parseInt(time.split(':')[0]) < 18 ? 'après-midi' : 'soir';
			name = `${typeLabel} ${timeOfDay}`;
		}
	});
</script>

<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
			<h1 class="text-2xl font-bold">Nouvelle séance</h1>
			<p class="text-white/50">Ajoute manuellement une activité</p>
		</div>
	</div>
	
	<form onsubmit={handleSubmit}>
		<!-- Workout Type Selection -->
		<GlassCard delay={100} class="mb-6">
			<div class="p-6">
				<h2 class="text-lg font-semibold mb-4">Type d'activité</h2>
				
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
					{#each workoutTypes as type}
						{@const TypeIcon = type.icon}
						<button
							type="button"
							onclick={() => workoutType = type.id as WorkoutType}
							class="
								flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300
								{workoutType === type.id 
									? 'bg-gradient-to-br ' + type.color + ' shadow-lg scale-105' 
									: 'bg-white/5 hover:bg-white/10'}
							"
						>
							<TypeIcon class="w-8 h-8" />
							<span class="text-sm font-medium">{type.label}</span>
						</button>
					{/each}
				</div>
			</div>
		</GlassCard>
		
		<!-- Basic Info -->
		<GlassCard delay={200} class="mb-6">
			<div class="p-6 space-y-6">
				<h2 class="text-lg font-semibold">Informations</h2>
				
				<GlassInput 
					type="text"
					label="Nom de la séance"
					placeholder="Ex: Course matinale"
					bind:value={name}
					required
				/>
				
				<div class="grid grid-cols-2 gap-4">
					<GlassInput 
						type="date"
						label="Date"
						bind:value={date}
						required
					/>
					
					<GlassInput 
						type="time"
						label="Heure"
						bind:value={time}
						required
					/>
				</div>
				
				<!-- Duration -->
				<div>
					<label class="block text-sm font-medium text-white/70 mb-2">Durée</label>
					<div class="flex items-center gap-4">
						<div class="flex items-center gap-2">
							<input 
								type="number" 
								min="0" 
								max="23"
								bind:value={durationHours}
								class="glass-input w-20 text-center"
							/>
							<span class="text-white/50">h</span>
						</div>
						<div class="flex items-center gap-2">
							<input 
								type="number" 
								min="0" 
								max="59"
								bind:value={durationMinutes}
								class="glass-input w-20 text-center"
							/>
							<span class="text-white/50">min</span>
						</div>
					</div>
				</div>
			</div>
		</GlassCard>
		
		<!-- Stats (for cardio) -->
		{#if workoutType !== 'gym'}
			<GlassCard delay={300} class="mb-6">
				<div class="p-6 space-y-6">
					<h2 class="text-lg font-semibold">Statistiques</h2>
					
					<div class="grid grid-cols-2 gap-4">
						{#if workoutType === 'run' || workoutType === 'cycling'}
							<GlassInput 
								type="number"
								label="Distance (km)"
								placeholder="0.0"
								step="0.1"
								bind:value={distance}
							>
								{#snippet icon()}
									<MapPin class="w-5 h-5" />
								{/snippet}
							</GlassInput>
						{/if}
						
						<GlassInput 
							type="number"
							label="Calories brûlées"
							placeholder="0"
							bind:value={calories}
						>
							{#snippet icon()}
								<Flame class="w-5 h-5" />
							{/snippet}
						</GlassInput>
					</div>
				</div>
			</GlassCard>
		{/if}
		
		<!-- Gym Exercises -->
		{#if workoutType === 'gym'}
			<GlassCard delay={300} class="mb-6">
				<div class="p-6">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-lg font-semibold">Exercices</h2>
						<GlassButton variant="ghost" size="sm" onclick={addExercise} type="button">
							<Plus class="w-4 h-4" />
							Ajouter
						</GlassButton>
					</div>
					
					<!-- Quick templates -->
					<div class="flex flex-wrap gap-2 mb-6">
						{#each gymTemplates.slice(0, 6) as template}
							<button
								type="button"
								onclick={() => {
									const emptyIndex = exercises.findIndex(e => !e.name);
									if (emptyIndex !== -1) {
										exercises[emptyIndex].name = template;
									} else {
										exercises = [...exercises, { name: template, sets: 3, reps: 10, weight: 0 }];
									}
								}}
								class="px-3 py-1.5 text-xs rounded-full bg-white/10 hover:bg-white/20 transition-colors"
							>
								+ {template}
							</button>
						{/each}
					</div>
					
					<div class="space-y-4">
						{#each exercises as exercise, i}
							<div 
								class="p-4 rounded-xl bg-white/5 space-y-4"
								in:fly={{ x: -20, duration: 300, delay: i * 50 }}
							>
								<div class="flex items-center gap-3">
									<input 
										type="text"
										placeholder="Nom de l'exercice"
										bind:value={exercise.name}
										class="glass-input flex-1"
									/>
									{#if exercises.length > 1}
										<button 
											type="button"
											onclick={() => removeExercise(i)}
											class="p-2 rounded-xl hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
										>
											<X class="w-5 h-5" />
										</button>
									{/if}
								</div>
								
								<div class="grid grid-cols-3 gap-3">
									<div>
										<label class="text-xs text-white/50 mb-1 block">Séries</label>
										<div class="flex items-center gap-1">
											<button 
												type="button"
												onclick={() => exercise.sets = Math.max(1, exercise.sets - 1)}
												class="p-1 rounded-lg hover:bg-white/10"
											>
												<Minus class="w-4 h-4" />
											</button>
											<input 
												type="number" 
												min="1"
												bind:value={exercise.sets}
												class="glass-input w-full text-center"
											/>
											<button 
												type="button"
												onclick={() => exercise.sets++}
												class="p-1 rounded-lg hover:bg-white/10"
											>
												<Plus class="w-4 h-4" />
											</button>
										</div>
									</div>
									<div>
										<label class="text-xs text-white/50 mb-1 block">Reps</label>
										<div class="flex items-center gap-1">
											<button 
												type="button"
												onclick={() => exercise.reps = Math.max(1, exercise.reps - 1)}
												class="p-1 rounded-lg hover:bg-white/10"
											>
												<Minus class="w-4 h-4" />
											</button>
											<input 
												type="number" 
												min="1"
												bind:value={exercise.reps}
												class="glass-input w-full text-center"
											/>
											<button 
												type="button"
												onclick={() => exercise.reps++}
												class="p-1 rounded-lg hover:bg-white/10"
											>
												<Plus class="w-4 h-4" />
											</button>
										</div>
									</div>
									<div>
										<label class="text-xs text-white/50 mb-1 block">Poids (kg)</label>
										<input 
											type="number" 
											min="0"
											step="0.5"
											bind:value={exercise.weight}
											class="glass-input w-full text-center"
										/>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</GlassCard>
		{/if}
		
		<!-- Notes -->
		<GlassCard delay={400} class="mb-8">
			<div class="p-6">
				<h2 class="text-lg font-semibold mb-4">Notes (optionnel)</h2>
				<textarea 
					bind:value={notes}
					placeholder="Comment s'est passée la séance ?"
					rows="3"
					class="glass-input resize-none"
				></textarea>
			</div>
		</GlassCard>
		
		<!-- Submit -->
		<div class="flex items-center gap-4">
			<a href="/dashboard" class="flex-1">
				<GlassButton variant="default" size="lg" class="w-full" type="button">
					Annuler
				</GlassButton>
			</a>
			<GlassButton variant="primary" size="lg" class="flex-1" {loading}>
				<Save class="w-5 h-5" />
				{loading ? 'Enregistrement...' : 'Enregistrer'}
			</GlassButton>
		</div>
	</form>
</div>
