<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	
	interface Props extends HTMLInputAttributes {
		label?: string;
		error?: string;
		icon?: Snippet;
		class?: string;
	}
	
	let { 
		label,
		error,
		icon,
		class: className = '',
		...restProps
	}: Props = $props();
</script>

<div class="space-y-2">
	{#if label}
		<label class="block text-sm font-medium text-white/70">
			{label}
		</label>
	{/if}
	
	<div class="relative">
		{#if icon}
			<div class="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
				{@render icon()}
			</div>
		{/if}
		
		<input
			class="
				glass-input
				{icon ? 'pl-14!' : ''}
				{error ? 'border-red-500/50 focus:border-red-500' : ''}
				{className}
			"
			{...restProps}
		/>
	</div>
	
	{#if error}
		<p class="text-sm text-red-400">{error}</p>
	{/if}
</div>
