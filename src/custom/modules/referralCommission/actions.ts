import { CommonError } from '../../../modules/types';
import { REFERRAL_COMMISSION_BALANCES_DATA, REFERRAL_COMMISSION_BALANCES_FETCH, REFERRAL_COMMISSION_ERROR, REFERRAL_COMMISSION_REFERRALS_DATA, REFERRAL_COMMISSION_REFERRALS_FETCH } from './constants';

export interface ReferralCommissionBalancesFetch {
    type: typeof REFERRAL_COMMISSION_BALANCES_FETCH;
    payload: {
        currencyId: string;
    };
}

export interface ReferralCommissionReferralsFetch {
    type: typeof REFERRAL_COMMISSION_REFERRALS_FETCH;
    payload: {
        currencyId: string;
        type: string;
        skip: number;
        limit: number;
    };
}

export interface ReferralCommissionError {
    type: typeof REFERRAL_COMMISSION_ERROR;
    payload?: CommonError;
}

export interface ReferralCommissionBalancesPayload {
    commission: {
        trading: number[];
        ieo: number[];
    };
    earned: {
        trading: number;
        ieo: number;
    };
    loading: boolean;
}

export interface ReferralCommissionReferralsPayload {
    count: number;
    currencyId: string;
    type: string;
    skip: number;
    limit: number;
    referrals: [];
}

export interface ReferralCommissionBalancesData {
    type: typeof REFERRAL_COMMISSION_BALANCES_DATA;
    payload: ReferralCommissionBalancesPayload;
}

export interface ReferralCommissionReferralsData {
    type: typeof REFERRAL_COMMISSION_REFERRALS_DATA;
    payload: ReferralCommissionReferralsPayload;
}

export type ReferralCommissionActions = ReferralCommissionBalancesFetch | ReferralCommissionReferralsFetch | ReferralCommissionBalancesData | ReferralCommissionReferralsData | ReferralCommissionError;

export const referralCommissionBalancesFetch = (payload: ReferralCommissionBalancesFetch['payload']): ReferralCommissionBalancesFetch => ({
    type: REFERRAL_COMMISSION_BALANCES_FETCH,
    payload,
});

export const referralCommissionReferralsFetch = (payload: ReferralCommissionReferralsFetch['payload']): ReferralCommissionReferralsFetch => ({
    type: REFERRAL_COMMISSION_REFERRALS_FETCH,
    payload,
});

export const referralCommissionBalancesData = (payload: ReferralCommissionBalancesData['payload']): ReferralCommissionBalancesData => ({
    type: REFERRAL_COMMISSION_BALANCES_DATA,
    payload,
});

export const referralCommissionReferralsData = (payload: ReferralCommissionReferralsData['payload']): ReferralCommissionReferralsData => ({
    type: REFERRAL_COMMISSION_REFERRALS_DATA,
    payload,
});

export const referralCommissionError = (payload: ReferralCommissionError['payload']): ReferralCommissionError => ({
    type: REFERRAL_COMMISSION_ERROR,
    payload,
});
