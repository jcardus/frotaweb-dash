<script>
    import ApexCharts from 'apexcharts';
    import {onMount} from "svelte";
    import palette from "$lib/palette.js";
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    let from = $state(midnight)
    let to = $state(midnight + 1000 * 60 * 60 * 24)
    import {t} from './i18n.js'
    import {loadingTrips} from "$lib/store.js";
    const {title, devices} = $props()
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
            events: {
                zoomed: (chartContext, { xaxis }) => {
                    from = xaxis.min
                    to = xaxis.max
                }
            },
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
            type: 'datetime',
            labels: {datetimeUTC: false}
        },
        yaxis: {
            show: false
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
    let chart
    onMount(async () => {
        chart = new ApexCharts(div, options)
        await chart.render()
        await getTrips()
        options.xaxis.min = from
        options.xaxis.max = to
        options.yaxis[0].show = true
        await chart.updateOptions(options, true, true)
    })
    $effect(async () => {
        await getTrips(from, to)
        options.xaxis.min = from
        options.xaxis.max = to
        await chart.updateOptions(options, true, true)
    });
    const getTrips = async (_from, _to) => {
        loadingTrips.set(true)
        const response = await fetch(
            `/api/reports/trips?${_devices.map(d => `deviceId=${d.id}`).join('&')
            }&from=${new Date(_from || from).toISOString()}&to=${new Date(_to || to).toISOString()}`,
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
        loadingTrips.set(false)
    }
</script>

<div class="rounded-lg shadow-md bg-gray-200 h-full">
    <div bind:this={div}></div>
</div>