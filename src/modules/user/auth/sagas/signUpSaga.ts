// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, checkReferralCode, RequestOptions } from '../../../../api';
import { alertPush } from '../../../public/alert';
import { signUpError, SignUpFetch, signUpRequireVerification } from '../actions';
import { getParameters, removeParameters } from '../UTMparameters';

const signUpConfig: RequestOptions = {
    apiVersion: 'barong',
};
const UTMParamConfig: RequestOptions = {
    apiVersion: 'applogic',
};

//tslint:disable
export function* signUpSaga(action: SignUpFetch) {
    let checkCode = true;
    const data = getParameters();
    try {
        let query = action.payload;
        if (!action.payload.refid) {
            yield call(API.post(signUpConfig), '/identity/users', action.payload);
            yield put(signUpRequireVerification({ requireVerification: true }));
        } else {
            try {
                const resp = yield checkReferralCode({ referral_code: action.payload.refid });
                if (resp.status === 200) {
                    if (resp.data) {
                        checkCode = false;
                        const message = `refcode.${resp.data.errors[0]}`;
                        yield put(alertPush({ message: [message], type: 'error' }));
                    }                   
                }              
                
            } catch (error) {
                checkCode = false;
                yield put(alertPush({ message: ['server.internal_error'], type: 'error' }));
            }

            if (checkCode) {
                yield call(API.post(signUpConfig), '/identity/users', query);
                yield put(signUpRequireVerification({ requireVerification: true }));
            }
        }
        if (data) {
            yield call(API.post(UTMParamConfig), '/private/utm', data);
            removeParameters();
        }
    } catch (error) {
        yield put(signUpError(error));
        yield put(alertPush({ message: error.message, code: error.code, type: 'error' }));
    }
}
//   ID46E6FCAE18
