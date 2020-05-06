// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import {
    userData,
    userError, userReset,
} from '../actions';

const userOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* userSaga() {
    try {
        const loginMainSite = localStorage.getItem('uil');
        if (loginMainSite) {
            const user = yield call(API.get(userOptions), '/resource/users/me');
            const payload = {
                user: user,
            };
            yield put(userData(payload));
        } else {
            yield call(API.delete(userOptions), '/identity/sessions');
            yield put(userReset());
        }
    } catch (error) {
        yield put(userError(error));
    }
}
