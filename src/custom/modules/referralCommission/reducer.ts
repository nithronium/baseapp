import { ReferralCommissionActions } from './actions';
import {
    REFERRAL_COMMISSION_BALANCES_DATA,
    REFERRAL_COMMISSION_BALANCES_FETCH,
    REFERRAL_COMMISSION_CURRENCY_CHANGE,
    REFERRAL_COMMISSION_ERROR,
    REFERRAL_COMMISSION_PARTICIPANTS_DATA,
    REFERRAL_COMMISSION_PARTICIPANTS_FETCH,
    REFERRAL_COMMISSION_REFERRALS_DATA,
    REFERRAL_COMMISSION_REFERRALS_FETCH,
} from './constants';


export interface ReferralCommissionReferralsInterface {
    referrals: [];
    type: string;
    skip: number;
    limit: number;
    count: number;
    loading: boolean;
}

export interface ReferralCommissionBalancesInterface {
    commission: object;
    earned: object;
    investors: object;
    participants: object;
    loading: boolean;
    traders: object;
}

export interface ReferralCommissionParticipantsInterface {
    count: number;
    skip: number;
    limit: number;
    participants: [];
}

export interface ReferralCommissionState {
    currencyId: string;
    data: {
        trade: ReferralCommissionReferralsInterface;
        ieo: ReferralCommissionReferralsInterface;
        balances: ReferralCommissionBalancesInterface;
        participants: ReferralCommissionParticipantsInterface;
    };
}

const initialState: ReferralCommissionState = {
    currencyId: 'btc',
    data: {
        trade: {
            referrals: [],
            type: 'trade',
            skip: 0,
            limit: 10,
            count: 0,
            loading: true,
        },
        ieo: {
            referrals: [],
            type: 'ieo',
            skip: 0,
            limit: 10,
            count: 0,
            loading: true,
        },
        participants: {
            count: 0,
            limit: 10,
            skip: 0,
            participants: [],
        },
        balances: {
            commission: {
                trade: [],
                ieo : [],
            },
            earned: {
                trade: 0,
                ieo: 0,
            },
            participants: [],
            investors: [],
            traders: [],
            loading: true,
        },
    },
};


// TODO match response
export const referralCommissionReducer = (state = initialState, action: ReferralCommissionActions) => {
    switch (action.type) {
        case REFERRAL_COMMISSION_BALANCES_DATA: {
            const newState = {
                ...state,
            };
            newState.data.balances = {
                ...action.payload,
                loading: false,
            };

            return newState;
        }
        case REFERRAL_COMMISSION_REFERRALS_DATA: {
            const newState = {
                ...state,
            };
            newState.data[action.payload.type] = {
                ...action.payload,
                loading: false,
            };

            return newState;
        }
        case REFERRAL_COMMISSION_ERROR:
            return {
                ...state,
                loading: false,
            };
        case REFERRAL_COMMISSION_BALANCES_FETCH:
            return {
                ...state,
                loading: true,
            };
        case REFERRAL_COMMISSION_REFERRALS_FETCH:
            return {
                ...state,
                loading: true,
            };
        case REFERRAL_COMMISSION_CURRENCY_CHANGE:
            return {
                ...state,
                ...action.payload,
            };
        case REFERRAL_COMMISSION_PARTICIPANTS_DATA:
            const tmpState = {
                ...state,
                loading: false,
            };
            tmpState.data.participants = {
                ...action.payload,
            };

            return tmpState;
        case REFERRAL_COMMISSION_PARTICIPANTS_FETCH:
            return {
                ...state,
                loading: true,
            };
        default:
            return state;
    }
};
