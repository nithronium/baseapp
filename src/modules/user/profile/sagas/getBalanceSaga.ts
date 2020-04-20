// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import {
    GetBalanceFetch,
    profileIdentityError,
    setBalance,
} from '../actions';

const userOptions: RequestOptions = {
    apiVersion: 'exchangeRates',
};

export function* getBalanceSaga(action: GetBalanceFetch) {
    try {
        const activeCurrency = localStorage.getItem('activeCurrency');
        const cryptoCurrency = localStorage.getItem('cryptoCurrency');
        if (activeCurrency !== action.payload[1]) {
            localStorage.setItem('activeCurrency', action.payload[1]);
        }
        if (cryptoCurrency !== action.payload[0]) {
            localStorage.setItem('cryptoCurrency', action.payload[0]);
        }
        const balance = yield call(API.get(userOptions), `/user/balance?symbol="${action.payload.join(',')}"`);
        localStorage.setItem('balance', JSON.stringify(balance.quote));
        yield put(setBalance(balance));
    } catch (error) {
        yield put(profileIdentityError(error));
    }
}
