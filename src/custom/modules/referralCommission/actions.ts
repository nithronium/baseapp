import { CommonError } from '../../../modules/types';
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

export interface ReferralCommissionParticipantsFetch {
    type: typeof REFERRAL_COMMISSION_PARTICIPANTS_FETCH;
    payload: {

        currencyId: string;
        type: string;
        skip?: number;
        limit?: number;
    };
}

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
        skip?: number;
        limit?: number;
    };
}

export interface ReferralCommissionCurrencyChange {
    type: typeof REFERRAL_COMMISSION_CURRENCY_CHANGE;
    payload: {
        currencyId: string;
    };
}

export interface ReferralCommissionError {
    type: typeof REFERRAL_COMMISSION_ERROR;
    payload?: CommonError;
}
export interface ReferralCommissionParticipantsPayload {
    count: number;
    participants: [];
    skip: number;
    limit: number;
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
    traders: [];
    investors: [];
    participants: [];
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

export interface ReferralCommissionParticipantsData {
    type: typeof REFERRAL_COMMISSION_PARTICIPANTS_DATA;
    payload: ReferralCommissionParticipantsPayload;
}

export type ReferralCommissionActions = ReferralCommissionCurrencyChange | ReferralCommissionBalancesFetch | ReferralCommissionReferralsFetch | ReferralCommissionBalancesData | ReferralCommissionReferralsData | ReferralCommissionError | ReferralCommissionParticipantsFetch | ReferralCommissionParticipantsData;

export const referralCommissionCurrencyChange = (payload: ReferralCommissionCurrencyChange['payload']): ReferralCommissionCurrencyChange => ({
    type: REFERRAL_COMMISSION_CURRENCY_CHANGE,
    payload,
});

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

export const referralCommissionParticipantsFetch = (payload: ReferralCommissionParticipantsFetch['payload']): ReferralCommissionParticipantsFetch => ({
    type: REFERRAL_COMMISSION_PARTICIPANTS_FETCH,
    payload,
});


export const referralCommissionParticipantsData = (payload: ReferralCommissionParticipantsData['payload']): ReferralCommissionParticipantsData => ({
    type: REFERRAL_COMMISSION_PARTICIPANTS_DATA,
    payload,
});
