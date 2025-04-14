<script>
    import ApexCharts from 'apexcharts';
    import {onMount} from "svelte";
    import palette from "$lib/palette.js";
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    let from = $state(midnight)
    let to = $state(midnight + 1000 * 60 * 60 * 24)
    import {t} from './i18n.js'
    import {loadingTrips, activityFullScreen} from "$lib/store.js";
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
        series: _devices.map(d => ({
                name: 'dummy',
                data: [{x: d.name}]
            })),
        title: {
            text: title,
            align: 'left'
        },
        chart: {
            animations: {
                enabled: false,
            },
            events: {
                zoomed: (chartContext, { xaxis }) => {
                    from = xaxis.min
                    to = xaxis.max
                },
                selection: (chartContext, { xaxis }) => {
                    from = xaxis.min
                    to = xaxis.max
                }
            },
            type: 'rangeBar',
            height: '100%',
            zoom: {
                enabled: true
            },
            toolbar: {
                show: true,
                tools: {
                    customIcons: [
                        {
                            icon: '<span>⛶</span>',
                            click: () => activityFullScreen.set(!fullscreen),
                        }
                    ]
                }
            },
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
        legend: {
            show: false,
        },
        tooltip: {
            custom: function(opts) {
                const from = new Date(opts.y1)
                const to = new Date(opts.y2)
                const { seriesIndex, dataPointIndex, ctx } = opts
                const params = ctx.w.config.series[seriesIndex].data[dataPointIndex]
                params.from =  from.toISOString()
                params.to =  to.toISOString()

                return `<iframe src="/dash/map?${new URLSearchParams(params)}" class="w-[300px] h-[250px]"></iframe>`
            }
        }
    };
    let div;
    let chart
    let fullscreen = $state(false)
    activityFullScreen.subscribe(v => fullscreen = v)
    onMount(async () => {
        chart = new ApexCharts(div, options)
        await chart.render()
        await getTrips()
        options.xaxis.min = from
        options.xaxis.max = to
        updateChart()
    })

    function updateChart() {
        if (chart) {
            chart.updateOptions(options, true, true)
        }
    }

    $effect(async () => {
        options.xaxis.min = from
        options.xaxis.max = to
        await getTrips(from, to)
    });
    const getTrips = async (_from, _to) => {
        loadingTrips.set(true)
        for(const d of _devices) {
            const response = await fetch(
                `/api/reports/trips?deviceId=${d.id
                    }&from=${new Date(_from || from).toISOString()}&to=${new Date(_to || to).toISOString()}`,
                {
                    headers: {Accept: 'application/json'},
                }
            )
            const responseStops = await fetch(
                `/api/reports/stops?deviceId=${d.id
                    }&from=${new Date(from).toISOString()}&to=${new Date(to).toISOString()}`,
                {
                    headers: {Accept: 'application/json'},
                }
            )
            if (response.ok && responseStops.ok) {
                const trips = await response.json()
                const stops = await responseStops.json()
                options.series.push(
                    {
                        color: palette(undefined, undefined).primary.main,
                        data: stops.map(s => (
                            {
                                x: d.name,
                                y: [new Date(s.startTime).getTime(), new Date(s.endTime).getTime()],
                                deviceId: s.deviceId
                            }
                        )).filter(e => !options.series.map(s => s.data).flat().some(
                            d => d.deviceId === e.deviceId && d.y[0] === e.y[0]))
                    }
                )
                options.series.push(
                    {
                        color: palette(undefined, undefined).secondary.main,
                        data: trips.map(s => (
                            {
                                x: d.name,
                                y: [new Date(s.startTime).getTime(), new Date(s.endTime).getTime()],
                                deviceId: s.deviceId
                            }
                        )).filter(e => !options.series.map(s => s.data).flat().some(
                            d => d.deviceId === e.deviceId && d.y[0] === e.y[0]))
                    }
                )
            }
            updateChart()
        }
        loadingTrips.set(false)
    }
</script>

<div bind:this={div} class="rounded-lg shadow-md bg-gray-200 h-full w-full">
</div>
