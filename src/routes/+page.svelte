<script>
    import DeviceStatesGroupedDonut from "$lib/DeviceStatesGroupedDonut.svelte";
    import palette from '$lib/palette.js';
    const primary = palette(undefined, undefined).primary.main;
    const secondary = palette(undefined, undefined).secondary.main;
    import {t} from '$lib/i18n'
    import Grid from "$lib/Grid.svelte";
    import {loadingTrips, activityFullScreen} from "$lib/store.js";
    let _loadingTrips = $state(true)
    loadingTrips.subscribe(v => _loadingTrips = v)
    let _activityFullScreen = $state(false)
    activityFullScreen.subscribe(v => _activityFullScreen = v)

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
    {:then {devices, positions, groups}}
        <div class="grid grid-cols-3 gap-3 p-3 h-lvh">
            <DeviceStatesGroupedDonut {devices}></DeviceStatesGroupedDonut>
            <DeviceIgnitionDonut {positions} {devices}></DeviceIgnitionDonut>
            <DeviceAlarm {positions} {devices}></DeviceAlarm>
            <DeviceTotals {positions} {devices} title={t('Hodômetro / Horímetro')}></DeviceTotals>
            <div class="{_activityFullScreen ?
                    'absolute pb-6 h-full w-full pr-6' :
                    'relative col-span-2 grid-cols-subgrid gap-3 w-full'
                }">
                {#if _loadingTrips}
                    <div class="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75 z-10">
                        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
                    </div>
                {/if}
                <Today {positions} {devices} title={t('Atividade')}></Today>
            </div>
        </div>
        <Grid {groups} {devices} {positions}></Grid>
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
