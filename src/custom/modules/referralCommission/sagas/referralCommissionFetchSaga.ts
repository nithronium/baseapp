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
        earned: 0,
        details: [
            {
                'Referral L1': 0,
            },
            {
                'Referral L2': 0,
            },
        ],
        legend : [
        ],
    },
    'ieo-commission': {
        title: 'IEO commission',
        earned: 0,
        details: [
            {
                'Referral L1': 0,
            },
            {
                'Referral L2': 0,
            },
        ],
        legend : [
        ],
    },
    summary: {
        title: 'Total commission',
        btc: 0,
        usd: 0,
        legend: [
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
