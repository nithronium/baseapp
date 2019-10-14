// tslint:disable-next-line
import { /*call,*/ put } from 'redux-saga/effects';
//import { API, RequestOptions } from '../../../../api';
import {
    referralCommissionData,
    referralCommissionError,
    ReferralCommissionFetch,
} from '../actions';

const commissionData = {
    'trading-commission': {
        title: 'Trading commission',
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
                commission_l1: 1003909.8970953,
                commission_l2: 1003909.8970953,
                referrals: 12,
                trades: 16,
                total_amount: 2003909.8970953,
            },
            {
                mail: 'erfxxx.@gmail.com',
                l1_trades: 16,
                commission_l1: 1003909.8970953,
                commission_l2: 1003909.8970953,
                referrals: 12,
                trades: 16,
                total_amount: 2003909.8970953,
            },
            {
                mail: 'erfxxx.@gmail.com',
                l1_trades: 16,
                commission_l1: 1003909.8970953,
                commission_l2: 1003909.8970953,
                referrals: 12,
                trades: 16,
                total_amount: 2003909.8970953,
            },

        ],
    },
    'ieo-commission': {
        title: 'IEO commission',
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
                commission_l1: 1003909.8970953,
                commission_l2: 1003909.8970953,
                referrals: 12,
                trades: 16,
                total_amount: 2003909.8970953,
            },
            {
                mail: 'erfxxx.@gmail.com',
                l1_trades: 16,
                commission_l1: 1003909.8970953,
                commission_l2: 1003909.8970953,
                referrals: 12,
                trades: 16,
                total_amount: 2003909.8970953,
            },
            {
                mail: 'erfxxx.@gmail.com',
                l1_trades: 16,
                commission_l1: 1003909.8970953,
                commission_l2: 1003909.8970953,
                referrals: 12,
                trades: 16,
                total_amount: 2003909.8970953,
            },

        ],
    },
    summary: {
        title: 'Total commission',
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

/*const referralCommissionOptions: RequestOptions = {
    apiVersion: 'applogic',
};*/

export function* referralCommissionFetchSaga(action: ReferralCommissionFetch) {
    try {
        // const referrals = yield call(API.get(referralCommissionOptions), `/tickets`);

        const referrals = yield (data => {
                return {
                    trading: data['trading-commission'],
                    ieo: data['ieo-commission'],
                    summary: data.summary,
                };
            })(commissionData);
        yield put(referralCommissionData(referrals));
    } catch (error) {
        yield put(referralCommissionError(error));
    }
}
