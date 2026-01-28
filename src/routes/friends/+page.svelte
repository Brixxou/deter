<script lang="ts">
	import { fly, fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import GlassCard from '$lib/components/GlassCard.svelte';
	import GlassButton from '$lib/components/GlassButton.svelte';
	import GlassInput from '$lib/components/GlassInput.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import { 
		UserPlus, Search, Check, X, MoreVertical, 
		Activity, ChevronRight, Mail, Copy, Share2
	} from 'lucide-svelte';
	
	let searchQuery = $state('');
	let showInviteModal = $state(false);
	let inviteCode = $state('DETER-' + Math.random().toString(36).substring(2, 8).toUpperCase());
	let copied = $state(false);
	
	// Demo friends data
	const friends = [
		{ id: 1, name: 'Marie Dupont', email: 'marie@example.com', sessions: 12, lastActive: 'il y a 2h', status: 'online' },
		{ id: 2, name: 'Thomas Bernard', email: 'thomas@example.com', sessions: 8, lastActive: 'il y a 5h', status: 'online' },
		{ id: 3, name: 'Julie Martin', email: 'julie@example.com', sessions: 15, lastActive: 'Hier', status: 'offline' },
		{ id: 4, name: 'Lucas Petit', email: 'lucas@example.com', sessions: 6, lastActive: 'il y a 2j', status: 'offline' },
	];
	
	const pendingRequests = [
		{ id: 5, name: 'Sophie Leroy', email: 'sophie@example.com', type: 'incoming' },
		{ id: 6, name: 'Pierre Moreau', email: 'pierre@example.com', type: 'outgoing' },
	];
	
	const filteredFriends = $derived(
		friends.filter(f => 
			f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			f.email.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);
	
	function copyInviteCode() {
		navigator.clipboard.writeText(inviteCode);
		copied = true;
		setTimeout(() => copied = false, 2000);
	}
	
	function acceptRequest(id: number) {
		// TODO: Implement
		console.log('Accept', id);
	}
	
	function rejectRequest(id: number) {
		// TODO: Implement
		console.log('Reject', id);
	}
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Header -->
	<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
		<div in:fly={{ y: 20, duration: 500, easing: cubicOut }}>
			<h1 class="text-3xl font-bold mb-1">Amis</h1>
			<p class="text-white/50">
				Gère ton groupe d'entraînement
			</p>
		</div>
		
		<div class="flex items-center gap-3" in:fly={{ y: 20, duration: 500, delay: 100, easing: cubicOut }}>
			<GlassButton variant="primary" onclick={() => showInviteModal = true}>
				<UserPlus class="w-5 h-5" />
				Inviter un ami
			</GlassButton>
		</div>
	</div>
	
	<div class="grid lg:grid-cols-3 gap-6">
		<!-- Friends List -->
		<div class="lg:col-span-2">
			<!-- Search -->
			<div class="mb-6" in:fly={{ y: 20, duration: 400, delay: 100, easing: cubicOut }}>
				<GlassInput 
					type="search"
					placeholder="Rechercher un ami..."
					bind:value={searchQuery}
				>
					{#snippet icon()}
						<Search class="w-5 h-5" />
					{/snippet}
				</GlassInput>
			</div>
			
			<!-- Pending Requests -->
			{#if pendingRequests.length > 0}
				<GlassCard delay={150} class="mb-6">
					<div class="p-6">
						<h2 class="text-lg font-semibold mb-4">Demandes en attente</h2>
						
						<div class="space-y-3">
							{#each pendingRequests as request, i}
								<div 
									class="flex items-center gap-4 p-4 rounded-xl bg-white/5"
									in:fly={{ x: -20, duration: 400, delay: 200 + (i * 100), easing: cubicOut }}
								>
									<Avatar name={request.name} size="md" />
									
									<div class="flex-1 min-w-0">
										<h3 class="font-medium">{request.name}</h3>
										<p class="text-sm text-white/50">{request.email}</p>
									</div>
									
									{#if request.type === 'incoming'}
										<div class="flex items-center gap-2">
											<button 
												onclick={() => acceptRequest(request.id)}
												class="w-10 h-10 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center hover:bg-green-500/30 transition-colors"
											>
												<Check class="w-5 h-5" />
											</button>
											<button 
												onclick={() => rejectRequest(request.id)}
												class="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30 transition-colors"
											>
												<X class="w-5 h-5" />
											</button>
										</div>
									{:else}
										<span class="text-sm text-white/40 px-3 py-1 rounded-full bg-white/5">
											En attente
										</span>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				</GlassCard>
			{/if}
			
			<!-- Friends -->
			<GlassCard delay={200}>
				<div class="p-6">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-lg font-semibold">Mes amis ({filteredFriends.length})</h2>
					</div>
					
					{#if filteredFriends.length > 0}
						<div class="space-y-3">
							{#each filteredFriends as friend, i}
								<a 
									href="/friends/{friend.id}"
									class="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
									in:fly={{ x: -20, duration: 400, delay: 300 + (i * 80), easing: cubicOut }}
								>
									<div class="relative">
										<Avatar name={friend.name} size="lg" />
										{#if friend.status === 'online'}
											<div class="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-surface-dark"></div>
										{/if}
									</div>
									
									<div class="flex-1 min-w-0">
										<h3 class="font-medium group-hover:text-primary-start transition-colors">
											{friend.name}
										</h3>
										<p class="text-sm text-white/50">{friend.sessions} séances ce mois</p>
									</div>
									
									<div class="hidden sm:block text-right">
										<p class="text-sm text-white/40">{friend.lastActive}</p>
									</div>
									
									<ChevronRight class="w-5 h-5 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
								</a>
							{/each}
						</div>
					{:else}
						<div class="text-center py-12">
							<div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
								<Search class="w-8 h-8 text-white/30" />
							</div>
							<p class="text-white/50">Aucun ami trouvé</p>
						</div>
					{/if}
				</div>
			</GlassCard>
		</div>
		
		<!-- Sidebar -->
		<div>
			<!-- Invite Card -->
			<GlassCard delay={300}>
				<div class="p-6">
					<div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-start to-primary-end flex items-center justify-center mb-4">
						<Share2 class="w-7 h-7 text-white" />
					</div>
					
					<h3 class="text-lg font-semibold mb-2">Invite tes amis</h3>
					<p class="text-sm text-white/50 mb-4">
						Partage ton code ou envoie une invitation directement
					</p>
					
					<div class="space-y-3">
						<div class="flex gap-2">
							<div class="flex-1 px-4 py-3 rounded-xl bg-white/10 font-mono text-sm">
								{inviteCode}
							</div>
							<button 
								onclick={copyInviteCode}
								class="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
							>
								{#if copied}
									<Check class="w-5 h-5 text-green-400" />
								{:else}
									<Copy class="w-5 h-5" />
								{/if}
							</button>
						</div>
						
						<GlassButton variant="default" class="w-full" onclick={() => showInviteModal = true}>
							<Mail class="w-5 h-5" />
							Envoyer par email
						</GlassButton>
					</div>
				</div>
			</GlassCard>
			
			<!-- Stats -->
			<GlassCard delay={400} class="mt-6">
				<div class="p-6">
					<h3 class="text-lg font-semibold mb-4">Statistiques groupe</h3>
					
					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<span class="text-white/60">Membres</span>
							<span class="font-semibold">{friends.length + 1}</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-white/60">Séances ce mois</span>
							<span class="font-semibold">{friends.reduce((sum, f) => sum + f.sessions, 0) + 7}</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-white/60">Actifs aujourd'hui</span>
							<span class="font-semibold">{friends.filter(f => f.status === 'online').length + 1}</span>
						</div>
					</div>
				</div>
			</GlassCard>
			
			<!-- Leaderboard Preview -->
			<GlassCard delay={500} class="mt-6">
				<div class="p-6">
					<div class="flex items-center justify-between mb-4">
						<h3 class="text-lg font-semibold">Top 3 du mois</h3>
						<a href="/leaderboard" class="text-sm text-primary-start hover:underline">
							Voir tout
						</a>
					</div>
					
					<div class="space-y-3">
						{#each [...friends].sort((a, b) => b.sessions - a.sessions).slice(0, 3) as friend, i}
							{@const medals = ['🥇', '🥈', '🥉']}
							<div class="flex items-center gap-3">
								<span class="text-xl">{medals[i]}</span>
								<Avatar name={friend.name} size="sm" />
								<div class="flex-1 min-w-0">
									<p class="text-sm font-medium truncate">{friend.name}</p>
								</div>
								<span class="text-sm font-bold text-primary-start">{friend.sessions}</span>
							</div>
						{/each}
					</div>
				</div>
			</GlassCard>
		</div>
	</div>
</div>

<!-- Invite Modal -->
{#if showInviteModal}
	<div 
		class="fixed inset-0 z-50 flex items-center justify-center p-4"
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 150 }}
	>
		<!-- Backdrop -->
		<button 
			class="absolute inset-0 bg-black/60 backdrop-blur-sm"
			onclick={() => showInviteModal = false}
		></button>
		
		<!-- Modal -->
		<div 
			class="relative w-full max-w-md glass-strong p-8 rounded-3xl"
			in:scale={{ duration: 300, start: 0.9, easing: cubicOut }}
		>
			<button 
				class="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10 transition-colors"
				onclick={() => showInviteModal = false}
			>
				<X class="w-5 h-5" />
			</button>
			
			<div class="text-center mb-6">
				<div class="w-16 h-16 rounded-full bg-gradient-to-br from-primary-start to-primary-end flex items-center justify-center mx-auto mb-4">
					<UserPlus class="w-8 h-8 text-white" />
				</div>
				<h2 class="text-2xl font-bold mb-2">Inviter un ami</h2>
				<p class="text-white/50">Envoie une invitation par email</p>
			</div>
			
			<form class="space-y-4">
				<GlassInput 
					type="email"
					label="Email de ton ami"
					placeholder="ami@email.com"
				>
					{#snippet icon()}
						<Mail class="w-5 h-5" />
					{/snippet}
				</GlassInput>
				
				<GlassButton variant="primary" size="lg" class="w-full">
					Envoyer l'invitation
				</GlassButton>
			</form>
			
			<div class="relative my-6">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-white/10"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="px-4 text-white/40">ou partage ton code</span>
				</div>
			</div>
			
			<div class="flex gap-2">
				<div class="flex-1 px-4 py-3 rounded-xl bg-white/10 font-mono text-center">
					{inviteCode}
				</div>
				<button 
					onclick={copyInviteCode}
					class="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
				>
					{#if copied}
						<Check class="w-5 h-5 text-green-400" />
					{:else}
						<Copy class="w-5 h-5" />
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
