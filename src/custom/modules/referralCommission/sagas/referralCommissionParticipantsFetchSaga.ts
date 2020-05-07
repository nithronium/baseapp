// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import {
    referralCommissionError,
    referralCommissionParticipantsData,
    ReferralCommissionParticipantsFetch,
} from '../actions';

const referralCommissionOptions: RequestOptions = {
    apiVersion: 'referralCommission',
};

export function* referralCommissionParticipantsFetchSaga(action: ReferralCommissionParticipantsFetch) {
    const {skip, limit} = action.payload;
    let queryString = `/private/participants`;
    if (skip !== undefined) {queryString = `${queryString}?skip=${skip}`;}
    if (!!limit) {queryString = `${queryString}&limit=${limit}`;}
    try {
        const referrals = yield call(API.get(referralCommissionOptions), queryString);
        yield put(referralCommissionParticipantsData(referrals));
    } catch (error) {
        yield put(referralCommissionError(error));
    }
}
