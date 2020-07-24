import * as qs from 'qs';

export const getRedirectUrl = (isSpecific?) => {
    const parsed = qs.parse(location.search, { ignoreQueryPrefix: true });
    if (parsed.redirect_url) {
        let query = parsed.redirect_url;
        if (parsed.fiat && parsed.crypto && parsed.fiatValue) {
            query += `${isSpecific ? '?' : '&'}fiat=${parsed.fiat}&crypto=${parsed.crypto}&fiatValue=${parsed.fiatValue}`;
        }

        return query;
    }

    return false;
};

export const buildUrlWithRedirect = url => {
    const redirectUrl = getRedirectUrl(false);
    if (redirectUrl) {
        return `${url}?redirect_url=${redirectUrl}`;
    }

    return url;
};

export const redirectIfSpecified = url => {
    const redirectUrl = getRedirectUrl(true);
    if (redirectUrl) {
        return redirectUrl;
    }

    return url;
};

export const redirect = callback => {
    const redirectUrl = getRedirectUrl(true);
    if (redirectUrl && redirectUrl.startsWith('/?')) {
        location.replace(redirectUrl);

        return;
    }
    callback();
};
