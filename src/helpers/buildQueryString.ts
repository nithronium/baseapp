import { buildQueryStringArray } from './';

// tslint:disable:no-any
export const buildQueryString = (action: any) => (Object.entries(action)
    .filter(w => w[1] !== '')
    .map((k: any) => (
        Array.isArray(k[1]) ? buildQueryStringArray(k[1], k[0]) :
        `${k[0]}=${k[0] === 'page' ?
        encodeURIComponent(String(+k[1] + 1)) :
        encodeURIComponent(k[1])}`))
    .join('&'));
