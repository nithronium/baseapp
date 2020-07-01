// tslint:disable-next-line
import { takeEvery } from 'redux-saga/effects';
import {DATA_STORAGE_FETCH, DATA_STORAGE_GET_DATA, DATA_STORAGE_PUSH} from '../constants';
import { dataStorageFetchSaga } from './dataStorageFetchSaga';
import { dataStorageGetSaga } from './dataStorageGetSaga';
import { dataStoragePushSaga } from './dataStoragePushSaga';

export function* rootDataStorageSaga() {
    yield takeEvery(DATA_STORAGE_FETCH, dataStorageFetchSaga);
    yield takeEvery(DATA_STORAGE_GET_DATA, dataStorageGetSaga);
    yield takeEvery(DATA_STORAGE_PUSH, dataStoragePushSaga);
}
