window.env = {
    api: {
        authUrl: 'http://localhost:9002/api/v2/barong',
        tradeUrl: 'http://localhost:9002/api/v2/peatio',
        applogicUrl: 'http://localhost:9002/api/v2/applogic',
        exchangeRatesUrl: 'http://localhost:9002/api/v2/exchange-rates',
        rangerUrl: 'ws://localhost:9011/api/v2/ranger',
        nodelogicUrl: 'http://localhost:9002/api/v2/nodelogic',
        exchangeRatesUrl: 'http://localhost:9002/api/v2/exchange-rates',
        finexUrl: '',
    },
    minutesUntilAutoLogout: '60',
    withCredentials: false,
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
    finex: true,
    isResizable: false,
    isDraggable: false,
    languages: ['en', 'ru'],
};
