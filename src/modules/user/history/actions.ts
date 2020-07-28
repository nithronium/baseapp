import {
    HISTORY_DATA,
    HISTORY_ERROR,
    HISTORY_FETCH,
    HISTORY_PUSH_EMIT,
    HISTORY_PUSH_FINISH,
    HISTORY_RESET,
    INSTEX_PAYMENT_DATA,
    INSTEX_PAYMENT_FETCH,
} from './constants';
import {PrivateTradeEvent, WalletHistoryElement, WalletHistoryList} from './types';

export interface HistoryFetchPayload {
    currency?: string;
    page?: number;
    type: string;
    limit?: number;
    market?: string;
    time_from?: string;
    time_to?: string;
}

export interface InstexPaymentPayload {
    tid: string;
}

interface HistorySuccessPayload {
    list: WalletHistoryList;
    page?: number;
    nextPageExists: boolean;
}

export interface HistoryFetch {
    type: typeof HISTORY_FETCH;
    payload: HistoryFetchPayload;
}

export interface HistoryData {
    type: typeof HISTORY_DATA;
    payload: HistorySuccessPayload;
}

export interface HistoryError {
    type: typeof HISTORY_ERROR;
    payload: WalletHistoryList;
}

export interface HistoryPushFinish {
    type: typeof HISTORY_PUSH_FINISH;
    payload: WalletHistoryList;
}

export interface HistoryReset {
    type: typeof HISTORY_RESET;
}

export interface HistoryPush {
    type: typeof HISTORY_PUSH_EMIT;
    payload: PrivateTradeEvent;
}

export interface InstexPaymentFetch {
    type: typeof INSTEX_PAYMENT_FETCH;
    payload: InstexPaymentPayload;
}

export interface InstexPaymentPush {
    type: typeof INSTEX_PAYMENT_DATA;
    payload: WalletHistoryElement;
}

export type HistoryActions =
    HistoryFetch
    | HistoryData
    | HistoryError
    | HistoryReset
    | HistoryPush
    | InstexPaymentPush
    | HistoryPushFinish;


export const fetchHistory = (payload: HistoryFetchPayload): HistoryFetch => ({
    type: HISTORY_FETCH,
    payload,
});

export const successHistory = (payload: HistorySuccessPayload): HistoryData => ({
    type: HISTORY_DATA,
    payload,
});

export const failHistory = (payload: WalletHistoryList): HistoryError => ({
    type: HISTORY_ERROR,
    payload,
});

export const resetHistory = (): HistoryReset => ({
    type: HISTORY_RESET,
});

export const pushHistoryEmit = (payload: PrivateTradeEvent): HistoryPush => ({
    type: HISTORY_PUSH_EMIT,
    payload,
});

export const pushHistoryFinish = (payload: WalletHistoryList): HistoryPushFinish => ({
    type: HISTORY_PUSH_FINISH,
    payload,
});

export const pushInstexPayment = (payload: WalletHistoryElement): InstexPaymentPush => ({
    type: INSTEX_PAYMENT_DATA,
    payload,
});

export const fetchInstexPayment = (payload: InstexPaymentPayload): InstexPaymentFetch => ({
    type: INSTEX_PAYMENT_FETCH,
    payload,
});
