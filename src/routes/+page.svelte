<script>
    import DeviceStatesDonut from "$lib/DeviceStatesDonut.svelte";
    import DeviceTotalKms from "$lib/DeviceTotalKms.svelte";
    import DeviceLastUpdate from "$lib/DeviceLastUpdate.svelte";
    import DeviceTotalHours from "$lib/DeviceTotalHours.svelte";
    import DeviceIgnitionDonut from "$lib/DeviceIgnitionDonut.svelte";
    import DeviceAlarm from "$lib/DeviceAlarm.svelte";
    let {data} = $props()
    let {devices, positions} = data
</script>
<div class="grid grid-cols-3 gap-5 p-5" >
    <DeviceStatesDonut {devices}></DeviceStatesDonut>
    <DeviceIgnitionDonut {positions} {devices}></DeviceIgnitionDonut>
    <DeviceAlarm {positions} {devices}></DeviceAlarm>
    <DeviceTotalKms {positions} {devices}></DeviceTotalKms>
    <DeviceTotalHours {positions} {devices}></DeviceTotalHours>
    <DeviceLastUpdate {positions} {devices}></DeviceLastUpdate>
</div>
