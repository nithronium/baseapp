import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import {
    customizationData,
    customizationError,
} from '../actions';

const customizationOptions: RequestOptions = {
    apiVersion: 'applogic',
};

export function* customizationFetchSaga() {
    try {
        const customization = yield call(API.get(customizationOptions), '/customization');
        yield put(customizationData(customization));
    } catch (error) {
        yield put(customizationError(error));
        yield put(sendError(error, 'alert'));
    }
}
