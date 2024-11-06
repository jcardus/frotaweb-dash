<script>
    import { onMount } from 'svelte';
    import ApexCharts from 'apexcharts';

    export let devices = []
    let stateCounts = {Online: 0, '12 horas': 0, '24 horas': 0, '36 horas': 0, '48 horas': 0, '+ 48 horas': 0};
    devices.forEach(device => {
        const lastUpdate = new Date().getTime() - new Date(device.lastUpdate).getTime()
        if (device.status === 'online') stateCounts.Online++;
        else if (lastUpdate < 12*60*1000) stateCounts['12 horas']++
        else if (lastUpdate < 24*60*1000) stateCounts['24 horas']++
        else if (lastUpdate < 36*60*1000) stateCounts['36 horas']++
        else if (lastUpdate < 48*60*1000) stateCounts['48 horas']++
        else stateCounts['+ 48 horas']++
    });
    // Initialize chart options for the donut chart
    const options = {
        series: Object.values(stateCounts),
        title: {
            text: 'Última comunicação',
            align: 'center'
        },
        chart: {
            type: 'donut',
        },
        legend: {
            position: 'bottom'
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

<div bind:this={div} class="flex justify-center items-center rounded-lg shadow-md bg-gray-100">
</div>
