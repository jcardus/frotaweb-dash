<script>
    import ApexCharts from 'apexcharts';
    import {onMount} from "svelte";
    export let devices = []
    export let positions = []
    import {t} from '$lib/i18n'

    var options = {
        title: {
            text: t('Ultima posição / nível de bateria'),
            align: 'left'
        },
        series: positions.filter(p => new Date(p.fixTime).getFullYear()>2000).map(p => ({
            name: devices.find(d => d.id === p.deviceId).name,
            data:[[new Date(p.fixTime).getTime(), p.attributes.batteryLevel || 0]]
        })),
        chart: {
            type: 'scatter',
            zoom: {
                type: 'xy',
            },
            height: '100%'
        },

        legend: {show: false},

        dataLabels: {
            enabled: false,
        },
        grid: {
            xaxis: {
                lines: {
                    show: true,
                },
            },
            yaxis: {
                lines: {
                    show: false,
                },
            },
        },
        xaxis: {
            type: 'datetime',
        },
        yaxis: {},
    };
    let div
    onMount(() => new ApexCharts(div, options).render())
</script>
<div class="rounded-lg shadow-md bg-gray-200">
    <div bind:this={div} ></div>
</div>
