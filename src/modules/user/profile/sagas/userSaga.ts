// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import {signInRequire2FA} from '../../auth';
import {resetHistory} from '../../history';
import {userOpenOrdersReset} from '../../openOrders';
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
            yield put(userOpenOrdersReset());
            yield put(signInRequire2FA({ require2fa: false }));
            yield put(resetHistory());
        }
    } catch (error) {
        yield put(userError(error));
    }
}
