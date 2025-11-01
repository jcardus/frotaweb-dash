<script>
    import ApexCharts from 'apexcharts';
    import {onMount} from "svelte";
    import {t} from '$lib/i18n.js'
    export let devices = []
    export let positions = []
    import {getOdometer, getMinutes} from "$lib/utils.js";



    const getValue = (p, d, t = 'odometer') => t === 'odometer' ?
        getOdometer(d, p) :
        getMinutes(p)

    export let title

    const data = positions
        .filter(p => getValue(p))
        .sort((a, b) => getValue(b, devices.find(d => d.id === b.deviceId)) - getValue(a, devices.find(d => d.id === a.deviceId)))
        .slice(0, 18)

    const options = {
        title: {
            text: title,
            align: 'center'
        },
        series: [{
            name: t('odometer'),
            data: data.map(p => getValue(p, devices.find(d => d.id === p.deviceId), 'odometer'))
        },{
            name: 'Minutos',
            data: data.map(p => getValue(p, devices.find(d => d.id === p.deviceId), 'hours'))
        }],
        chart: {
            type: 'bar',
            height: '100%',
            width: '100%',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                borderRadiusApplication: 'end',
                barHeight: '100%',
                distributed: true,
                horizontal: true,
            }
        },
        legend: {
            show: false // Hide the legend at the bottom
        },
        stroke: {
            width: 1,
            colors: ['#000']
        },
        dataLabels: {
            enabled: true,
            textAnchor: 'start',
            offsetX: 0,
            dropShadow: {
                enabled: true
            }
        },
        yaxis: {
            labels: {
                show: true
            }
        },
        xaxis: {
            categories: data.map(p => devices.find(d => d.id===p.deviceId).name)
        }
    };
    let div
    onMount(() => {
            options.chart.height = '100%'
            options.chart.width = '100%'
            const chart = new ApexCharts(div, options)
            chart.render()
            setTimeout(() => chart.updateOptions({}, true), 1)
        }
    )
</script>

<div class="rounded-lg shadow-md bg-gray-200 h-full">
    <div bind:this={div}></div>
</div>
