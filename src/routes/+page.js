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

        positions.slice(0, 20).forEach(p => {
            const query = new URLSearchParams(p);
            fetch(`/api/server/geocode?${query.toString()}`).then(response => {
                if (response.ok) {
                    response.text().then(r => (p.address = r))
                }
            })
        })
    }

    response = await event.fetch('/api/groups?all=true');
    if (response.ok) {
        groups = await response.json()
    }
    return {devices, positions, groups}
};
