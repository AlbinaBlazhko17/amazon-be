/**
 * Converts a string to a URL-friendly slug
 * @param text The text to slugify
 * @returns The slugified text
 */
export function slugify(text: string): string {
	return text
		.toString()
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')
		.replace(/&/g, '-and-')
		.replace(/[^\w-]+/g, '')
		.replace(/--+/g, '-');
}
