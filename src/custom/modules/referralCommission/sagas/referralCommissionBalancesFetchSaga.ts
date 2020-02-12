// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import {
    referralCommissionBalancesData,
    ReferralCommissionBalancesFetch,
    referralCommissionError,
} from '../actions';

const referralCommissionOptions: RequestOptions = {
    apiVersion: 'referralCommission',
};

export function* referralCommissionBalancesFetchSaga(action: ReferralCommissionBalancesFetch) {
    const {currencyId} = action.payload;
    try {
        const balances = yield call(API.get(referralCommissionOptions), `/private/balances?currency_id=${currencyId}`);
        yield put(referralCommissionBalancesData(balances));
    } catch (error) {
        yield put(referralCommissionError(error));
    }
}
