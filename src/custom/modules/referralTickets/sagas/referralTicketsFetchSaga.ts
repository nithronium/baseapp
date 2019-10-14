// tslint:disable-next-line
import { /*call,*/ put } from 'redux-saga/effects';
//import { API, RequestOptions } from '../../../../api';
import {
    referralTicketsData,
    referralTicketsError,
    ReferralTicketsFetch,
} from '../actions';

const referalData = {
    user: {
        usdBalance: 0, // баланс пользователя в USD
        emrxBalance: 0, // баланс пользователя в EMRX
        usdTickets: 0, // тикеты, полученные за пополнение баланса в USD
        emrxTickets: 0, // тикеты, полученные за покупку EMRX
      },
    referrals: [
      ],
    bonuses: [
      ],
};

/*const referralTicketsOptions: RequestOptions = {
    apiVersion: 'applogic',
};*/

export function* referralTicketsFetchSaga(action: ReferralTicketsFetch) {
    try {
        // const referrals = yield call(API.get(referralTicketsOptions), `/tickets`);

        const referrals = yield (data => {
                return data;
            })(referalData);
        yield put(referralTicketsData(referrals));
    } catch (error) {
        yield put(referralTicketsError(error));
    }
}
