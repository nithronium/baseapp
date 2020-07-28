// tslint:disable-next-line
import {call, put} from 'redux-saga/effects';
import {API, RequestOptions} from '../../../../api';
import { InstexPaymentFetch, pushInstexPayment } from '../actions';

const config: RequestOptions = {
    apiVersion: 'instexService',
};

export function* instexFetchSaga(action: InstexPaymentFetch) {
    const order = yield call(API.get(config), `/private/payments/${action.payload.tid}`);

    yield put(pushInstexPayment(order));
}
