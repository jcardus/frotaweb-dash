<script>
    import { DataSet, Timeline } from 'vis-timeline/standalone';
    import {onMount} from "svelte";
    import {loadingTrips} from "$lib/store.js";

    let container
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    let from = $state(midnight)
    let to = $state(new Date().getTime())
    const {title, devices} = $props()
    let _devices = devices.sort((a, b) => a.name.localeCompare(b.name)).slice(0, 20)




    const trips = new DataSet()

    const getTrips = async (_from, _to) => {
        for(const d of _devices) {
            loadingTrips.set(true)
            await addSeries(d, _from, _to, 'trips');
            // await addSeries(d, _from, _to, 'stops');
            loadingTrips.set(false)
        }
    }

    let id =0

    async function addSeries(d, _from, _to, entity) {
        const response = await fetch(
            `/api/reports/${entity}?deviceId=${d.id
            }&from=${new Date(_from || from).toISOString()}&to=${new Date(_to || to).toISOString()}`,
            {
                headers: {Accept: 'application/json'},
            }
        )
        if (response.ok) {
            const _trips = await response.json()
            trips.add(_trips.map(t => ({group: t.deviceId, start: new Date(t.startTime), end: new Date(t.endTime)})))
        }
    }
    onMount(() => {
        const timeline = new Timeline(container, trips,
            new DataSet(_devices.map(d => ({id: d.id, content: d.name}))), {
            height: '100%',
            verticalScroll: true,
            stack: false
        })
        timeline.on('rangechanged', ({start, end}) => {
            console.log(start, end)
            from = start
            to = end
            getTrips(start, end)
        })
        setTimeout(() => timeline.setWindow(from, to), 1000)

    })

</script>
<div bind:this={container} class="rounded-lg shadow-md bg-gray-200 h-full w-full"></div>