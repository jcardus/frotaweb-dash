<script>
    import ApexCharts from 'apexcharts';
    import {onMount} from "svelte";
    import palette from "$lib/palette.js";
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const to = from + 1000 * 60 * 60 * 24
    import {t} from './i18n.js'
    export let title
    export let devices
    let _devices = devices.sort((a, b) => a.name.localeCompare(b.name)).slice(0, 20)
    const options = {
        noData: {
            text: t('A Carregar') + '...',
            align: 'center',
            verticalAlign: 'middle',
            offsetX: 0,
            offsetY: 0,
            style: {
                color: undefined,
                fontSize: '24px',
                fontFamily: undefined
            },
        },
        series: [],
        title: {
            text: title,
            align: 'left'
        },
        chart: {
            type: 'rangeBar',
            height: '100%',
            zoom: {
                enabled: true
            }
        },
        plotOptions: {
            bar: {
                barHeight: '80%',
                horizontal: true,
                rangeBarGroupRows: true,
            }
        },
        fill: {
            type: 'solid'
        },
        xaxis: {
            min: 0,
            max: 0,
            type: 'datetime'
        },
        legend: {
            show: false,
        },
        tooltip: {
            custom: function(opts) {
                const fromYear = new Date(opts.y1).toLocaleString()
                const toYear = new Date(opts.y2).toLocaleTimeString()
                // const w = opts.ctx.w
                // let ylabel = w.config.series[opts.seriesIndex].data?.[opts.dataPointIndex]?.x
                return `<span style="padding: 5px; font-size: x-small">${fromYear} - ${toYear}</span>`
            }
        }
    };
    let div;
    onMount(async () => {

        const chart = new ApexCharts(div, options)
        await chart.render()
        await getTrips()
        options.xaxis.min = from
        options.xaxis.max = to
        await chart.updateOptions(options, true, true)
    })
    const getTrips = async () => {
        const response = await fetch(
            `/api/reports/trips?${_devices.map(d => `deviceId=${d.id}`).join('&')
            }&from=${new Date(from).toISOString()}&to=${new Date(to).toISOString()}`,
            {
                headers: {Accept: 'application/json'},
            }
        )
        const responseStops = await fetch(
            `/api/reports/stops?${_devices.map(d => `deviceId=${d.id}`).join('&')
            }&from=${new Date(from).toISOString()}&to=${new Date(to).toISOString()}`,
            {
                headers: {Accept: 'application/json'},
            }
        )
        if (response.ok && responseStops.ok) {
            const trips = await response.json()
            const stops = await responseStops.json()
            options.series = _devices.map(d => (
                {
                    name: 'dummy',
                    data: [{x: d.name}]
                })).concat([
                {
                    color: palette(undefined, undefined).primary.main,
                    name: 'Stops',
                    data: stops.map(s => (
                        {
                            x: _devices.find(d => d.id === s.deviceId).name,
                            y: [new Date(s.startTime).getTime(), new Date(s.endTime).getTime()]
                        }
                    ))
                },
                    {
                    color: palette(undefined, undefined).secondary.main,
                    name: 'Trips',
                    data: trips.map(s => (
                        {
                            x: _devices.find(d => d.id === s.deviceId).name,
                            y: [new Date(s.startTime).getTime(), new Date(s.endTime).getTime()]
                        }
                    ))
                }])
        }
    }
</script>

<div class="rounded-lg shadow-md bg-gray-200 h-full">
    <div bind:this={div}></div>
</div>