window.env = {
    api: {
        authUrl: 'http://localhost:9002/api/v2/barong',
        tradeUrl: 'http://localhost:9002/api/v2/peatio',
        applogicUrl: 'http://localhost:9002/api/v2/applogic',
        exchangeRatesUrl: 'http://localhost:9002/api/v2/exchange-rates',
        rangerUrl: 'ws://localhost:9011/api/v2/ranger',
        nodelogicUrl: 'http://localhost:9002/api/v2/nodelogic',
        exchangeRatesUrl: 'http://localhost:9002/api/v2/exchange-rates',
    },
    minutesUntilAutoLogout: '60',
    withCredentials: false,
    captcha: {
        captchaType: 'none',
        siteKey: '',
        // captchaType: 'geetest',
        // siteKey: '6Le4gLQUAAAAAGRqFa2ErLeQwLR1XDdBOQF7dJ-z',

        // captchaType: 'recaptcha',
        // siteKey: '6Le4gLQUAAAAAGRqFa2ErLeQwLR1XDdBOQF7dJ-z',
    },
    gaTrackerKey: '',
    rangerReconnectPeriod: '1',
    msAlertDisplayTime: '5000',
    incrementalOrderBook: true,
    plugins: [
        {
            name: 'ieo',
            config: {
                types: ['proportional', 'fcfs'],
                metadata: true,
            },
        },
    ],
    isResizable: false,
    isDraggable: false,
};
