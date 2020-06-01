import { CommonError } from '../../../modules/types';
import {
    CREATE_CREDIT_CARD_ORDER_DATA,
    CREATE_CREDIT_CARD_ORDER_ERROR,
    CREATE_CREDIT_CARD_ORDER_FETCH,
} from './constants';

export interface CreateCardOrderRequest {
    outcomeCurrencyId: string;
    incomeCurrencyId: string;
    type: string;
    amount: number;
}

export interface CreateCardOrderResponse {
    url?: string;
}

export interface CreditCardOrderError {
    type: typeof CREATE_CREDIT_CARD_ORDER_ERROR;
    payload: CommonError;
}

export interface CreditCardOrderFetch {
    type: typeof CREATE_CREDIT_CARD_ORDER_FETCH;
    payload: CreateCardOrderRequest;
}

export interface CreditCardOrderData {
    type: typeof CREATE_CREDIT_CARD_ORDER_DATA;
    payload: {};
}

export type CreditCardActions =
    CreditCardOrderError |
    CreditCardOrderFetch |
    CreditCardOrderData;

export const creditCardOrderError = (payload: CommonError): CreditCardOrderError => ({
    type: CREATE_CREDIT_CARD_ORDER_ERROR,
    payload,
});

export const creditCardOrderFetch = (payload: CreateCardOrderRequest): CreditCardOrderFetch => ({
    type: CREATE_CREDIT_CARD_ORDER_FETCH,
    payload,
});


export const creditCardOrderData = (payload: {}): CreditCardOrderData => ({
    type: CREATE_CREDIT_CARD_ORDER_DATA,
    payload,
});

