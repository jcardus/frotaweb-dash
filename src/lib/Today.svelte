<script>
    import ApexCharts from 'apexcharts';
    import {onMount} from "svelte";
    import palette from "$lib/palette.js";
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    let from = $state(midnight)
    let to = $state(new Date().getTime())
    import {t} from './i18n.js'
    import {loadingTrips, activityFullScreen, panelWidth} from "$lib/store.js";
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
        grid: {
            show: true,
            borderColor: 'white',
            xaxis: {
                lines: {
                    show: true
                }
            },
            yaxis: {
                lines: {
                    show: true
                }
            },
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
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
                    if (xaxis.min<from || xaxis.max>to) {
                        from = xaxis.min
                        to = xaxis.max
                    } else {
                        console.log("User drew a selection")
                    }
                },
                scrolled: (chartContext, { xaxis }) => {
                    console.log("🟢 User scrolled", xaxis.min, xaxis.max);
                    if (xaxis.min<from || xaxis.max>to) {
                        // from = xaxis.min
                        // to = xaxis.max
                    }
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

                return `<iframe src="/dash/map?${new URLSearchParams(params)}" class="w-[${panelWidth}px] h-[250px]"></iframe>`
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
    })

    $effect(async () => {
        await getTrips(from, to)
    });

    async function addSeries(d, _from, _to, entity) {
        const response = await fetch(
            `/api/reports/${entity}?deviceId=${d.id
            }&from=${new Date(_from || from).toISOString()}&to=${new Date(_to || to).toISOString()}`,
            {
                headers: {Accept: 'application/json'},
            }
        )
        if (response.ok) {
            const data = await response.json()
            await chart.appendSeries(
                {
                    color: entity === 'trips' ?
                        palette(undefined, undefined).secondary.main :
                        palette(undefined, undefined).primary.main,
                    data: data.map(s => (
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

    }

    const getTrips = async (_from, _to) => {
        for(const d of _devices) {
            loadingTrips.set(true)
            await addSeries(d, _from, _to, 'trips');
            await addSeries(d, _from, _to, 'stops');
            loadingTrips.set(false)
        }
    }
    function toDateInputValue(ts) {
        const date = new Date(ts)
        const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        return offsetDate.toISOString().slice(0, 10)
    }
    function fromDateInputValue(value) {
        const [year, month, day] = value.split('-').map(Number)
        return new Date(year, month - 1, day).getTime()
    }
    const onChangeTo = e => (
        to = fromDateInputValue(e.target.value)
    )
</script>

<div bind:this={div} class="rounded-lg shadow-md bg-gray-200 h-full w-full">
</div>
<div class="absolute top-0 w-full flex items-center justify-center">
    <div class="date-range">
    <input type="date" id="start-date" class="w-24 bg-gray-200 text-xs"
           value={toDateInputValue(from)}
           onchange={(e) => from = fromDateInputValue(e.target.value)}
    />
    <input type="date" id="end-date" class="w-24 bg-gray-200 text-xs"
           value={toDateInputValue(to)}
           onchange={onChangeTo}
    />
</div></div>


