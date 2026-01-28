// Utility functions for DETER app

/**
 * Format duration from minutes to human readable string
 */
export function formatDuration(minutes: number): string {
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	
	if (hours === 0) {
		return `${mins}min`;
	}
	
	if (mins === 0) {
		return `${hours}h`;
	}
	
	return `${hours}h ${mins}min`;
}

/**
 * Format distance in kilometers
 */
export function formatDistance(km: number): string {
	if (km < 1) {
		return `${Math.round(km * 1000)}m`;
	}
	return `${km.toFixed(1)}km`;
}

/**
 * Format date to French locale
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.toLocaleDateString('fr-FR', options || {
		weekday: 'long',
		day: 'numeric',
		month: 'long'
	});
}

/**
 * Format relative time (e.g., "il y a 2h")
 */
export function formatRelativeTime(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	const now = new Date();
	const diffMs = now.getTime() - d.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);
	
	if (diffMins < 1) return "à l'instant";
	if (diffMins < 60) return `il y a ${diffMins}min`;
	if (diffHours < 24) return `il y a ${diffHours}h`;
	if (diffDays < 7) return `il y a ${diffDays}j`;
	
	return formatDate(d, { day: 'numeric', month: 'short' });
}

/**
 * Get greeting based on time of day
 */
export function getGreeting(): string {
	const hour = new Date().getHours();
	if (hour < 12) return 'Bonjour';
	if (hour < 18) return 'Bon après-midi';
	return 'Bonsoir';
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
	return name
		.split(' ')
		.map(word => word[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);
}

/**
 * Generate consistent color gradient from string
 */
export function getGradientFromString(str: string): string {
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
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	return gradients[Math.abs(hash) % gradients.length];
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
	fn: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout>;
	
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
}

/**
 * Calculate percentage change
 */
export function calculateChange(current: number, previous: number): number {
	if (previous === 0) return current > 0 ? 100 : 0;
	return Math.round(((current - previous) / previous) * 100);
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}
