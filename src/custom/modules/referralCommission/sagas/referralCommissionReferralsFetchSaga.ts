// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import {
    referralCommissionError,
    referralCommissionReferralsData,
    ReferralCommissionReferralsFetch,
} from '../actions';

const referralCommissionOptions: RequestOptions = {
    apiVersion: 'referralCommission',
};

export function* referralCommissionReferralsFetchSaga(action: ReferralCommissionReferralsFetch) {
    const {currencyId, type, skip, limit} = action.payload;
    let queryString = `/private/referrals?currency_id=${currencyId}&type=${type}`;
    if (!!skip) {queryString = `${queryString}&skip=${skip}`;}
    if (!!limit) {queryString = `${queryString}&limit=${limit}`;}
    try {
        const referrals = yield call(API.get(referralCommissionOptions), queryString);
        yield put(referralCommissionReferralsData(referrals));
    } catch (error) {
        yield put(referralCommissionError(error));
    }
}
