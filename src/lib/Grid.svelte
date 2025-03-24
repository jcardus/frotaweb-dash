<script>
    import {t} from '$lib/i18n.js'
    import {showGrid, gridFilter} from './store.js'
    import {onDestroy} from "svelte";
    import {getOdometer, getHours} from '$lib/utils.js';
    import { utils, writeFileXLSX } from 'xlsx';
    import {fromNow} from '$lib/utils.js';

    // eslint-disable-next-line svelte/valid-compile
    let tbl
    let showGridValue = $state(false)
    const unsubscribe = showGrid.subscribe((value) => {
        showGridValue = value;
    });
    let filter = $state([])
    let index = $state()
    let filterValue = $state()
    const unsubscribeFilter = gridFilter.subscribe((value) => {
        filter = value.filter
        index = value.index
        filterValue = value.filterValue
    });
    onDestroy(() => {
        unsubscribe()
        unsubscribeFilter()
    })
    const {devices, groups, positions} = $props()


    const getXls =  () => {
        const elt = tbl.getElementsByTagName("TABLE")[0];
        const wb = utils.table_to_book(elt);
        writeFileXLSX(wb, "devices.xlsx");
    }

    // Track which categories are open
    let closedGroups = $state({})
    let grouped = $state(true)

    function toggleCategory(category) {
        // Svelte reactivity requires reassigning the entire object
        closedGroups = { ...closedGroups, [category]: !closedGroups[category] };
    }

    async function fetchAddress(p) {
        if (p.address) {
            return p.address
        }
        const response = await fetch(`/api/server/geocode?${new URLSearchParams(p).toString()}`)
        if (response.ok) {
            p.address = await response.text()
            return p.address
        }
        return ''
    }

</script>

{#if showGridValue}
<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true" >
    <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true">

    </div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto" onclick="{() => showGrid.set(false)}" role="toolbar" tabindex="0" onkeydown={() => {}}>
        <div class="flex  justify-center text-center p-10" >
            <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all p-1" tabindex="0" role="toolbar" onclick={e => e.stopPropagation()} onkeydown={() => {}}>
                <table class="w-full text-sm text-left text-white table-auto">
                    <thead class="text-xs text-gray-700 uppercase">
                    <tr class="no-print">
                        <td class="px-6" colspan="3">
                            {devices.filter(d => filter.length === 0 || filter.includes(d.name)).length} / {devices.length}
                            <span class="inline-flex items-center rounded bg-gray-50 px-1 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset {!filter.length && 'hidden'}">
                                {filterValue}
                                <button type="button" onclick="{() => filter.length=0}" class="inline-flex items-center rounded-md px-1 py-1 text-xs ring-1 ring-gray-300 ring-inset">
                                <svg xmlns="http://www.w3.org/2000/svg" class="size-2 text-gray-400" viewBox="0 0 384 512" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <!-- . -->
                                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                                </svg>
                            </button>
                            </span>
                            <span class="inline-flex items-center rounded bg-gray-50 px-1 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset">
                                {t('grouped')}
                                <input type="checkbox" bind:checked={grouped} class="text-gray-400">
                            </span>

                        </td>
                        <td class="text-right px-6 py-1" colspan="3">
                            <button type="button" onclick={getXls} class="inline-flex items-center rounded-md bg-white px-1 py-1 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
                                <svg xmlns="http://www.w3.org/2000/svg" class="mr-1.5 -ml-0.5 size-5 text-gray-400" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <!--.-->
                                    <path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 144-176 0c-35.3 0-64 28.7-64 64l0 144-80 0c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM224 368c0 7.3 2.2 14.4 6.2 20.4l9.8 14.7 9.8-14.7c4-6.1 6.2-13.2 6.2-20.4c0-8.8 7.2-16 16-16s16 7.2 16 16c0 13.6-4 26.9-11.6 38.2L259.2 432l17.2 25.8C284 469.1 288 482.4 288 496c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-7.3-2.2-14.4-6.2-20.4L240 460.8l-9.8 14.7c-4 6.1-6.2 13.2-6.2 20.4c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-13.6 4-26.9 11.6-38.2L220.8 432l-17.2-25.8C196 394.9 192 381.6 192 368c0-8.8 7.2-16 16-16s16 7.2 16 16zm96 128l0-128c0-8.8 7.2-16 16-16s16 7.2 16 16l0 112 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-48 0c-8.8 0-16-7.2-16-16zm88-98.3c0-25.2 20.4-45.7 45.7-45.7l26.3 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-26.3 0c-7.5 0-13.7 6.1-13.7 13.7c0 5.2 2.9 9.9 7.6 12.2l31.2 15.6c15.5 7.7 25.2 23.5 25.2 40.8c0 25.2-20.4 45.7-45.7 45.7L432 512c-8.8 0-16-7.2-16-16s7.2-16 16-16l26.3 0c7.5 0 13.7-6.1 13.7-13.7c0-5.2-2.9-9.9-7.6-12.2l-31.2-15.6C417.8 430.8 408 415 408 397.7z"/>
                                </svg>
                            </button>
                            <button type="button" onclick={() => window.print()} class="inline-flex items-center rounded-md bg-white px-1 py-1 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
                                <svg xmlns="http://www.w3.org/2000/svg" class="mr-1.5 -ml-0.5 size-5 text-gray-400" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <!--.-->
                                    <path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 144-208 0c-35.3 0-64 28.7-64 64l0 144-48 0c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM176 352l32 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-16 0 0 32c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48 0-80c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24l-16 0 0 48 16 0zm96-80l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96 16 0zm80-112c0-8.8 7.2-16 16-16l48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64 0-64z"/>
                                </svg>
                            </button>
                            <button type="button" onclick="{() => showGrid.set(false)}" class="inline-flex items-center rounded-md bg-white px-1 py-1 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
                                <svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-gray-400" viewBox="0 0 384 512" fill="currentColor" aria-hidden="true" data-slot="icon"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                            </button>
                        </td>
                    </tr>
                </table>
                <div bind:this={tbl}>
                    <table class="w-full text-sm text-left text-white table-auto">
                    <thead class="text-xs text-gray-700 uppercase">
                    <tr>
                        <th scope="col" class="text-center">
                            {t('Device')}
                        </th>
                        <th scope="col" class="text-center" class:hidden={grouped}>
                            {t('Grupo')}
                        </th>
                        <th scope="col" class="text-center">
                            {t('Kms')}
                        </th>
                        <th scope="col" class="text-center">
                            {t('Horas')}
                        </th>
                        <th scope="col" class="text-center">
                            {t('Última comunicação')}
                        </th>
                        <th scope="col" class="text-center">
                            {t('Status')}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {#each groups.filter(g => devices.filter(d => filter.length === 0 || filter.includes(d.name)).map(d => d.groupId).includes(g.id)) as group}
                        <tr class="bg-gray-500 border-b" onclick={() => toggleCategory(group.name)} class:hidden={!grouped} style="cursor: pointer">
                            <td colspan="5" class="px-1">
                                {group.name}  ({devices.filter(d => filter.length === 0 || filter.includes(d.name)).filter(d => d.groupId === group.id).length}) {closedGroups[group.name] ? "▲" : "▼"}
                            </td>
                        </tr>
                        {#each devices.filter(d => filter.length === 0 || filter.includes(d.name)).filter(d => d.groupId === group.id) as device}
                            <tr
                                    onclick={() => {
                                        const url = '/map?deviceId='+device.uniqueId
                                        window.parent.postMessage({type: 'openUrl', url}, '*')
                                        console.log('sent', url)
                                    }}
                                    onmouseenter={(e) => e.target.style.opacity='0.8'}
                                    onmouseleave={(e) => e.target.style.opacity='1'}
                                    style="cursor: pointer; {filter.length && `background: ${
                                        // eslint-disable-next-line no-undef
                                        Apex.colors[index]
                                    }`}"
                                    class="bg-gray-600 border-b" class:hidden={closedGroups[group.name]}
                            >
                                <td class="px-2">
                                    {device.name}
                                </td>
                                <td class="px-2" class:hidden={grouped}>
                                    {groups.find(g => g.id === device.groupId)?.name}
                                </td>
                                <td class="text-right px-2">
                                    {getOdometer(device, positions.find(p => p.deviceId === device.id))}
                                </td>
                                <td class="text-right">
                                    {getHours(positions.find(p => p.deviceId === device.id))}
                                </td>
                                <td class="px-2">
                                    <span class="text-xs">
                                    {#await fetchAddress(positions.find(p => p.deviceId === device.id))}
                                        ...
                                    {:then address}
                                        {address}
                                    {/await}
                                    </span><br>
                                    {fromNow(new Date(device.lastUpdate))}
                                </td>
                                <td class="px-2">
                                    {device.status}
                                </td>
                            </tr>
                        {/each}
                    {/each}

                    </tbody>
                </table>
                </div>
            </div>
        </div>
    </div>
</div>
{/if}

<style>
    @media print {
        .no-print {
            display: none !important;
        }
    }
    tr:hover {
        background-color: lightgray; /* Change to your preferred color */
    }
</style>
