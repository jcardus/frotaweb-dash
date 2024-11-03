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
            text: 'Odómetro (Kms)',
            align: 'center'
        },
        series: [{
            name: 'Odómetro',
            data: data.map(p => Math.round((p.attributes.odometer || p.attributes.totalDistance)/1000))
        }],
        chart: {
            type: 'bar'
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                borderRadiusApplication: 'end',
                horizontal: true,
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: data.map(p => devices.find(d => d.id===p.deviceId).name)
        }
    };
    let div
    onMount(() => new ApexCharts(div, options).render())
</script>

<div bind:this={div}></div>
