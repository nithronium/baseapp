import { CommonError } from '../../../modules/types';
import { REFERRAL_COMMISSION_DATA, REFERRAL_COMMISSION_ERROR, REFERRAL_COMMISSION_FETCH } from './constants';
import { ReferralCommissionSummaryInterface, ReferralCommissionTradingInterface } from './reducer';

export interface ReferralCommissionFetch {
    type: typeof REFERRAL_COMMISSION_FETCH;
}

export interface ReferralCommissionError {
    type: typeof REFERRAL_COMMISSION_ERROR;
    payload?: CommonError;
}

export interface ReferralCommissionPayload {
   ieo: ReferralCommissionTradingInterface;
   trading: ReferralCommissionTradingInterface;
   summary: ReferralCommissionSummaryInterface;
}

export interface ReferralCommissionData {
    type: typeof REFERRAL_COMMISSION_DATA;
    payload: ReferralCommissionPayload;
}

export type ReferralCommissionActions = ReferralCommissionFetch | ReferralCommissionData | ReferralCommissionError;

export const referralCommissionFetch = (): ReferralCommissionFetch => ({
    type: REFERRAL_COMMISSION_FETCH,
});

export const referralCommissionData = (payload: ReferralCommissionData['payload']): ReferralCommissionData => ({
    type: REFERRAL_COMMISSION_DATA,
    payload,
});

export const referralCommissionError = (payload: ReferralCommissionError['payload']): ReferralCommissionError => ({
    type: REFERRAL_COMMISSION_ERROR,
    payload,
});
