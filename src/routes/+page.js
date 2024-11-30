export const ssr = false
export const load = async (event) => {
    return {promise: _load(event)}
};

export const _load = async (event) => {
    let devices, positions
    let response = await event.fetch('/api/devices');
    if (response.ok) {
        devices = await response.json()
    }

    response = await event.fetch('/api/positions');
    if (response.ok) {
        positions = await response.json()
    }
    return {devices, positions}
};
