<script>
    import {onDestroy} from "svelte";
    import {loadingDevice} from "$lib/store.js";
    import palette from "$lib/palette.js";

    let _loadingDevice = $state('');

    const unsubscribe = loadingDevice.subscribe((value) => {
        _loadingDevice = value;
    });

    onDestroy(unsubscribe);
</script>
<div class="absolute h-32 inset-0 p-2 flex flex-col items-center justify-center bg-gray-200 bg-opacity-0 z-10">
    <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
    <div style="{`color: ${palette(undefined, undefined).secondary.main}`}" class="w-full mt-4 text-center font-medium text-sm">{_loadingDevice}</div>
</div>
