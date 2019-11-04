// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, checkReferralCode, RequestOptions } from '../../../../api';
import { alertPush } from '../../../public/alert';
import { signUpError, SignUpFetch, signUpRequireVerification } from '../actions';

const signUpConfig: RequestOptions = {
    apiVersion: 'barong',
};

//tslint:disable
export function* signUpSaga(action: SignUpFetch) {
    if (action.payload.refid) {
    }
    try {
        if (!action.payload.refid) {
            yield call(API.post(signUpConfig), '/identity/users', action.payload);
            yield put(signUpRequireVerification({ requireVerification: true }));
        } else {
            const existCode = yield checkReferralCode({ referral_code: action.payload.refid });
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
