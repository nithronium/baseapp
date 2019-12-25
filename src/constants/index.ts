import { pluginsConstants } from '../plugins/constants';
export const PG_TITLE_PREFIX = 'Emirex';

export const MINIMAL_BALANCE = 100;

export const pgRoutes = (isLoggedIn: boolean): string[][] => {
    const routes = [
        ['page.header.navbar.trade', '/trading/'],
        ['page.header.navbar.wallets', '/wallets'],
        ['page.header.navbar.openOrders', '/orders'],
        ['page.header.navbar.history', '/history'],
        ...pluginsConstants(false),
    ];
    const routesUnloggedIn = [
        ['page.header.navbar.signIn', '/signin'],
        ['page.header.navbar.trade', '/trading/'],
        ...pluginsConstants(false),
    ];
    return isLoggedIn ? routes : routesUnloggedIn;
};

export const DEFAULT_CCY_PRECISION = 4;
export const STORAGE_DEFAULT_LIMIT = 50;
export const VALUATION_PRIMARY_CURRENCY = 'USD';
export const VALUATION_SECONDARY_CURRENCY = 'ETH';

export const colors = {
    light: {
        chart: {
            primary: '#fff',
            up: '#54B489',
            down: '#E85E59',
        },
        navbar: {
            avatar: '#28334E',
            language: '#28334E',
            logout: '#28334E',
            sun: '#648280',
            moon: '#222627',
        },
    },
    basic: {
        chart: {
            primary: '#222627',
            up: '#54B489',
            down: '#E85E59',
        },
        navbar: {
            avatar: '#648280',
            language: '#648280',
            logout: 'fff',
            sun: '#fff',
            moon: '#28334E',
        },
    },
};
