// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import { DATA_STORAGE_FETCH, DATA_STORAGE_PUSH } from '../constants';
import { dataStorageFetchSaga } from './dataStorageFetchSaga';
import { dataStoragePushSaga } from './dataStoragePushSaga';

export function* rootDataStorageSaga() {
    yield takeEvery(DATA_STORAGE_FETCH, dataStorageFetchSaga);
    yield takeEvery(DATA_STORAGE_PUSH, dataStoragePushSaga);
}
