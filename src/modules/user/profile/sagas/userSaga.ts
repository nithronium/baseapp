// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { getParameters, removeParameters } from '../../auth/UTMparameters';
import {
    userData,
    userError, userReset,
} from '../actions';


const userOptions: RequestOptions = {
    apiVersion: 'barong',
};

const UTMParamConfig: RequestOptions = {
    apiVersion: 'applogic',
};

export function* userSaga() {
    try {
        const data = getParameters();

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
            const user = yield call(API.get(userOptions), '/resource/users/me');
            const payload = {
                user: user,
            };
            yield put(userData(payload));
        }
        if (data) {
            yield call(API.post(UTMParamConfig), '/private/utm', data);
            removeParameters();
        }
    } catch (error) {
        yield put(userError(error));
    }
}
