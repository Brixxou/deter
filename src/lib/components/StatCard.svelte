<script lang="ts">
	import GlassCard from './GlassCard.svelte';
	import type { Snippet } from 'svelte';
	
	interface Props {
		title: string;
		value: string | number;
		unit?: string;
		change?: number;
		icon?: Snippet;
		delay?: number;
		color?: 'default' | 'orange' | 'green' | 'blue' | 'pink' | 'purple';
	}
	
	let { 
		title, 
		value, 
		unit = '',
		change,
		icon,
		delay = 0,
		color = 'default'
	}: Props = $props();
	
	const colorClasses = {
		default: 'from-primary-start to-primary-end',
		orange: 'from-orange-400 to-orange-600',
		green: 'from-green-400 to-green-600',
		blue: 'from-blue-400 to-blue-600',
		pink: 'from-pink-400 to-pink-600',
		purple: 'from-purple-400 to-purple-600'
	};
</script>

<GlassCard variant="stat" glow {delay}>
	<div class="p-6">
		<div class="flex items-start justify-between">
			<div class="space-y-3">
				<p class="text-sm text-white/60 font-medium">{title}</p>
				<div class="flex items-baseline gap-1">
					<span class="text-3xl font-bold bg-gradient-to-r {colorClasses[color]} bg-clip-text text-transparent">
						{value}
					</span>
					{#if unit}
						<span class="text-lg text-white/50">{unit}</span>
					{/if}
				</div>
				
				{#if change !== undefined}
					<div class="flex items-center gap-1.5">
						<div 
							class="
								w-5 h-5 rounded-full flex items-center justify-center
								{change >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
							"
						>
							<svg 
								class="w-3 h-3 {change < 0 ? 'rotate-180' : ''}" 
								fill="none" 
								viewBox="0 0 24 24" 
								stroke="currentColor"
							>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
							</svg>
						</div>
						<span class="text-sm {change >= 0 ? 'text-green-400' : 'text-red-400'}">
							{change > 0 ? '+' : ''}{change}%
						</span>
						<span class="text-sm text-white/40">vs last week</span>
					</div>
				{/if}
			</div>
			
			{#if icon}
				<div class="w-12 h-12 rounded-2xl bg-gradient-to-br {colorClasses[color]} flex items-center justify-center shadow-lg">
					{@render icon()}
				</div>
			{/if}
		</div>
	</div>
</GlassCard>
