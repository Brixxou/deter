<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { fade, fly } from 'svelte/transition';
	import Nav from '$lib/components/Nav.svelte';
	
	let { children } = $props();
	
	// Don't show nav on auth pages
	const hideNav = $derived($page.url.pathname.startsWith('/auth') || $page.url.pathname === '/');
</script>

<svelte:head>
	<title>DETER - Fitness Social Tracker</title>
	<meta name="description" content="Track and compare your fitness journey with friends" />
</svelte:head>

<div class="min-h-screen bg-surface-dark relative overflow-hidden">
	<!-- Animated background orbs -->
	<div class="orb orb-1"></div>
	<div class="orb orb-2"></div>
	<div class="orb orb-3"></div>
	
	<!-- Navigation (hidden on auth pages) -->
	{#if !hideNav}
		<Nav />
	{/if}
	
	<!-- Main content with page transitions -->
	<main class="relative z-10">
		{#key $page.url.pathname}
			<div
				in:fade={{ duration: 300, delay: 150 }}
				out:fade={{ duration: 150 }}
			>
				{@render children()}
			</div>
		{/key}
	</main>
</div>
