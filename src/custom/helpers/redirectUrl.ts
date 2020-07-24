export const getRedirectUrl = () => {
    // tslint:disable-next-line:no-console
    console.log('...........location.search', location.search);
    const parsed = location.search.slice(1).split('&').reduce((arr, item) => {
        arr[item.split('=')[0]] = item.split('=')[1];

        return arr;
    }, {});

    // const parsed = qs.parse(location.search, { ignoreQueryPrefix: true });
    // tslint:disable-next-line:no-console
    console.log('...........parsed redirecturl', parsed);
    //@ts-ignore
    if (parsed.redirect_url) {
        //@ts-ignore
        let query = parsed.redirect_url;
        //@ts-ignore
        if (parsed.fiat && parsed.crypto && parsed.fiatValue) {
            //@ts-ignore
            query += `&fiat=${parsed.fiat}&crypto=${parsed.crypto}&fiatValue=${parsed.fiatValue}`;
        }

        return query;
    }

    return false;
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
