import { FEES_DATA, FEES_ERROR, FEES_FETCH } from './constants';
import { Fees } from './types';

export interface FeesFetch {
    type: typeof FEES_FETCH;
}

export interface FeesData {
    type: typeof FEES_DATA;
    payload: Fees[];
}

export interface FeesError {
    type: typeof FEES_ERROR;
}

export type FeesAction = FeesFetch | FeesData | FeesError;

export const feessFetch = (): FeesFetch => ({
    type: FEES_FETCH,
});

export const feesData = (payload: FeesData['payload']): FeesData => ({
    type: FEES_DATA,
    payload,
});

export const feesError = (): FeesError => ({
    type: FEES_ERROR,
});
