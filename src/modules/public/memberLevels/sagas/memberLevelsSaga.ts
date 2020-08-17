// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { memberLevelsData, memberLevelsError } from '../actions';

const requestOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* memberLevelsSaga() {
    try {
        const data = yield call(API.get(requestOptions), '/public/member-levels');
        yield put(memberLevelsData(data));
    } catch (error) {
        yield put(memberLevelsError());
        yield put(sendError(error, 'alert'));
    }
}
