<script>
    import {t} from '$lib/i18n.js'
    import {showGrid, gridFilter} from './store.js'
    import {onDestroy} from "svelte";
    import {getOdometer, getHours} from "$lib/utils.js";
    import { utils, writeFileXLSX } from 'xlsx';

    let tbl
    let showGridValue = $state(false)
    const unsubscribe = showGrid.subscribe((value) => {
        showGridValue = value;
    });
    let filter = $state([])
    let index = $state()
    const unsubscribeFilter = gridFilter.subscribe((value) => {
        filter = value.filter
        index = value.index
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
</script>

{#if showGridValue}
<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true" >
    <!--
      Background backdrop, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    -->
    <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true">

    </div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto" onclick="{() => showGrid.set(false)}" role="toolbar" tabindex="0" onkeydown={() => {}}>
        <div class="flex  justify-center text-center p-14" >
            <!--
              Modal panel, show/hide based on modal state.

              Entering: "ease-out duration-300"
                From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                To: "opacity-100 translate-y-0 sm:scale-100"
              Leaving: "ease-in duration-200"
                From: "opacity-100 translate-y-0 sm:scale-100"
                To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            -->
            <div bind:this={tbl} class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all" tabindex="0" role="toolbar" onclick={e => e.stopPropagation()} onkeydown={() => {}}>
                <table class="w-full text-sm text-left text-white table-auto">
                    <thead class="text-xs text-gray-700 uppercase">
                    <tr >
                        <td class="px-6">
                            {devices.filter(d => filter.includes(d.name)).length} / {devices.length}
                        </td>
                        <td class="text-right no-print px-6 py-1" colspan="5">
                            <button type="button" onclick={getXls} class="inline-flex items-center rounded-md bg-white px-1 py-1 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
                                <svg xmlns="http://www.w3.org/2000/svg" class="mr-1.5 -ml-0.5 size-5 text-gray-400" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <!--!Font Awesome Pro 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2025 Fonticons, Inc.--><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 144-176 0c-35.3 0-64 28.7-64 64l0 144-80 0c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM224 368c0 7.3 2.2 14.4 6.2 20.4l9.8 14.7 9.8-14.7c4-6.1 6.2-13.2 6.2-20.4c0-8.8 7.2-16 16-16s16 7.2 16 16c0 13.6-4 26.9-11.6 38.2L259.2 432l17.2 25.8C284 469.1 288 482.4 288 496c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-7.3-2.2-14.4-6.2-20.4L240 460.8l-9.8 14.7c-4 6.1-6.2 13.2-6.2 20.4c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-13.6 4-26.9 11.6-38.2L220.8 432l-17.2-25.8C196 394.9 192 381.6 192 368c0-8.8 7.2-16 16-16s16 7.2 16 16zm96 128l0-128c0-8.8 7.2-16 16-16s16 7.2 16 16l0 112 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-48 0c-8.8 0-16-7.2-16-16zm88-98.3c0-25.2 20.4-45.7 45.7-45.7l26.3 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-26.3 0c-7.5 0-13.7 6.1-13.7 13.7c0 5.2 2.9 9.9 7.6 12.2l31.2 15.6c15.5 7.7 25.2 23.5 25.2 40.8c0 25.2-20.4 45.7-45.7 45.7L432 512c-8.8 0-16-7.2-16-16s7.2-16 16-16l26.3 0c7.5 0 13.7-6.1 13.7-13.7c0-5.2-2.9-9.9-7.6-12.2l-31.2-15.6C417.8 430.8 408 415 408 397.7z"/></svg>
                            </button>
                            <button type="button" onclick={() => window.print()} class="inline-flex items-center rounded-md bg-white px-1 py-1 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
                                <svg xmlns="http://www.w3.org/2000/svg" class="mr-1.5 -ml-0.5 size-5 text-gray-400" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 144-208 0c-35.3 0-64 28.7-64 64l0 144-48 0c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM176 352l32 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-16 0 0 32c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48 0-80c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24l-16 0 0 48 16 0zm96-80l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96 16 0zm80-112c0-8.8 7.2-16 16-16l48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64 0-64z"/></svg>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            {t('Device')}
                        </th>
                        <th scope="col" class="px-6 py-3">
                            {t('Group')}
                        </th>
                        <th scope="col" class="px-6 py-3">
                            {t('Horas')}
                        </th>
                        <th scope="col" class="px-6 py-3">
                            {t('Km')}
                        </th>
                        <th scope="col" class="px-6 py-3">
                            {t('Última comunicação')}
                        </th>
                        <th scope="col" class="px-6 py-3">
                            {t('Status')}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {#each devices.filter(d => filter.includes(d.name)) as device}
                        <tr style="background: {Apex.colors[index]}" class="border-b">
                            <td class="px-6 py-4">
                                {device.name}
                            </td>
                            <td>
                                {groups.find(g => g.id === device.groupId)?.name}
                            </td>
                            <td class="text-right">
                                {getOdometer(device, positions.find(p => p.deviceId === device.id))}
                            </td>
                            <td class="text-right">
                                {getHours(positions.find(p => p.deviceId === device.id))}
                            </td>
                            <td class="px-6 py-4">
                                {new Date(device.lastUpdate).toLocaleString()}<br>
                                {positions.find(p => p.deviceId === device.id)?.address}
                            </td>
                            <td class="px-6 py-4">
                                {device.status}
                            </td>
                        </tr>
                    {/each}
                    </tbody>
                </table>
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
</style>