import { ReferralCommissionActions } from './actions';
import { REFERRAL_COMMISSION_BALANCES_DATA, REFERRAL_COMMISSION_BALANCES_FETCH, REFERRAL_COMMISSION_ERROR, REFERRAL_COMMISSION_REFERRALS_DATA, REFERRAL_COMMISSION_REFERRALS_FETCH } from './constants';


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
    loading: boolean;
}

export interface ReferralCommissionState {
    currencyId: string;
    data: {
        trade: ReferralCommissionReferralsInterface;
        ieo: ReferralCommissionReferralsInterface;
        balances: ReferralCommissionBalancesInterface;
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
        balances: {
            commission: {
                trade: [0.5, 0.2],
                ieo : [0.1, 0.05],
            },
            earned: {
                trade: 0,
                ieo: 0,
            },
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
        default:
            return state;
    }
};
