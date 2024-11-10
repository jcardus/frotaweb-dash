<script>
    import ApexCharts from 'apexcharts';
    import {onMount} from "svelte";
    export let devices = []
    export let positions = []
    const data = positions
        .filter(p => p.attributes.totalDistance)
        .sort((a, b) =>
            (b.attributes.odometer || b.attributes.totalDistance) -
            (a.attributes.odometer || a.attributes.totalDistance))
        .slice(0, 20)

    const options = {
        title: {
            text: 'Hodômetro (Kms)',
            align: 'center'
        },
        series: [{
            name: 'Hodômetro',
            data: data.map(p => Math.round((p.attributes.odometer || p.attributes.totalDistance)/1000))
        }],
        chart: {
            type: 'bar',
            height: '100%'
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
            formatter: function (val, opt) {
                return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
            },
            offsetX: 0,
            dropShadow: {
                enabled: true
            }
        },
        yaxis: {
            labels: {
                show: false
            }
        },
        xaxis: {
            categories: data.map(p => devices.find(d => d.id===p.deviceId).name)
        }
    };
    let div
    onMount(() => new ApexCharts(div, options).render())
</script>

<div class="rounded-lg shadow-md bg-gray-200">
    <div bind:this={div}></div>
</div>
