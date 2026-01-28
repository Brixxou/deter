<script lang="ts">
	interface Props {
		size?: 'sm' | 'md' | 'lg' | 'xl';
		showText?: boolean;
		class?: string;
	}
	
	let { size = 'md', showText = true, class: className = '' }: Props = $props();
	
	const sizes = {
		sm: { icon: 'w-8 h-8', text: 'text-lg', gap: 'gap-2' },
		md: { icon: 'w-10 h-10', text: 'text-xl', gap: 'gap-3' },
		lg: { icon: 'w-12 h-12', text: 'text-2xl', gap: 'gap-3' },
		xl: { icon: 'w-16 h-16', text: 'text-3xl', gap: 'gap-4' }
	};
</script>

<div class="flex items-center {sizes[size].gap} {className}">
	<!-- Logo Icon -->
	<div class="relative {sizes[size].icon} rounded-xl bg-gradient-to-br from-primary-start to-primary-end flex items-center justify-center shadow-lg overflow-hidden group">
		<!-- Glow effect -->
		<div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
		
		<!-- D letter -->
		<svg viewBox="0 0 32 32" fill="none" class="w-3/4 h-3/4 relative z-10">
			<!-- D shape -->
			<path 
				d="M6 5 L6 27 L14 27 C22 27 28 22 28 16 C28 10 22 5 14 5 L6 5 Z
				   M10 9 L14 9 C19 9 24 12 24 16 C24 20 19 23 14 23 L10 23 L10 9 Z" 
				fill="white"
			/>
			<!-- Lightning bolt -->
			<path 
				d="M16 10 L13 16 L16 16 L14 23 L20 14 L16.5 14 L19 10 Z" 
				fill="url(#logoAccent)"
			/>
			<defs>
				<linearGradient id="logoAccent" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stop-color="#f97316"/>
					<stop offset="100%" stop-color="#ec4899"/>
				</linearGradient>
			</defs>
		</svg>
		
		<!-- Shine animation -->
		<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
	</div>
	
	{#if showText}
		<span class="font-black tracking-tight {sizes[size].text} bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
			DETER
		</span>
	{/if}
</div>
