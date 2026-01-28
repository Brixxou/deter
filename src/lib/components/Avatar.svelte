<script lang="ts">
	interface Props {
		src?: string | null;
		name: string;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		showRing?: boolean;
		online?: boolean;
		class?: string;
	}
	
	let { 
		src = null, 
		name, 
		size = 'md',
		showRing = false,
		online = false,
		class: className = ''
	}: Props = $props();
	
	const sizeClasses = {
		xs: 'w-6 h-6 text-[10px]',
		sm: 'w-8 h-8 text-xs',
		md: 'w-10 h-10 text-sm',
		lg: 'w-14 h-14 text-base',
		xl: 'w-20 h-20 text-xl'
	};
	
	function getInitials(name: string): string {
		return name
			.split(' ')
			.map(word => word[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}
	
	// Generate consistent gradient from name
	function getGradient(name: string): string {
		const gradients = [
			'from-orange-400 to-pink-500',
			'from-purple-400 to-blue-500',
			'from-green-400 to-cyan-500',
			'from-yellow-400 to-orange-500',
			'from-pink-400 to-purple-500',
			'from-blue-400 to-indigo-500',
			'from-teal-400 to-green-500',
			'from-red-400 to-pink-500'
		];
		
		let hash = 0;
		for (let i = 0; i < name.length; i++) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
		}
		return gradients[Math.abs(hash) % gradients.length];
	}
</script>

<div class="relative inline-block {className}">
	{#if showRing}
		<div class="avatar-ring">
			<div class="p-[3px]">
				{#if src}
					<img 
						{src} 
						alt={name}
						class="{sizeClasses[size]} rounded-full object-cover"
					/>
				{:else}
					<div 
						class="
							{sizeClasses[size]} 
							rounded-full 
							bg-gradient-to-br {getGradient(name)}
							flex items-center justify-center font-bold
						"
					>
						{getInitials(name)}
					</div>
				{/if}
			</div>
		</div>
	{:else}
		{#if src}
			<img 
				{src} 
				alt={name}
				class="{sizeClasses[size]} rounded-full object-cover"
			/>
		{:else}
			<div 
				class="
					{sizeClasses[size]} 
					rounded-full 
					bg-gradient-to-br {getGradient(name)}
					flex items-center justify-center font-bold
				"
			>
				{getInitials(name)}
			</div>
		{/if}
	{/if}
	
	{#if online}
		<div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-surface-dark"></div>
	{/if}
</div>
