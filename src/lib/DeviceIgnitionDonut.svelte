<script>
    import { onMount } from 'svelte';
    import ApexCharts from 'apexcharts';
    import {t} from '$lib/i18n'
    import {gridFilter, showGrid} from "$lib/store.js";
    export let positions = []
    export let devices = []
    let stateCounts = {moving: [], stopped: [], ralenti: []};
    positions.forEach(position => {
        if (position.attributes.ignition && !position.speed) stateCounts.ralenti.push(position.deviceId);
        else if (position.attributes.motion) stateCounts.moving.push(position.deviceId);
        else stateCounts.stopped.push(position.deviceId);
    });
    // Initialize chart options for the donut chart
    const options = {
        series: Object.values(stateCounts).map(v => v.length),
        title: {
            text: t('Movimento'),
            align: 'center'
        },
        chart: {
            type: 'donut',
            height: 230,
            events: {
                click: function(event, chartContext, opts) {
                    showGrid.set(true)
                    gridFilter.set({
                        filter: stateCounts[Object.keys(stateCounts)[opts.dataPointIndex]]?.map(p => devices.find(d => d.id === p).name),
                        index: opts.dataPointIndex,
                        filterValue: Object.keys(stateCounts)[opts.dataPointIndex]
                    })
                }
            }
        },
        legend: {
            position: 'right'
        },
        labels: ['Em movimento', 'Desligado', 'Ocioso'],
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
