// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import {
    referralCommissionReferralsData,
    referralCommissionError,
    ReferralCommissionReferralsFetch,
} from '../actions';

const referralCommissionOptions: RequestOptions = {
    apiVersion: 'referralCommission',
};

export function* referralCommissionReferralsFetchSaga(action: ReferralCommissionReferralsFetch) {
    const {currencyId, type, skip, limit} = action.payload
    try {
        const referrals = yield call(API.get(referralCommissionOptions), `/private/referrals?currency_id=${currencyId}&type=${type}&skip=${skip}&limit=${limit}`);

        yield put(referralCommissionReferralsData(referrals));
    } catch (error) {
        yield put(referralCommissionError(error));
    }
}
