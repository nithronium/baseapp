// tslint:disable-next-line
import { takeLatest } from 'redux-saga/effects';
import { REFERRAL_TICKETS_FETCH } from '../constants';
import { referralTicketsFetchSaga } from './referralTicketsFetchSaga';

export function* rootReferralTicketsSaga() {
    yield takeLatest(REFERRAL_TICKETS_FETCH, referralTicketsFetchSaga);
}
