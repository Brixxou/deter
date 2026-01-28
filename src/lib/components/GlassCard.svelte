<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	
	interface Props {
		variant?: 'default' | 'strong' | 'stat';
		hover?: boolean;
		glow?: boolean;
		delay?: number;
		class?: string;
		children: import('svelte').Snippet;
	}
	
	let { 
		variant = 'default', 
		hover = true, 
		glow = false,
		delay = 0,
		class: className = '',
		children 
	}: Props = $props();
	
	const variantClasses = {
		default: 'glass',
		strong: 'glass-strong',
		stat: 'glass stat-card'
	};
</script>

<div
	class="
		{variantClasses[variant]}
		{hover ? 'hover:-translate-y-1 hover:shadow-2xl' : ''}
		{glow ? 'hover:shadow-[0_0_40px_rgba(102,126,234,0.3)]' : ''}
		transition-all duration-300 ease-out
		{className}
	"
	in:fly={{ y: 20, duration: 500, delay, easing: cubicOut }}
>
	{@render children()}
</div>
