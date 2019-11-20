import axios, { AxiosResponse } from 'axios';
import { JsonBody, makeRequest, RequestOptions } from './requestBuilder';

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

// const refConf: RequestOptions = {
//     apiVersion: 'referral',
// };
const refUrl = `${window.document.location.origin}/api/v1/referral-code`;
// const refUrl = `https://stage.emirex.com/api/v1/referral-code`;
export const changePassword = async body => API.post(conf)('/identity/users/password/confirm_code', body);
// export const checkReferralCode = async body => API.post(refConf)('', body);
export const checkReferralCode = async body => {
    const res = await axios.post(refUrl, body);
    return res;
};
