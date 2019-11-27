// tslint:disable
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { referralTicketsData, referralTicketsError, ReferralTicketsFetch } from '../actions';


// const data = require('./data.json');

/*const referalData = {
    user: {
        ticketForRegistration: 1,
        usdBalance: 100, // баланс пользователя в USD
        emrxBalance: 50, // баланс пользователя в EMRX
        usdTickets: 2, // тикеты, полученные за пополнение баланса в USD
        emrxTickets: 2, // тикеты, полученные за покупку EMRX
      },
    referrals: [
      {
        tickets: 2, // кол-во тикетов, полученных за реферала
        email: 'ref1', // email реферала
        isActive: 0, // статус реферала, 0/1
        subreferrals: 7, // кол-во рефералов 2-го уровня
        activeSubreferrals: 5, // кол-во активных рефералов 2-го уровня
      },
      {
        tickets: 1, // кол-во тикетов, полученных за реферала
        email: 'ref2', // email реферала
        isActive: 0, // статус реферала, 0/1
        subreferrals: 6, // кол-во рефералов 2-го уровня
        activeSubreferrals: 4, // кол-во активных рефералов 2-го уровня
      },
      ],
    bonuses: [
      ],
};*/


const referralTicketsOptions: RequestOptions = {
    apiVersion: 'nodelogic',
};
//tslint:disable
export function* referralTicketsFetchSaga(action: ReferralTicketsFetch) {
  // const a = action.payload;
  // console.log(a);
    try {
        const referrals = yield call(API.get(referralTicketsOptions), action.payload);
        // let referrals = data;
        // console.log(data);
        //  const referrals = yield (data => {
        //          return data;
        //      })(data);
        yield put(referralTicketsData(referrals));
    } catch (error) {
        yield put(referralTicketsError(error));
    }
}
