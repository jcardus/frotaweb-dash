<script>
    import ApexCharts from 'apexcharts';
    import {onMount} from "svelte";
    export let devices = []
    export let positions = []
    export let type
    const getValue = (p) => type === 'odometer' ?
        Math.round((p.attributes.odometer || p.attributes.totalDistance)/1000) :
        Math.round(p.attributes.hours/1000/3600)
    export let title

    const data = positions
        .filter(p => getValue(p))
        .sort((a, b) => getValue(b) - getValue(a))
        .slice(0, 20)

    const options = {
        title: {
            text: title,
            align: 'center'
        },
        series: [{
            name: title,
            data: data.map(p => getValue(p))
        }],
        chart: {
            type: 'bar',
            height: '100%',
            width: '100%'
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
    onMount(() => {
            const chart = new ApexCharts(div, options)
            chart.render()
            setTimeout(() => chart.updateOptions({}, true), 1)
        }
    )
</script>

<div class="rounded-lg shadow-md bg-gray-200 h-full-max">
    <div bind:this={div}></div>
</div>
