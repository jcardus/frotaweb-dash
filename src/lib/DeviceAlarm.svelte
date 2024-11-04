<script>
    import { onMount } from 'svelte';
    import ApexCharts from 'apexcharts';

    export let positions = []
    let stateCounts = {other: 0, alarm: 0};
    positions.forEach(position => {
        if (position.attributes.alarm) stateCounts.alarm++;
        else stateCounts.other++;
    });
    // Initialize chart options for the donut chart
    const options = {
        series: Object.values(stateCounts),
        title: {
            text: 'Alarmes',
            align: 'center'
        },
        chart: {
            type: 'donut',
        },
        legend: {
            position: 'bottom'
        },
        labels: ['Normal', 'Em alarme'],
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

<div bind:this={div} class="flex justify-center items-center rounded-lg shadow-md bg-gray-100">
</div>
