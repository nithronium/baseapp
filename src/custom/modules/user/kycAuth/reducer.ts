import { CommonError } from '../../../../modules/types';
import { KycAuthAction } from './actions';
import {
    KYC_AUTH_DATA,
    KYC_AUTH_ERROR,
    KYC_AUTH_FETCH,
} from './constants';
import { KycAuthDataInterface } from './types';

export interface KycAuthState {
    success: boolean;
    loading: boolean;
    data?: KycAuthDataInterface;
    error?: CommonError;
}

export const initialKycAuthState: KycAuthState = {
    success: false,
    loading: false,
};

export const kycAuthReducer = (state = initialKycAuthState, action: KycAuthAction) => {
    switch (action.type) {
        case KYC_AUTH_FETCH:
            return {
                ...state,
                loading: true,
                success: false,
            };
        case KYC_AUTH_DATA:
            return {
                ...state,
                data: action.payload,
                loading: false,
                success: true,
            };
        case KYC_AUTH_ERROR:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.payload,
            };
        default:
            return state;
    }
};
