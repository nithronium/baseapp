import { CommonError } from '../../../modules/types';
import { REFERRAL_COMISSION_DATA, REFERRAL_COMISSION_ERROR, REFERRAL_COMISSION_FETCH } from './constants';

export interface ReferralComissionFetch {
    type: typeof REFERRAL_COMISSION_FETCH;
}

export interface ReferralComissionError {
    type: typeof REFERRAL_COMISSION_ERROR;
    payload?: CommonError;
}

export interface ReferralComissionPayload {
   // TODO: fix
   legend: string;
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
