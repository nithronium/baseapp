export interface Config {
    api: {
        authUrl: string;
        tradeUrl: string;
        applogicUrl: string;
        rangerUrl: string;
        nodelogicUrl: string;
        exchangeRatesUrl: string;
        arkeUrl: string;
        finexUrl: string;
    };
    minutesUntilAutoLogout?: string;
    rangerReconnectPeriod?: string;
    withCredentials: boolean;
    storage: {
        defaultStorageLimit?: number;
        orderBookSideLimit?: number;
    };
    gaTrackerKey?: string;
    msAlertDisplayTime?: string;
    incrementalOrderBook: boolean;
    // tslint:disable-next-line: no-any
    plugins: any[];
    finex: boolean;
    isResizable: boolean;
    isDraggable: boolean;
    languages: string[];
    sessionCheckInterval: string;
    balancesFetchInterval: string;
    showLanding: boolean;
    kycSteps?: string[];
}
