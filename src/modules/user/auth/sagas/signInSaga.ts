// tslint:disable-next-line no-submodule-imports
import { call, put } from 'redux-saga/effects';

// import qs = require('qs');

// import { buildPath } from '../../../../custom/helpers';

import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../public/alert';
import { userData } from '../../profile';
import { signInError, SignInFetch, signInRequire2FA, signUpRequireVerification } from '../actions';


// const getCurrentLang = () => {
//     const path = location.pathname;
//     const langs = ['ru', 'zh', 'tr'];
//     for (const lang of langs) {
//         if (path.includes(`/${lang}`)) {
//             return lang;
//         }
//     }
//     return 'en';
// };

const sessionsConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* signInSaga(action: SignInFetch) {
    try {
        const user = yield call(API.post(sessionsConfig), '/identity/sessions', action.payload);
        yield put(userData({ user }));


        // let url = '/profile';
        // const parsed = qs.parse(location.search, { ignoreQueryPrefix: true });
        // if (parsed.redirect_url) {
        //     url = parsed.redirect_url;
        // }
        // console.log('signin', url, location.href);
        // const currentLanguage = getCurrentLang();
        // location.pathname = buildPath(url, currentLanguage);
        yield put(signUpRequireVerification({ requireVerification: user.state === 'pending' }));
        yield put(signInRequire2FA({ require2fa: user.otp }));
    } catch (error) {
        switch (error.code) {
            case 401:
                if (error.message.indexOf('identity.session.not_active') > -1) {
                    yield put(signUpRequireVerification({requireVerification: true}));
                }
                yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
                break;
            case 403:
                if (error.message.indexOf('identity.session.invalid_otp') > -1) {
                    yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
                }
                yield put(signInRequire2FA({ require2fa: true }));
                break;
            default:
                yield put(signInError(error));
                yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
        }
    }
}
