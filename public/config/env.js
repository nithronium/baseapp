window.env = {
    api: {
        authUrl: 'http://0.0.0.0:9002/api/v2/barong',
        tradeUrl: 'http://0.0.0.0:9002/api/v2/peatio',
        applogicUrl: 'http://0.0.0.0:9002/api/v2/applogic',
        rangerUrl: 'ws://0.0.0.0:9011/api/v2/ranger',
        tenkoUrl: 'http://www.app.local/api/v2/tenko',
        nodelogicUrl: 'https://www.app.local/api/v2/nodelogic',
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
    rangerReconnectPeriod: '1',
    msAlertDisplayTime: '5000',
    licenseKey: '',
    incrementalOrderBook: true,
    plugins: [
        { name: 'ieo', config: { types: [ 'proportional', 'fcfs' ], metadata: true } },
    ],
};
