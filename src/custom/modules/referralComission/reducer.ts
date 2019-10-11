import { ReferralComissionActions } from './actions';
import { REFERRAL_COMISSION_DATA, REFERRAL_COMISSION_ERROR, REFERRAL_COMISSION_FETCH } from './constants';


export interface ReferralComissionTradingInterface {
    details: [];
    legend: [];
    earned: number;
    title: string;
}

export interface ReferralComissionSummaryInterface {
    title: string;
    legend: [];
    btc: number;
    usd: number;
}

export interface ReferralComissionState {
    loading: boolean;
    data: {
        trading: ReferralComissionTradingInterface;
        ieo: ReferralComissionTradingInterface;
        summary: ReferralComissionSummaryInterface;
    };
}

const initialState: ReferralComissionState = {
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

export const referralComissionReducer = (state = initialState, action: ReferralComissionActions) => {
    switch (action.type) {
        case REFERRAL_COMISSION_DATA:
            return {
                ...state,
                loading: false,
                data: action.payload,
            };
        case REFERRAL_COMISSION_ERROR:
            return {
                ...state,
                loading: false,
            };
        case REFERRAL_COMISSION_FETCH:
            return {
                ...state,
                loading: true,
            };
        default:
            return state;
    }
};
