// tslint:disable-next-line
import { /*call,*/ put } from 'redux-saga/effects';
//import { API, RequestOptions } from '../../../../api';
import {
    referralTicketsData,
    referralTicketsError,
    ReferralTicketsFetch,
} from '../actions';

const referalData = {
    'direct-ballance': {
        title: 'Direct',
        activeInactive: false,
        legend : [
            {
                count: 3,
                action: 'ballance 150 USD',
            },
            {
                count: 4,
                action: 'EMRX tokens worth 100 USD',
            },
        ],
    },
    'referral-ballance': {
        title: 'Referral',
        activeInactive: true,
        legend: [
            {
                count: 9,
                l1_referral: 'erfxxx@gmail.com',
                active: 'yes',
                l2_referrals: 7,
                l2_active: 7,
            },
            {
                count: 0,
                l1_referral: 'erfxxx@gmail.com',
                active: 'no',
                l2_referrals: 10,
                l2_active: 8,
            },
            {
                count: 5,
                l1_referral: 'erfxxx@gmail.com',
                active: 'yes',
                l2_referrals: 15,
                l2_active: 3,
            },
        ],
    },
    'bonus-ballance': {
        title: 'Bonus',
        activeInactive: false,
        legend: [
            {
                count: 1,
                subscription: 'Facebook subscription',
                subscription_url: 'https://facebook.com',
                network_post: 'Facebook post',
                network_post_url: 'https://facebook.com',
            },
            {
                count: 0,
                subscription: 'No subscription',
                subscription_url: null,
                network_post: 'Telegram post',
                network_post_url: 'https://telegram.com',
            },
            {
                count: 1,
                subscription: 'Twitter subscription',
                subscription_url: 'https://twitter.com',
                network_post: 'Twitter post',
                network_post_url: 'https://twitter.com',
            },
        ],
    },
};

/*const referralTicketsOptions: RequestOptions = {
    apiVersion: 'applogic',
};*/

export function* referralTicketsFetchSaga(action: ReferralTicketsFetch) {
    try {
        // const referrals = yield call(API.get(referralTicketsOptions), `/tickets`);

        const referrals = yield (data => {
                return {
                    directDetails: data['direct-ballance'],
                    referralDetails: data['referral-ballance'],
                    bonusDetails: data['bonus-ballance'],
                };
            })(referalData);
        yield put(referralTicketsData(referrals));
    } catch (error) {
        yield put(referralTicketsError(error));
    }
}
