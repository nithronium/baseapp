// tslint:disable-next-line
import { takeLatest } from 'redux-saga/effects';
import { REFERRAL_COMMISSION_FETCH } from '../constants';
import { referralCommissionFetchSaga } from './referralCommissionFetchSaga';

export function* rootReferralCommissionSaga() {
    yield takeLatest(REFERRAL_COMMISSION_FETCH, referralCommissionFetchSaga);
}
