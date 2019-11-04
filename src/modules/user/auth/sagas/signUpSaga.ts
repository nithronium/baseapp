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
    let checkCode = true;
    if (action.payload.refid) {
    }
    try {
        if (!action.payload.refid) {
            yield call(API.post(signUpConfig), '/identity/users', action.payload);
            yield put(signUpRequireVerification({ requireVerification: true }));
        } else {
            try {
                yield checkReferralCode({ referral_code: action.payload.refid });
            } catch (error) {
                checkCode = false;
                yield put(alertPush({ message: ['Referral Code Invalid'], type: 'error' }));
            }

            if (checkCode) {
                yield call(API.post(signUpConfig), '/identity/users', action.payload);
                yield put(signUpRequireVerification({ requireVerification: true }));
            }
        }
    } catch (error) {
        yield put(signUpError(error));
        yield put(alertPush({ message: error.message, code: error.code, type: 'error' }));
    }
}
//   ID46E6FCAE18
