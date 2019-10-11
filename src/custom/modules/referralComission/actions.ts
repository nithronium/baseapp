import { CommonError } from '../../../modules/types';
import { REFERRAL_COMISSION_DATA, REFERRAL_COMISSION_ERROR, REFERRAL_COMISSION_FETCH } from './constants';
import { ReferralComissionSummaryInterface, ReferralComissionTradingInterface } from './reducer';

export interface ReferralComissionFetch {
    type: typeof REFERRAL_COMISSION_FETCH;
}

export interface ReferralComissionError {
    type: typeof REFERRAL_COMISSION_ERROR;
    payload?: CommonError;
}

export interface ReferralComissionPayload {
   ieo: ReferralComissionTradingInterface;
   trading: ReferralComissionTradingInterface;
   summary: ReferralComissionSummaryInterface;
}

export interface ReferralComissionData {
    type: typeof REFERRAL_COMISSION_DATA;
    payload: ReferralComissionPayload;
}

export type ReferralComissionActions = ReferralComissionFetch | ReferralComissionData | ReferralComissionError;

export const referralComissionFetch = (): ReferralComissionFetch => ({
    type: REFERRAL_COMISSION_FETCH,
});

export const referralComissionData = (payload: ReferralComissionData['payload']): ReferralComissionData => ({
    type: REFERRAL_COMISSION_DATA,
    payload,
});

export const referralComissionError = (payload: ReferralComissionError['payload']): ReferralComissionError => ({
    type: REFERRAL_COMISSION_ERROR,
    payload,
});
