import { CommonError } from '../../../../modules/types';
import {
    KYC_AUTH_DATA,
    KYC_AUTH_ERROR,
    KYC_AUTH_FETCH,
} from './constants';
import { KycAuthDataInterface } from './types';

export interface KycAuthFetch {
    type: typeof KYC_AUTH_FETCH;
}

export interface KycAuthData {
    type: typeof KYC_AUTH_DATA;
    payload: KycAuthDataInterface;
}

export interface KycAuthError {
    type: typeof KYC_AUTH_ERROR;
    payload: CommonError;
}

export type KycAuthAction =
    | KycAuthFetch
    | KycAuthData
    | KycAuthError;

export const kycAuthFetch = (): KycAuthFetch => ({
    type: KYC_AUTH_FETCH,
});

export const kycAuthData = (payload: KycAuthData['payload']): KycAuthData => ({
    type: KYC_AUTH_DATA,
    payload,
});

export const kycAuthError = (payload: KycAuthError['payload']): KycAuthError => ({
    type: KYC_AUTH_ERROR,
    payload,
});
