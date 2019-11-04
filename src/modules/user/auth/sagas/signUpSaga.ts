// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../public/alert';
import { signUpError, SignUpFetch, signUpRequireVerification } from '../actions';

const signUpConfig: RequestOptions = {
    apiVersion: 'barong',
};

const baseUrl = window.document.location.origin;
//tslint:disable
export function* signUpSaga(action: SignUpFetch) {
    if (action.payload.refid) {
    }
    try {
        if (!action.payload.refid) {
            yield call(API.post(signUpConfig), '/identity/users', action.payload);
            yield put(signUpRequireVerification({ requireVerification: true }));
        } else {
            const existCode = yield fetch(`${baseUrl}/api/v2/referral-code?user_uid=IDBF19BD26D5&referral_code=IDBF19BD26D5`);
            console.log(existCode);
            if (existCode.ok) {
                yield call(API.post(signUpConfig), '/identity/users', action.payload);
                yield put(signUpRequireVerification({ requireVerification: true }));
            } else {
                yield put(alertPush({ message: ['Referral Code Invalid'], type: 'error' }));
            }
        }
    } catch (error) {
        yield put(signUpError(error));
        yield put(alertPush({ message: error.message, code: error.code, type: 'error' }));
    }
}
