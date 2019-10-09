// tslint:disable-next-line
import { takeLatest } from 'redux-saga/effects';
import { REFERRAL_COMISSION_FETCH } from '../constants';
import { referralComissionFetchSaga } from './referralComissionFetchSaga';

export function* rootReferralComissionSaga() {
    yield takeLatest(REFERRAL_COMISSION_FETCH, referralComissionFetchSaga);
}
