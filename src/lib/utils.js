import { es, ptBR, pt } from 'date-fns/locale'
import { formatDistance } from 'date-fns'


const locales = {
    'es-ES': es,
    'es-CL': es,
    'pt-BR': ptBR,
    'pt-PT': pt
};

const getLocale = () => {
    const userLang = navigator.language;
    if (!locales[userLang]) {
        // sentry
    }
    return locales[userLang] || ptBR; // Default to en-US if not available
};

export const fromNow = (date) => {
    return formatDistance(date, new Date(), {locale: getLocale(), addSuffix: true})
}

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
    if (!p) {
        return 0
    }
    return Math.round((p.attributes.hours < 0 ? 0 : p.attributes.hours) / 1000 / 60);
}

export function getHours(p) {
    if (!p) {
        return 0
    }
    return Math.round((p.attributes.hours < 0 ? 0 : p.attributes.hours) / 1000 / 60 / 60);
}

