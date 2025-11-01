import { writable } from 'svelte/store';

export const showGrid = writable(false);
export const gridFilter = writable([]);
export const loadingTrips = writable(true)
export const activityFullScreen = writable(false)
export const panelWidth = 450
export const loadingDevice = writable('')
