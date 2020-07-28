// tslint:disable-next-line
import { takeLatest } from 'redux-saga/effects';
import { HISTORY_FETCH, HISTORY_PUSH_EMIT, INSTEX_PAYMENT_FETCH } from '../constants';
import { historyPushSaga } from './historyPushSaga';
import { historySaga } from './historySaga';
import { instexFetchSaga } from './instexFetchSaga';

export function* rootHistorySaga() {
    yield takeLatest(HISTORY_PUSH_EMIT, historyPushSaga);
    yield takeLatest(HISTORY_FETCH, historySaga);
    yield takeLatest(INSTEX_PAYMENT_FETCH, instexFetchSaga);
}
