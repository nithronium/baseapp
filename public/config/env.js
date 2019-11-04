window.env = {
    api: {
        authUrl: 'http://www.app.local/api/v2/barong',
        tradeUrl: 'http://localhost:9002/api/v2/peatio',
        applogicUrl: 'http://www.app.local/api/v2/applogic',
        rangerUrl: 'ws://localhost:9011/api/v2/ranger',
        tenkoUrl: 'http://localhost:9002/api/v2/tenko',
        nodelogicUrl: 'https://stage.emirex.com/api/v2/nodelogic',
    },
    minutesUntilAutoLogout: '5',
    withCredentials: false,
    captcha: {
        captchaType: 'none',
        siteKey: '',
        // captchaType: 'recaptcha',
        // siteKey: '6Le4gLQUAAAAAGRqFa2ErLeQwLR1XDdBOQF7dJ-z',
    },
    rangerReconnectPeriod: '1',
    msAlertDisplayTime: '5000',
    licenseKey: '',
};
