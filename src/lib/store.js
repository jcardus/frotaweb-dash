import { writable } from 'svelte/store';

export const showGrid = writable(false);
export const gridFilter = writable([]);