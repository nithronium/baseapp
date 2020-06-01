
// tslint:disable-next-line
import { takeLatest } from 'redux-saga/effects';

import { CREATE_CREDIT_CARD_ORDER_FETCH } from '../constants';

import { createCreditCardOrderSaga } from './createCreditCardOrderSaga';

export function* rootCreditCardSaga() {
    yield takeLatest(CREATE_CREDIT_CARD_ORDER_FETCH, createCreditCardOrderSaga);
}
