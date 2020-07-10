// tslint:disable-next-line no-submodule-imports
import { call, put } from 'redux-saga/effects';


import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../public/alert';
import { changeLanguage } from '../../../public/i18n';
import { userData } from '../../profile';
import { signInError, SignInFetch, signInRequire2FA, signUpRequireVerification } from '../actions';
import { getParameters, removeParameters } from '../UTMparameters';

const sessionsConfig: RequestOptions = {
    apiVersion: 'barong',
};

const UTMParamConfig: RequestOptions = {
    apiVersion: 'applogic',
};

export function* signInSaga(action: SignInFetch) {
    try {
        const data = getParameters();

        const user = yield call(API.post(sessionsConfig), '/identity/sessions', action.payload);
        if (user.data && JSON.parse(user.data).language) {
            yield put(changeLanguage(JSON.parse(user.data).language));
        }
        yield put(userData({ user }));
        localStorage.setItem('csrfToken', user.csrf_token);
        yield put(signUpRequireVerification({ requireVerification: user.state === 'pending' }));
        yield put(signInRequire2FA({ require2fa: user.otp }));
        if (data) {
            yield call(API.post(UTMParamConfig), '/private/utm', data);
            removeParameters();
        }
    } catch (error) {
        switch (error.code) {
            case 401:
                if (error.message.indexOf('identity.session.missing_otp') > -1) {
                    yield put(signInRequire2FA({ require2fa: true }));
                } else {
                    yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
                }
                break;
            default:
                yield put(signInError(error));
                yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
        }
    }
}
