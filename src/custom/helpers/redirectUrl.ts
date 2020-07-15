
import * as qs from 'qs';

export const getRedirectUrl = () => {
    const parsed = qs.parse(window.location.search, { ignoreQueryPrefix: true });

    return parsed.redirect_url;
};

export const buildUrlWithRedirect = url => {
    const redirectUrl = getRedirectUrl();
    if (redirectUrl) {
        return `${url}?redirect_url=${redirectUrl}`;
    }

    return url;
};

export const redirectIfSpecified = url => {
    const redirectUrl = getRedirectUrl();
    if (redirectUrl) {
        return redirectUrl;
    }

    return url;
};

export const redirect = callback => {
    if (getRedirectUrl() === '/') {
        window.location.replace('/');

        return;
    }
    callback();
};
