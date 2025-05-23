export const ssr = false
export const load = async (event) => {
    return {promise: _load(event)}
};

export const _load = async (event) => {
    let devices, positions, groups
    let response = await event.fetch('/api/devices');
    if (response.ok) {
        devices = await response.json()
    }

    response = await event.fetch('/api/positions');
    if (response.ok) {
        positions = await response.json()
        positions.forEach( p => devices.find(d => d.id === p.deviceId).position = p)
    }

    response = await event.fetch('/api/groups?all=true');
    if (response.ok) {
        groups = await response.json()
    }
    return {devices, positions, groups}
};
