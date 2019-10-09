// tslint:disable-next-line
import { /*call,*/ put } from 'redux-saga/effects';
//import { API, RequestOptions } from '../../../../api';
import {
    referralComissionData,
    referralComissionError,
    ReferralComissionFetch,
} from '../actions';

/*const referralComissionOptions: RequestOptions = {
    apiVersion: 'applogic',
};*/

export function* referralComissionFetchSaga(action: ReferralComissionFetch) {
    try {
        // const referrals = yield call(API.get(referralComissionOptions), `/tickets`);

        const referrals = yield fetch('/json/ReferralComission/transition.json')
            .then(async res => res.json())
            .then(data => {
                return {
                    directDetails: data['direct-ballance'],
                    referralDetails: data['referral-ballance'],
                    bonusDetails: data['bonus-ballance'],
                };
            });
        yield put(referralComissionData(referrals));
    } catch (error) {
        yield put(referralComissionError(error));
    }
}
