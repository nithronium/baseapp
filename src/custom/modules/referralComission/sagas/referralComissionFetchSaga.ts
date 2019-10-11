// tslint:disable-next-line
import { /*call,*/ put } from 'redux-saga/effects';
//import { API, RequestOptions } from '../../../../api';
import {
    referralComissionData,
    referralComissionError,
    ReferralComissionFetch,
} from '../actions';

const comissionData = {
    'trading-comission': {
        title: 'Trading comission',
        earned: 2003909.8970953,
        details: [
            {
                'Referral L1': 50,
            },
            {
                'Referral L2': 20,
            },
        ],
        legend : [
            {
                mail: 'erfxxx.@gmail.com',
                l1_trades: 20,
                comission_l1: 1003909.8970953,
                comission_l2: 1003909.8970953,
                referrals: 12,
                trades: 16,
                total_amount: 2003909.8970953,
            },
            {
                mail: 'erfxxx.@gmail.com',
                l1_trades: 16,
                comission_l1: 1003909.8970953,
                comission_l2: 1003909.8970953,
                referrals: 12,
                trades: 16,
                total_amount: 2003909.8970953,
            },
            {
                mail: 'erfxxx.@gmail.com',
                l1_trades: 16,
                comission_l1: 1003909.8970953,
                comission_l2: 1003909.8970953,
                referrals: 12,
                trades: 16,
                total_amount: 2003909.8970953,
            },

        ],
    },
    'ieo-comission': {
        title: 'IEO comission',
        earned: 2003909.8970953,
        details: [
            {
                'Referral L1': 10,
            },
            {
                'Referral L2': 5,
            },
        ],
        legend : [
            {
                mail: 'erfxxx.@gmail.com',
                l1_trades: 16,
                comission_l1: 1003909.8970953,
                comission_l2: 1003909.8970953,
                referrals: 12,
                trades: 16,
                total_amount: 2003909.8970953,
            },
            {
                mail: 'erfxxx.@gmail.com',
                l1_trades: 16,
                comission_l1: 1003909.8970953,
                comission_l2: 1003909.8970953,
                referrals: 12,
                trades: 16,
                total_amount: 2003909.8970953,
            },
            {
                mail: 'erfxxx.@gmail.com',
                l1_trades: 16,
                comission_l1: 1003909.8970953,
                comission_l2: 1003909.8970953,
                referrals: 12,
                trades: 16,
                total_amount: 2003909.8970953,
            },

        ],
    },
    summary: {
        title: 'Total comission',
        btc: 4007819.794191,
        usd: 480.938375,
        legend: [
            {
                email: 'erfxxx@gmail.com',
                level: 'L1',
                type: 'Trade',
                ieo_name: '',
                earned: 1003909.8970953,
                date: '29.12.2019  22:00',
            },
            {
                email: 'erfxxx@gmail.com',
                level: 'L1',
                type: 'Trade',
                ieo_name: '',
                earned: 1003909.8970953,
                date: '29.12.2019  22:00',
            },
            {
                email: 'erfxxx@gmail.com',
                level: 'L1',
                type: 'Trade',
                ieo_name: '',
                earned: 1003909.8970953,
                date: '29.12.2019  22:00',
            },
        ],
    },
};

/*const referralComissionOptions: RequestOptions = {
    apiVersion: 'applogic',
};*/

export function* referralComissionFetchSaga(action: ReferralComissionFetch) {
    try {
        // const referrals = yield call(API.get(referralComissionOptions), `/tickets`);

        const referrals = yield (data => {
                return {
                    trading: data['trading-comission'],
                    ieo: data['ieo-comission'],
                    summary: data.summary,
                };
            })(comissionData);
        yield put(referralComissionData(referrals));
    } catch (error) {
        yield put(referralComissionError(error));
    }
}
