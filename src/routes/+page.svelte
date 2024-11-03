<script>
    import DeviceStatesDonut from "$lib/DeviceStatesDonut.svelte";
    import DeviceTotalKms from "$lib/DeviceTotalKms.svelte";
    import DeviceLastUpdate from "$lib/DeviceLastUpdate.svelte";
    import DeviceTotalHours from "$lib/DeviceTotalHours.svelte";
    let {data} = $props()
    let {devices, positions} = data
</script>
<div class="grid grid-cols-3 gap-5 p-5">
    <DeviceStatesDonut {devices}></DeviceStatesDonut>
    <DeviceTotalKms {positions} {devices}></DeviceTotalKms>
    <DeviceLastUpdate {positions} {devices}></DeviceLastUpdate>
    <DeviceTotalHours {positions} {devices}></DeviceTotalHours>
</div>
