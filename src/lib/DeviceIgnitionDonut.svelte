<script>
    import { onMount } from 'svelte';
    import ApexCharts from 'apexcharts';

    export let positions = []
    let stateCounts = {moving: 0, stopped: 0, ralenti: 0};
    positions.forEach(position => {
        if (position.attributes.ignition && !position.speed) stateCounts.ralenti++;
        else if (position.attributes.motion) stateCounts.moving++;
        else stateCounts.stopped++;
    });
    // Initialize chart options for the donut chart
    const options = {
        series: Object.values(stateCounts),
        title: {
            text: 'Movimento',
            align: 'center'
        },
        chart: {
            type: 'donut',
            height: 250
        },
        legend: {
            position: 'bottom'
        },
        labels: ['Em movimento', 'Desligado', 'Ralenti'],
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
