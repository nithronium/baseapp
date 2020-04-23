export interface Config {
    api: {
        authUrl: string;
        tradeUrl: string;
        applogicUrl: string;
        rangerUrl: string;
        tenkoUrl: string;
        nodelogicUrl: string;
        exchangeRatesUrl: string;
    };
    minutesUntilAutoLogout?: string;
    rangerReconnectPeriod?: string;
    withCredentials: boolean;
    storage: {
        defaultStorageLimit?: number;
    };
    captcha: {
        captchaType: 'recaptcha' | 'geetest' | 'none';
        siteKey: string;
    };
    msAlertDisplayTime?: string;
    licenseKey?: string;
    incrementalOrderBook: boolean;
    // tslint:disable-next-line: no-any
    plugins: any[];
}
