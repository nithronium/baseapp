import { ReferralCommissionActions } from './actions';
import { REFERRAL_COMMISSION_DATA, REFERRAL_COMMISSION_ERROR, REFERRAL_COMMISSION_FETCH } from './constants';


export interface ReferralCommissionTradingInterface {
    details: [];
    legend: [];
    earned: number;
    title: string;
}

export interface ReferralCommissionSummaryInterface {
    title: string;
    legend: [];
    btc: number;
    usd: number;
}

export interface ReferralCommissionState {
    loading: boolean;
    data: {
        trading: ReferralCommissionTradingInterface;
        ieo: ReferralCommissionTradingInterface;
        summary: ReferralCommissionSummaryInterface;
    };
}

const initialState: ReferralCommissionState = {
    loading: false,
    data: {
        trading: {
            details: [],
            legend: [],
            earned: 0,
            title: '',
        },
        ieo: {
            details: [],
            legend: [],
            earned: 0,
            title: '',
        },
        summary: {
            title: '',
            legend: [],
            btc: 0,
            usd: 0,
        },
    },
};

export const referralCommissionReducer = (state = initialState, action: ReferralCommissionActions) => {
    switch (action.type) {
        case REFERRAL_COMMISSION_DATA:
            return {
                ...state,
                loading: false,
                data: action.payload,
            };
        case REFERRAL_COMMISSION_ERROR:
            return {
                ...state,
                loading: false,
            };
        case REFERRAL_COMMISSION_FETCH:
            return {
                ...state,
                loading: true,
            };
        default:
            return state;
    }
};
