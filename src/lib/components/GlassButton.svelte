<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	
	interface Props extends HTMLButtonAttributes {
		variant?: 'default' | 'primary' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		loading?: boolean;
		children: Snippet;
		class?: string;
	}
	
	let { 
		variant = 'default', 
		size = 'md',
		loading = false,
		class: className = '',
		children,
		...restProps
	}: Props = $props();
	
	const sizeClasses = {
		sm: 'px-4 py-2 text-sm',
		md: 'px-6 py-3 text-base',
		lg: 'px-8 py-4 text-lg'
	};
	
	const variantClasses = {
		default: 'glass-button',
		primary: 'glass-button glass-button-primary',
		ghost: 'bg-transparent hover:bg-white/10 border border-transparent hover:border-white/20 rounded-xl transition-all duration-300'
	};
</script>

<button
	class="
		{variantClasses[variant]}
		{sizeClasses[size]}
		font-medium
		disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
		flex items-center justify-center gap-2
		{className}
	"
	disabled={loading}
	{...restProps}
>
	{#if loading}
		<div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
	{/if}
	{@render children()}
</button>
