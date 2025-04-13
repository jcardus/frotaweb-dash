<script>
    import {onMount} from "svelte";
    import polyline from '@mapbox/polyline';
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY

    function buildGoogleStaticMapURL() {
        const baseUrl = "https://maps.googleapis.com/maps/api/staticmap?";
        const size = "size=300x200";
        const pathPoints = coordinates.map(p => [p.latitude, p.longitude]);
        const encodedPath = polyline.encode(pathPoints);
        const path = `path=weight:6|color:0x00ff00ff|enc:${encodedPath}`;
        return `${baseUrl}${size}&${path}&key=${apiKey}`;
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
    <img src="{buildGoogleStaticMapURL()}" alt="map">
</div>
