<script>
    import DeviceStatesGroupedDonut from "$lib/DeviceStatesGroupedDonut.svelte";
    import palette from '$lib/palette.js';
    const primary = palette(undefined, undefined).primary.main;
    const secondary = palette(undefined, undefined).secondary.main;
    import {t} from '$lib/i18n'
    import Grid from "$lib/Grid.svelte";


    // eslint-disable-next-line no-undef
    Apex.colors = [secondary, primary, "#ca8a04",
        "#FF4560", // Red
        "#775DD0", // Purple
        "#3F51B5", // Indigo
        "#546E7A", // Blue-gray
        "#D4526E", // Pink
        "#8D5B4C", // Brown
        "#F86624", // Orange
        "#A5978B", // Taupe
        "#4ECDC4", // Teal
        "#C7F464", // Lime
        "#81D4FA", // Light Blue
        "#FD6A02", // Tangerine
        "#7B1FA2", // Dark Purple
        "#FFC300", // Mustard
        "#FF5733", // Burnt Orange
        "#C70039", // Crimson
        "#900C3F"]  // Dark Red

    import DeviceTotals from "$lib/DeviceTotals.svelte";
    import DeviceAlarm from "$lib/DeviceAlarm.svelte";
    import DeviceIgnitionDonut from "$lib/DeviceIgnitionDonut.svelte";
    import Today from "$lib/Today.svelte";
    let {data} = $props()

</script>
    {#await data.promise}
        <div class="main">
            <div class="loader" >
                <div style="border-color: {primary} transparent transparent transparent;"></div>
            </div>
        </div>
    {:then {devices, positions}}
        <div class="grid grid-cols-3 gap-3 p-3">
            <DeviceStatesGroupedDonut {devices}></DeviceStatesGroupedDonut>
            <DeviceIgnitionDonut {positions} {devices}></DeviceIgnitionDonut>
            <DeviceAlarm {positions} {devices}></DeviceAlarm>
            <DeviceTotals {positions} {devices} title={t('Hodômetro / Horímetro')}></DeviceTotals>
            <div class="col-span-2 grid-cols-subgrid gap-3">
                <Today {positions} {devices} title={t('Atividade hoje')}></Today>
            </div>
        </div>
        <Grid></Grid>
    {/await}


<style>
    .main {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        margin: 0;
        background: #f0f0f0;
        font-family: Arial, sans-serif;
    }

    .loader {
        display: inline-block;
        width: 80px;
        height: 80px;
        position: relative;
    }

    .loader div {
        display: block;
        position: absolute;
        width: 64px;
        height: 64px;
        margin: 8px;
        border: 8px solid;
        border-radius: 50%;
        animation: loader-animation 1.2s linear infinite;

    }

    .loader div:nth-child(1) {
        animation-delay: -0.45s;
    }

    .loader div:nth-child(2) {
        animation-delay: -0.3s;
    }

    .loader div:nth-child(3) {
        animation-delay: -0.15s;
    }

    @keyframes loader-animation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
