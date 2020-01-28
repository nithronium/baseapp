// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import {
    referralCommissionBalancesData,
    referralCommissionError,
    ReferralCommissionFetch,
} from '../actions';

const referralCommissionOptions: RequestOptions = {
    apiVersion: 'referralCommission',
};

export function* referralCommissionBalancesFetchSaga(action: ReferralCommissionFetch) {
    const {currencyId} = action.payload
    try {
        const referrals = yield call(API.get(referralCommissionOptions), `/private/balances?currency_id=${currencyId}`);

        yield put(referralCommissionBalancesData(referrals));
    } catch (error) {
        yield put(referralCommissionError(error));
    }
}
