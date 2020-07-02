// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { alertPush } from '../../../../../modules/public/alert';
import {
    dataStorageError,
    DataStorageGetData,
    dataStorageSetAlready,
} from '../actions';

const dataStorageConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* dataStorageGetSaga(action: DataStorageGetData) {
    try {
        const payload = yield call(API.get(dataStorageConfig), `/resource/profiles/me `);
        if (payload.data_storages.length) {
            yield put(alertPush({ message: ['success.questionnaire.under'], type: 'success'}));
            yield put(dataStorageSetAlready('true'));
        } else {
            yield put(dataStorageSetAlready('false'));
        }
    } catch (error) {
        yield put(dataStorageError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
