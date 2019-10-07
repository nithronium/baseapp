// tslint:disable-next-line
import { /*call,*/ put } from 'redux-saga/effects';
//import { API, RequestOptions } from '../../../../api';
import {
    referralTicketsData,
    referralTicketsError,
    ReferralTicketsFetch,
} from '../actions';

/*const referralTicketsOptions: RequestOptions = {
    apiVersion: 'applogic',
};*/

export function* referralTicketsFetchSaga(action: ReferralTicketsFetch) {
    try {
        // const referrals = yield call(API.get(referralTicketsOptions), `/tickets`);

        const referrals = yield fetch('/json/ReferralTickets/referal.json')
            .then(async res => res.json())
            .then(data => {
                return {
                    directDetails: data['direct-ballance'],
                    referralDetails: data['referral-ballance'],
                    bonusDetails: data['bonus-ballance'],
                };
            });
        yield put(referralTicketsData(referrals));
    } catch (error) {
        yield put(referralTicketsError(error));
    }
}
