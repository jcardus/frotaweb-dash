<script>
    import {fromNow, getHours, getOdometer} from "$lib/utils.js";
    const {device, groups, grouped, closedGroups, filter, group, index} = $props()
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
        class="bg-gray-600 border-b" class:hidden={group && closedGroups[group.name]}
>
    <td class="px-2">
        {device.name}
    </td>
    <td class="px-2" class:hidden={grouped}>
        {groups.find(g => g.id === device.groupId)?.name}
    </td>
    <td class="text-right px-2">
        {getOdometer(device, device.position)}
    </td>
    <td class="text-right">
        {getHours(device.position)}
    </td>
    <td class="px-2">
                                    <span class="text-xs">
                                    {#await fetchAddress(device.position)}
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
