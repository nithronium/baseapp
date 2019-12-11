// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import { KYC_AUTH_FETCH } from '../constants';
import { kycAuthSaga } from './kycAuthSaga';

export function* rootKycAuthSaga() {
    yield takeEvery(KYC_AUTH_FETCH, kycAuthSaga);
}
