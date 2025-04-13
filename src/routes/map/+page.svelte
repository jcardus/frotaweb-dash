<script>
    import {onMount} from "svelte";
    import polyline from '@mapbox/polyline';
    import Loading from "$lib/components/Loading.svelte";
    import palette from "$lib/palette.js";
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY

    function buildGoogleStaticMapURL() {
        const baseUrl = "https://maps.googleapis.com/maps/api/staticmap?"
        const size = "size=300x200";
        const pathPoints = coordinates.map(p => [p.latitude, p.longitude])
        const encodedPath = polyline.encode(pathPoints);
        const colorPrimary = palette(undefined, undefined).primary.main.replace('#','0x')
        const colorSecondary = palette(undefined, undefined).secondary.main.replace('#','0x')
        const path = `path=weight:6|color:${colorPrimary}|enc:${encodedPath}`
        const start = coordinates[0]
        const end = coordinates[coordinates.length - 1]
        let markers = `markers=color:${colorSecondary}|label:A|${start.latitude},${start.longitude}&markers=color:${colorPrimary}|label:B|${end.latitude},${end.longitude}`
        return `${baseUrl}${size}&${markers}&${path}&key=${apiKey}`
    }
    let coordinates = $state([])
    onMount(async () => {
        const response = await fetch('/api/positions'+window.location.search)
        if (response.ok) {
            coordinates = await response.json()
        }
    });
</script>

<div>
    {#if coordinates.length}
        <img src="{buildGoogleStaticMapURL()}" alt="map" >
    {:else}
        <Loading></Loading>
    {/if}
</div>
