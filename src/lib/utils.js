export const getOdometer = (device, position)=> {
    if (!position) {
        return 0
    }
    return Math.round((
        (device && !device.attributes['report.ignoreOdometer'] && position.attributes.odometer)
        || position.attributes.totalDistance
    ) / 1000);
}

export function getMinutes(p) {
    return Math.round((p.attributes.hours < 0 ? 0 : p.attributes.hours) / 1000 / 60);
}

export function getHours(p) {
    return Math.round((p.attributes.hours < 0 ? 0 : p.attributes.hours) / 1000 / 60 / 60);
}