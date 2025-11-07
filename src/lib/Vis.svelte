<script>
    import { DataSet, Timeline } from 'vis-timeline/standalone';
    import {onMount} from "svelte";
    import {loadingDevice, loadingTrips} from "$lib/store.js";

    let container
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    let from = $state(midnight)
    let to = $state(new Date().getTime())
    const {devices} = $props()
    let _devices = devices && devices.sort((a, b) => a.name.localeCompare(b.name)).slice(0, 20)
    const trips = new DataSet()
    let abortController

    const getTrips = async () => {
        if (abortController) { abortController.abort() }
        abortController = new AbortController()
        return _getTrips(abortController.signal)
    }

    const _getTrips = async (signal) => {
        try {
            for(const d of _devices) {
                if (signal.aborted) return
                loadingTrips.set(true)
                loadingDevice.set(`${d.name}: ${new Date(from).toLocaleString()} -> ${new Date(to).toLocaleString()}`)
                await addSeries(d, signal);
                loadingTrips.set(false)
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Request cancelled')
            } else {
                throw error
            }
        }
    }

    async function addSeries(d, signal) {
        const response = await fetch(
            `/api/reports/events?type=deviceStopped&type=deviceMoving&deviceId=${d.id
            }&from=${new Date(from).toISOString()}&to=${new Date(to).toISOString()}`,
            {
                headers: {Accept: 'application/json'},
                signal
            }
        )
        if (response.ok) {
            const _trips = await response.json()
            const pairedTrips = []
            for (let i = 0; i < _trips.length - 1; i++) {
                if (_trips[i].type === 'deviceMoving' && _trips[i + 1].type === 'deviceStopped') {
                    pairedTrips.push({
                        group: _trips[i].deviceId,
                        start: new Date(_trips[i].eventTime),
                        end: new Date(_trips[i + 1].eventTime),
                        type: 'range',
                        className: 'green'
                    })
                }
            }
            trips.add(pairedTrips)
        }
    }
    onMount(() => {
        if (!_devices) return
        const timeline = new Timeline(container, trips,
            new DataSet(_devices.map(d => ({id: d.id, content: d.name}))), {
            height: '100%',
            verticalScroll: true,
            stack: false,
            min: new Date() - 1000 * 60 * 60 * 24 * 30 * 3,
            max: new Date()
        })
        timeline.on('rangechanged', ({start, end}) => {
            console.log('rangechanged', start, end)
            from = start
            to = end
            getTrips()
        })
        const _from = from
        const _to = to
        requestAnimationFrame(() => timeline.setWindow(_from, _to))
    })

</script>
<div bind:this={container} class="rounded-lg shadow-md bg-gray-200 h-full w-full p-2"></div>

