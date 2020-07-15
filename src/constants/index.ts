export const PG_TITLE_PREFIX = 'Emirex';

export const MINIMAL_BALANCE = 100;

export const coinOption = (): object[] =>  ([
    { key: '', href: '/buyemrx', label: 'footer_links_buyEmirex'},
    { key: '', href: '/buybtc', label: 'footer_links_buyBitcoin' },
    { key: '', href: '/buyeth', label: 'footer_links_buyEthereum'},
    { key: '', href: '/buyusdt', label: 'footer_links_buyTether'},
    { key: '', href: '/buybtc', label: 'footer_links_other_crypto'},
].map((link, index) => {
    link.key = `footer-link-${index}-${link.href}-${link.label}`;

    return link;
}));

export const tradeOption = (): object[] => ([
    { key: '', href: '/trading/btcusdt', label: 'nav.link.spot' , description: 'nav.link.spot.description'},
    { key: '', href: '/futures', label: 'nav.link.futures', description: 'nav.link.futures.description', soon: true},
    // { key: '', href: '/margin', label: 'nav.link.margin', description: 'nav.link.margin.description'},
    { key: '', href: '/instant-exchange', label: 'nav.link.instant-exchange', description: 'nav.link.instant-exchange.description', soon: true},
    // { key: '', href: '/p2p', label: 'nav.link.p2p', description: 'nav.link.p2p.description'},
].map((link, index) => {
    link.key = `nav-link-${index}-${link.href}-${link.label}`;

    return link;
}));

export const earnOption = (): object[] => ([
    { key: '', href: 'https://ieo.emirex.com/?emirex_referral_code=ID0A9FBA8B3E&utm_source=emirex&utm_medium=main_page&utm_campaign=header', label: 'nav.link.emrx-treasure' , description: 'nav.link.emrx-treasure.description', extLink: true, newTab: true},
    { key: '', href: '/ieo', label: 'nav.link.ieo', description: 'nav.link.ieo.description'},
    // { key: '', href: '/staking', label: 'nav.link.staking', description: 'nav.link.staking.description'},
    // { key: '', href: '/landing', label: 'nav.link.landing', description: 'nav.link.landing.description'},
    // { key: '', href: '/referral', label: 'nav.link.referral-giveaway', description: 'nav.link.referral-giveaway.description'},
    { key: '', href: '/referral-commission', label: 'nav.link.referral-program', description: 'nav.link.referral-program.description'},
    { key: '', href: '/', label: 'nav.link.defi-invest', description: 'nav.link.defi-invest.description', soon: true},
].map((link, index) => {
    link.key = `nav-link-${index}-${link.href}-${link.label}`;

    return link;
}));

export const ordersOption = (): object[] => ([
    { key: '', href: '/orders', label: 'page.header.orders_spot'},
    // { key: '', href: '/', label: 'page.header.orders_futures'},
    // { key: '', href: '/', label: 'page.header.orders_margin', border: true},
    { key: '', href: '/history/trades', label: 'page.header.history_spot', extLink: true},
    // { key: '', href: '/', label: 'page.header.history_futures'},
    // { key: '', href: '/', label: 'page.header.history_margin'},
].map((link, index) => {
    link.key = `nav-link-${index}-${link.href}-${link.label}`;

    return link;
}));

export const userOption = (): object[] => ([
    { key: '', href: '/profile', label: 'nav_account'},
    { key: '', href: '/kyc-levels', label: 'nav_verification', border: true},
    { key: '', href: '/wallets', label: 'nav_my_assets'},
    { key: '', href: '/orders', label: 'nav_my_orders'},
    // { key: '', href: '/bitcoin-halving', label: 'nav_bitcoin_halving', extLink: true, mainsite: true},
    // { key: '', href: '/security', label: 'nav_account_security'},
    { key: '', href: '/referral-commission', label: 'nav_my_referral'},
    // { key: '', href: '/api-setting', label: 'nav_api_setting', border: true},
    { key: '', href: '/', label: 'nav_logout', logout: true},
].map((link, index) => {
    link.key = `nav-link-${index}-${link.href}-${link.label}`;

    return link;
}));

export const pgRoutes = (isLoggedIn: boolean, isLight?: boolean): string[][] => {
    const routes = [
        ['page.header.navbar.trade', '/trading/', `trade${isLight ? 'Light' : ''}`],
        ['page.header.navbar.wallets', '/wallets', `wallets${isLight ? 'Light' : ''}`],
        ['page.header.navbar.openOrders', '/orders', `orders${isLight ? 'Light' : ''}`],
        ['page.header.navbar.history', '/history', `history${isLight ? 'Light' : ''}`],
    ];
    const routesUnloggedIn = [
        ['page.header.navbar.signIn', '/signin', `signin${isLight ? 'Light' : ''}`],
        ['page.header.signUp', '/signup', `signup${isLight ? 'Light' : ''}`],
        ['page.header.navbar.trade', '/trading/', `trade${isLight ? 'Light' : ''}`],
    ];

    return isLoggedIn ? routes : routesUnloggedIn;
};


export const DEFAULT_CCY_PRECISION = 4;
export const STORAGE_DEFAULT_LIMIT = 50;
export const DEFAULT_TRADING_VIEW_INTERVAL = '15';
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
