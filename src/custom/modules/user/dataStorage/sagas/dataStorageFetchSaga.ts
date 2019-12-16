// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { alertPush } from '../../../../../modules/public/alert';
import {
    dataStorageData,
    dataStorageError,
    DataStorageFetch,
} from '../actions';

const dataStorageConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* dataStorageFetchSaga(action: DataStorageFetch) {
    try {
        const payload = yield call(API.get(dataStorageConfig), `/admin/users/${action.payload.uid}`);
        yield put(dataStorageData(payload));
    } catch (error) {
        yield put(dataStorageError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
