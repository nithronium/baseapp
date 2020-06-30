import axios, { AxiosResponse } from 'axios';
import { JsonBody, makeRequest, RequestOptions } from './requestBuilder';
// import { currenciesData } from '../modules';

// import { nodelogicUrl } from './config';

export * from './types';
export * from './config';
export { RequestOptions } from './requestBuilder';

export type RequestBody = JsonBody | FormData;

export type RequestMethod = (config: RequestOptions) => (url: string, body?: RequestBody) => Promise<AxiosResponse['data']>;

export interface ApiWrapper {
    get: RequestMethod;
    post: RequestMethod;
    patch: RequestMethod;
    put: RequestMethod;
    delete: RequestMethod;
}

export const API: ApiWrapper = {
    get: (config: RequestOptions) => async (url: string) =>
        makeRequest(
            {
                method: 'get',
                url,
            },
            config,
        ),

    post: (config: RequestOptions) => async (url: string, body?: JsonBody) =>
        makeRequest(
            {
                method: 'post',
                body,
                url,
            },
            config,
        ),

    patch: (config: RequestOptions) => async (url: string, body?: JsonBody) =>
        makeRequest(
            {
                method: 'patch',
                body,
                url,
            },
            config,
        ),

    put: (config: RequestOptions) => async (url: string, body?: JsonBody) =>
        makeRequest(
            {
                method: 'put',
                body,
                url,
            },
            config,
        ),

    delete: (config: RequestOptions) => async (url: string) =>
        makeRequest(
            {
                method: 'delete',
                url,
            },
            config,
        ),
};

const conf: RequestOptions = {
    apiVersion: 'barong',
};
export const changePassword = async body => API.post(conf)('/identity/users/password/confirm_code', body);


const baseURL = window.document.location.origin.includes('localhost') ? 'http://localhost:9002' : window.document.location.origin;

const refUrl = `${baseURL}/api/v1/referral-code`;

export const checkReferralCode = async body => {
    const res = await axios.post(refUrl, body);
    return res;
};

const nodelogicUrl = `${baseURL}/api/v2/nodelogic`;
const exchangeRatesUrl = `${baseURL}/api/v2/exchange-rates`;
const applogicUrl = `${baseURL}/api/v2/applogic`;
export const getReferralTickets = async body => {
    const res = await axios.get(`${nodelogicUrl }${body}`);
    return  res.data;
};

export const getOverall = async () => {
    const res = await axios.get(`${nodelogicUrl}/tickets/all`);
    return res.data;
};

export const getBonusTickets = async () => {
    const res = await axios.get(`${nodelogicUrl}/tickets/bonus`);
    return res.data;
};

export const getActiveTicketsList = async () => {
    const res = await axios.get(`${nodelogicUrl}/tickets/active`);
    return res.data;
};

const paytoolsAPI = `${baseURL}/api/v2/paytools_api/private/initPayin`;

export const initPayin = async body => {
    const res = await axios.post(paytoolsAPI, body);
    return res.data;
};
export const checkDepositLimit = async body => {
    return new Promise(async (resolve, reject) => {
        await axios.post(`${applogicUrl}/public/limits/deposits/check`, body)
            .then(res => resolve(res.data))
            .catch(error => {
                console.log('error', error);
                reject(error);
            });
    });
};
export const removeQuestionnaire = async body => {
    const res = await axios.delete(`${applogicUrl}/public/labels/questionnaire`, body);
    return res.data;
};
export const getBalance = async (data?: string[]) => {
    const activeCurrency = localStorage.getItem('activeCurrency');
    const cryptoCurrency = localStorage.getItem('cryptoCurrency');
    const query = data ? data : [cryptoCurrency, activeCurrency];
    const res = await axios.get(`${exchangeRatesUrl}/user/balance?symbol=%22${query.join(',')}%22`);
    return res.data;
};


const referralCommissionServiceUrl = `${baseURL}/api/v2/referral`;
export const getReferral = async body => {
    const res = await axios.get(`${referralCommissionServiceUrl}${body}`);
    return res.data;
};

export const getExchangeRates = async (currency: string, amount: number, currencies: string[]) => {
    const res = await axios.get(
        `${exchangeRatesUrl}/tools/price-conversion?symbol=${currency}&amount=${encodeURIComponent(amount.toString())}&convert=${currencies.join(',')}`,
    );
    return res.data;
};
