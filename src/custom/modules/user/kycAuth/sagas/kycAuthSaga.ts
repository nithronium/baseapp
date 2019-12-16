// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { alertPush } from '../../../../../modules/public/alert';
import { kycAuthData, kycAuthError, KycAuthFetch } from '../actions';

const kycAuthConfig: RequestOptions = {
    apiVersion: 'applogic',
    withHeaders: false,
};

export function* kycAuthSaga(action: KycAuthFetch) {
    try {
        const payload = yield call(API.get(kycAuthConfig), '/private/kyc/auth');
        yield put(kycAuthData(payload));
    } catch (error) {
        yield put(kycAuthError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
