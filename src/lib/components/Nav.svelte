<script lang="ts">
	import { page } from '$app/stores';
	import { fly, fade } from 'svelte/transition';
	import { Activity, Calendar, Users, Trophy, Settings, LogOut, Menu, X } from 'lucide-svelte';
	import Logo from './Logo.svelte';
	
	let mobileMenuOpen = $state(false);
	
	const navItems = [
		{ href: '/dashboard', label: 'Dashboard', icon: Activity },
		{ href: '/calendar', label: 'Calendrier', icon: Calendar },
		{ href: '/friends', label: 'Amis', icon: Users },
		{ href: '/leaderboard', label: 'Classement', icon: Trophy },
	];
	
	function isActive(href: string): boolean {
		return $page.url.pathname.startsWith(href);
	}
	
	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
</script>

<nav class="nav-glass sticky top-0 z-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16">
			<!-- Logo -->
			<a href="/" class="group">
				<Logo size="md" />
			</a>
			
			<!-- Desktop Navigation -->
			<div class="hidden md:flex items-center gap-1">
				{#each navItems as item}
					<a
						href={item.href}
						class="relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group
							{isActive(item.href) 
								? 'text-white' 
								: 'text-white/60 hover:text-white'}"
					>
						<!-- Active background -->
						{#if isActive(item.href)}
							<div 
								class="absolute inset-0 bg-white/10 rounded-xl"
								in:fade={{ duration: 200 }}
							></div>
						{/if}
						
						<div class="relative flex items-center gap-2">
							<svelte:component this={item.icon} class="w-4 h-4" />
							<span>{item.label}</span>
						</div>
						
						<!-- Hover glow -->
						<div class="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-start/0 via-primary-start/10 to-primary-end/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
					</a>
				{/each}
			</div>
			
			<!-- User section -->
			<div class="hidden md:flex items-center gap-4">
				<a href="/settings" class="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300">
					<Settings class="w-5 h-5" />
				</a>
				
				<div class="w-px h-6 bg-white/10"></div>
				
				<a href="/profile" class="flex items-center gap-3 group">
					<div class="w-9 h-9 rounded-full bg-gradient-to-br from-accent-orange to-accent-pink flex items-center justify-center text-sm font-bold group-hover:scale-105 transition-transform duration-300">
						NA
					</div>
				</a>
			</div>
			
			<!-- Mobile menu button -->
			<button 
				onclick={toggleMobileMenu}
				class="md:hidden p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
			>
				{#if mobileMenuOpen}
					<X class="w-6 h-6" />
				{:else}
					<Menu class="w-6 h-6" />
				{/if}
			</button>
		</div>
	</div>
	
	<!-- Mobile menu -->
	{#if mobileMenuOpen}
		<div 
			class="md:hidden glass-strong mx-4 mb-4 rounded-2xl overflow-hidden"
			in:fly={{ y: -20, duration: 300 }}
			out:fade={{ duration: 150 }}
		>
			<div class="p-4 space-y-2">
				{#each navItems as item}
					{@const MobileIcon = item.icon}
					<a
						href={item.href}
						onclick={() => mobileMenuOpen = false}
						class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
							{isActive(item.href) 
								? 'bg-white/15 text-white' 
								: 'text-white/60 hover:bg-white/10 hover:text-white'}"
					>
						<MobileIcon class="w-5 h-5" />
						<span class="font-medium">{item.label}</span>
					</a>
				{/each}
				
				<div class="h-px bg-white/10 my-2"></div>
				
				<a
					href="/settings"
					onclick={() => mobileMenuOpen = false}
					class="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all duration-300"
				>
					<Settings class="w-5 h-5" />
					<span class="font-medium">Paramètres</span>
				</a>
			</div>
		</div>
	{/if}
</nav>
