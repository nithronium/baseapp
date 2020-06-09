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
    try {
        const utm_source = localStorage.getItem('utm_source');
        const utm_medium = localStorage.getItem('utm_medium');
        const utm_campaign = localStorage.getItem('utm_campaign');
        const utm_content = localStorage.getItem('utm_content');
        const utm_term = localStorage.getItem('utm_term');
        let query = action.payload;
        const data = {};
        if (utm_source) { data['utm_source'] = utm_source }
        if (utm_medium) { data['utm_medium'] = utm_medium }
        if (utm_campaign) { data['utm_campaign'] = utm_campaign }
        if (utm_content) { data['utm_content'] = utm_content }
        if (utm_term) { data['utm_term'] = utm_term }
        if (Object.keys(data).length > 0) { query = {...query, data: JSON.stringify(data)} }
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
                localStorage.removeItem('referralCode');
            }
        }
        localStorage.removeItem('utm_source');
        localStorage.removeItem('utm_medium');
        localStorage.removeItem('utm_campaign');
        localStorage.removeItem('utm_content');
        localStorage.removeItem('utm_term');
        localStorage.removeItem('referralCode');
    } catch (error) {
        yield put(signUpError(error));
        yield put(alertPush({ message: error.message, code: error.code, type: 'error' }));
    }
}
//   ID46E6FCAE18
