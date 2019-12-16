// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { alertPush } from '../../../../../modules/public/alert';
import {
    DataStoragePush,
    dataStoragePushData,
    dataStoragePushError,
} from '../actions';

const dataStoragePushConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* dataStoragePushSaga(action: DataStoragePush) {
    try {
        yield call(API.post(dataStoragePushConfig), '/resource/data_storage', action.payload);
        yield put(dataStoragePushData());
        yield put(alertPush({ message: ['success.dataStorage.pushed'], type: 'success'}));
    } catch (error) {
        yield put(dataStoragePushError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
