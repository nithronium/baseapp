// tslint:disable-next-line
import { call, put, takeLatest } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../../modules/public/alert';
import { feesData, feesError } from '../actions';
import { FEES_FETCH } from '../constants';

const feesOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* rootFeesSaga() {
    yield takeLatest(FEES_FETCH, feesFetchSaga);
}

export function* feesFetchSaga() {
    try {
        const fees = yield call(API.get(feesOptions), '/public/trading_fees');
        yield put(feesData(fees));
    } catch (error) {
        yield put(feesError());
        yield put(alertPush({ message: error.message, code: error.code, type: 'error' }));
    }
}
