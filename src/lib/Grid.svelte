<script>
    import {t} from '$lib/i18n.js'
    import {showGrid} from './store.js'
    import {onDestroy} from "svelte";
    export let showGridValue
    const unsubscribe = showGrid.subscribe((value) => {
        showGridValue = value;
    });
    onDestroy(unsubscribe)
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
        <div class="flex min-h-full justify-center p-4 text-center items-center sm:p-0" onclick="{() => showGrid.set(false)}">
            <!--
              Modal panel, show/hide based on modal state.

              Entering: "ease-out duration-300"
                From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                To: "opacity-100 translate-y-0 sm:scale-100"
              Leaving: "ease-in duration-200"
                From: "opacity-100 translate-y-0 sm:scale-100"
                To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            -->
            <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg" onclick={e => e.stopPropagation()}>
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            {t('Device')}
                        </th>
                        <th scope="col" class="px-6 py-3">
                            {t('Última comunicação')}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            .
                        </th>
                        <td class="px-6 py-4">
                            .
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
{/if}