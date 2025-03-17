<script>
    import { onMount } from 'svelte';
    import ApexCharts from 'apexcharts';
    import {gridFilter, showGrid} from "$lib/store.js";

    export let positions = []
    export let devices = []

    let stateCounts = {Normal: 0};
    positions.forEach(position => {
        if (position.attributes.alarm) {
            stateCounts[position.attributes.alarm] ||= [];
            stateCounts[position.attributes.alarm].push(position.deviceId)
        }
        else {
            stateCounts.Normal ||= []
            stateCounts.Normal.push(position.deviceId)
        }
    });
    // Initialize chart options for the donut chart
    const options = {
        series: Object.values(stateCounts).map(v => v.length),
        title: {
            text: 'Alarmes',
            align: 'center'
        },
        chart: {
            type: 'donut',
            height: 250,
            events: {
                click: function(event, chartContext, opts) {
                    showGrid.set(true)
                    const key = Object.keys(stateCounts)[opts.dataPointIndex]
                    gridFilter.set({
                        filter: stateCounts[key].map(id => devices.find(d => d.id === id).name),
                        index: opts.dataPointIndex
                    })
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
        },
        tooltip: {
            y: {
                formatter: (_, b) => {
                    const key = Object.keys(stateCounts)[b.seriesIndex]
                    return stateCounts[key].map(id => devices.find(d => d.id === id).name).join('<br>')
                },
                title: {
                    formatter: (category) => {
                        return `<i>${category} (${stateCounts[category].length})</i>`
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
