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
            text: 'Horómetro (Horas)',
            align: 'center'
        },
        series: [{
            name: 'Horómetro',
            data: data.map(p => Math.round(p.attributes.hours/1000/3600))
        }],
        chart: {
            type: 'bar',
            height: '100%'
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
