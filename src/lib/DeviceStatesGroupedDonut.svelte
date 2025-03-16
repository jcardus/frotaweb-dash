<script>
    import { onMount } from 'svelte';
    import ApexCharts from 'apexcharts';
    import { t } from "$lib/i18n";
    import {showGrid} from './store.js'

    const {devices} = $props()
    let stateCounts = {Online: [], '12 horas': [], '24 horas': [], '36 horas': [], '48 horas': [], '+ 48 horas': []};
    devices.forEach(device => {
        const lastUpdate = new Date().getTime() - new Date(device.lastUpdate).getTime()
        if (device.status === 'online') stateCounts.Online.push(device.name)
        else if (lastUpdate < 12*3600*1000) stateCounts['12 horas'].push(device.name)
        else if (lastUpdate < 24*3600*1000) stateCounts['24 horas'].push(device.name)
        else if (lastUpdate < 36*3600*1000) stateCounts['36 horas'].push(device.name)
        else if (lastUpdate < 48*3600*1000) stateCounts['48 horas'].push(device.name)
        else stateCounts['+ 48 horas'].push(device.name)
    });
    // Initialize chart options for the donut chart
    const options = {
        tooltip: {
            y: {
                formatter: (_, b) => {
                    const key = Object.keys(stateCounts)[b.seriesIndex]
                    return stateCounts[key].join('<br>')
                },
                title: {
                    formatter: (category) => {
                        return `<i>${category} (${stateCounts[category].length})</i>`
                    }
                }
            }
        },
        series: Object.values(stateCounts).map(v => v.length),
        title: {
            text: t('Última comunicação'),
            align: 'center'
        },
        chart: {
            type: 'donut',
            height: 250,
            events: {
                click: function(event, chartContext, opts) {
                    console.log(opts.dataPointIndex)
                    showGrid.set(true)
                }
            }
        },
        legend: {
            position: 'right'
        },
        labels: Object.keys(stateCounts),
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '22px',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            fontWeight: 600,
                            color: undefined,
                            offsetY: -10,
                            formatter: function (val) {
                                return val
                            }
                        },
                        value: {
                            show: true,
                            fontSize: '16px',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            fontWeight: 400,
                            color: undefined,
                            offsetY: 16,
                            formatter: function (val) {
                                return val
                            }
                        }
                    }
                }
            }
        }
    };

    onMount(() => new ApexCharts(div, options).render());
    let div
</script>

<div bind:this={div} class="flex justify-center items-center rounded-lg shadow-md bg-gray-200">
</div>
