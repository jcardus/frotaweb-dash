<script>
    import {t} from '$lib/i18n.js'
    import {showGrid, gridFilter} from './store.js'
    import {onDestroy} from "svelte";
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
    const {devices} = $props()
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

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto" >
        <div class="flex  justify-center text-center p-5" onclick="{() => showGrid.set(false)}">
            <!--
              Modal panel, show/hide based on modal state.

              Entering: "ease-out duration-300"
                From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                To: "opacity-100 translate-y-0 sm:scale-100"
              Leaving: "ease-in duration-200"
                From: "opacity-100 translate-y-0 sm:scale-100"
                To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            -->
            <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all" onclick={e => e.stopPropagation()}>
                <table class="w-full text-sm text-left text-white table-auto">
                    <thead class="text-xs text-gray-700 uppercase">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            {t('Device')}
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
                            <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap text-white">
                                {device.name}
                            </th>
                            <td class="px-6 py-4">
                                {new Date(device.lastUpdate).toLocaleString()}
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