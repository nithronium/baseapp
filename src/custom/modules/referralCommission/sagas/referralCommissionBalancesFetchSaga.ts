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
    try {
        const balances = yield call(API.get(referralCommissionOptions), `/private/balances`);
        yield put(referralCommissionBalancesData(balances));
    } catch (error) {
        console.log('error', error);
        yield put(referralCommissionError(error));
    }
}
