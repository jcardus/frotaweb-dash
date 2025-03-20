<script>
    import {t} from '$lib/i18n.js'
    import {showGrid, gridFilter} from './store.js'
    import {onDestroy} from "svelte";
    import {getOdometer, getHours} from "$lib/utils.js";

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

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto" onclick="{() => showGrid.set(false)}">
        <div class="flex  justify-center text-center p-5" >
            <!--
              Modal panel, show/hide based on modal state.

              Entering: "ease-out duration-300"
                From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                To: "opacity-100 translate-y-0 sm:scale-100"
              Leaving: "ease-in duration-200"
                From: "opacity-100 translate-y-0 sm:scale-100"
                To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            -->
            <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
                <table class="w-full text-sm text-left text-white table-auto" onclick={e => e.stopPropagation()}>
                    <thead class="text-xs text-gray-700 uppercase">
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