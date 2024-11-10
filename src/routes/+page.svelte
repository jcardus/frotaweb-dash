<script>
    import DeviceStatesGroupedDonut from "$lib/DeviceStatesGroupedDonut.svelte";

    // eslint-disable-next-line no-undef
    Apex.colors = ["#16a34a", "#ef4444", "#ca8a04",
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
    import DeviceLastUpdate from "$lib/DeviceLastUpdate.svelte";
    import DeviceAlarm from "$lib/DeviceAlarm.svelte";
    import DeviceIgnitionDonut from "$lib/DeviceIgnitionDonut.svelte";
    let {data} = $props()
    let {devices, positions} = data
</script>
<div class="grid grid-cols-3 gap-5 p-5 h-lvh" >
    <DeviceStatesGroupedDonut {devices}></DeviceStatesGroupedDonut>
    <DeviceIgnitionDonut {positions} {devices}></DeviceIgnitionDonut>
    <DeviceAlarm {positions} {devices}></DeviceAlarm>
    <DeviceTotals {positions} {devices} type="odometer" title="Hodômetro (Kms)"></DeviceTotals>
    <DeviceTotals {positions} {devices} type="hours" title="Horímetro (Horas)"></DeviceTotals>
    <DeviceLastUpdate {positions} {devices} ></DeviceLastUpdate>
</div>
