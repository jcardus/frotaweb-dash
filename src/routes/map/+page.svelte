<script>
    import {onMount} from "svelte";
    import polyline from '@mapbox/polyline';
    import Loading from "$lib/components/Loading.svelte";
    import palette from "$lib/palette.js";
    import { point } from '@turf/helpers';
    import distance from '@turf/distance';
    import {formatDistance} from "date-fns";
    import {panelWidth} from "$lib/store.js";
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY
    const colorPrimary = palette(undefined, undefined).primary.main
    const colorSecondary = palette(undefined, undefined).secondary.main



    function calculateTotalDistance(positions) {
        return positions.reduce((total, current, index) => {
            if (index === 0) return total;
            const from = point([positions[index - 1].longitude, positions[index - 1].latitude]);
            const to = point([current.longitude, current.latitude]);
            return total + distance(from, to, { units: 'kilometers' });
        }, 0);
    }

    function buildGoogleStaticMapURL() {
        const baseUrl = "https://maps.googleapis.com/maps/api/staticmap?"
        const size = `size=${width}x200`;
        const pathPoints = coordinates.map(p => [p.latitude, p.longitude])
        const encodedPath = polyline.encode(pathPoints);
        const path = `path=weight:6|color:${colorPrimary.replace('#','0x')}|enc:${encodedPath}`
        const start = coordinates[0]
        const end = coordinates[coordinates.length - 1]
        let markers = `markers=color:${colorSecondary.replace('#','0x')}|label:A|${start.latitude},${start.longitude}&markers=color:${colorPrimary.replace('#','0x')}|label:B|${end.latitude},${end.longitude}`
        return `${baseUrl}${size}&${markers}&${path}&key=${apiKey}`
    }
    let coordinates = $state([])
    let from = $state('')
    let to = $state('')
    let dist = $state(0)
    const width = $state(panelWidth)
    onMount(async () => {
        const params = new URLSearchParams(window.location.search)
        from = new Date(params.get('from'))
        to = new Date(params.get('to'))
        const response = await fetch('/api/positions'+window.location.search)
        if (response.ok) {
            coordinates = await response.json()
            dist = calculateTotalDistance(coordinates)
        }
    });
</script>

<div>
    {#if from && to}
    <div class="flex items-center text-gray-700 p-1 h-[50px] w-[{width}px] overflow-hidden">
        <div class="flex items-center ">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill={colorSecondary} />
              <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-family="Arial">A</text>
            </svg>
            <div class="flex flex-col max-w-40 text-xs">
                {#if coordinates.length}
                    <span class="truncate">{coordinates[0].address}</span>
                {/if}
                <span class="font-mono text-xs text-gray-500">{from.toLocaleString()}</span>
            </div>
        </div>

        <div class="flex items-center gap-1">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill={colorPrimary} />
              <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-family="Arial">B</text>
            </svg>
            <div class="flex flex-col text-xs max-w-56">
                {#if coordinates.length}
                    <span class="truncate">{coordinates[coordinates.length-1].address}</span>
                {/if}
                <span class="font-mono text-xs text-gray-500 truncate">{to.toLocaleTimeString()} ({formatDistance(from, to)}) {dist.toFixed(1)}km</span>
            </div>
        </div>
    </div>
    {/if}
    {#if coordinates.length}
        <img src="{buildGoogleStaticMapURL()}" alt="map" >
    {:else}
        <Loading></Loading>
    {/if}
</div>
