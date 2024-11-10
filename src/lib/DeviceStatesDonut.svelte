<script>
    import { onMount } from 'svelte';
    import ApexCharts from 'apexcharts';

    export let devices = []
    let stateCounts = {online: 0, offline: 0, unknown: 0};
    devices.forEach(device => {
        if (device.status === 'online') stateCounts.online++;
        else if (device.status === 'offline') stateCounts.offline++;
        else if (device.status === 'unknown') stateCounts.unknown++;
    });
    // Initialize chart options for the donut chart
    const options = {
        series: Object.values(stateCounts),
        title: {
            text: 'Status',
            align: 'center'
        },
        chart: {
            type: 'donut',
        },
        legend: {
            position: 'bottom'
        },
        labels: ['Online', 'Offline', 'Desconhecido'],
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
