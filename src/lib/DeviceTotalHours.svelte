<script>
    import ApexCharts from 'apexcharts';
    import {onMount} from "svelte";
    export let devices = []
    export let positions = []

    const data = positions
        .filter(p => p.attributes.hours)
        .sort((a,b) => b.attributes.hours - a.attributes.hours)


    const options = {
        title: {
            text: 'Horímetro (Horas)',
            align: 'center'
        },
        series: [
            {
                data: data.map(p => Math.round(p.attributes.hours/1000/3600))
            }
        ],
        chart: {
            type: 'bar',
            height: '100%'
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                borderRadiusApplication: 'end',
                barHeight: '95%',
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
            formatter: function (val, opt) {
                return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
            },
            offsetX: 0,
            dropShadow: {
                enabled: true
            }
        },
        xaxis: {
            categories: data.map(p => devices.find(d => d.id===p.deviceId).name)
        },
        yaxis: {
            labels: {
                show: false
            }
        },
    };
    let div
    onMount(() => new ApexCharts(div, options).render())
</script>
<div class="rounded-lg shadow-md bg-gray-200">
    <div bind:this={div}></div>
</div>
