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
        usdBalance: 100, // баланс пользователя в USD
        emrxBalance: 150, // баланс пользователя в EMRX
        usdTickets: 2, // тикеты, полученные за пополнение баланса в USD
        emrxTickets: 3, // тикеты, полученные за покупку EMRX
      },
    referrals: [
        {
          tickets: 1, // кол-во тикетов, полученных за реферала
          email: 'string', // email реферала
          isActive: true, // статус реферала
          subreferrals: 2, // кол-во рефералов 2-го уровня
          activeSubreferrals: 1, // кол-во активных рефералов 2-го уровня
        },
        {
            tickets: 1, // кол-во тикетов, полученных за реферала
            email: 'string', // email реферала
            isActive: true, // статус реферала
            subreferrals: 2, // кол-во рефералов 2-го уровня
            activeSubreferrals: 1, // кол-во активных рефералов 2-го уровня
        },
        {
            tickets: 1, // кол-во тикетов, полученных за реферала
            email: 'string', // email реферала
            isActive: true, // статус реферала
            subreferrals: 2, // кол-во рефералов 2-го уровня
            activeSubreferrals: 1, // кол-во активных рефералов 2-го уровня
        },
      ],
    bonuses: [
        {
            tickets: 1,  // кол-во тикетов, полученных за бонус
            action: 'action', // тип бонуса (e. g. facebook post)
            link: 'link', // ссылка на пост
        },
        {
            tickets: 1,  // кол-во тикетов, полученных за бонус
            action: 'action', // тип бонуса (e. g. facebook post)
            link: 'link', // ссылка на пост
        },
        {
          tickets: 1,  // кол-во тикетов, полученных за бонус
          action: 'action', // тип бонуса (e. g. facebook post)
          link: 'link', // ссылка на пост
        },
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
