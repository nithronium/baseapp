import {
    CommonError,
} from '../../types';
import { GeetestCaptchaAction, GeetestCaptchaKeys } from './actions';
import {
    GEETEST_CAPTCHA_SUCCESS_DATA,
    GET_GEETEST_CAPTCHA_DATA,
    GET_GEETEST_CAPTCHA_ERROR,
    GET_GEETEST_CAPTCHA_FETCH,
    RECAPTCHA_SUCCESS_DATA,
    SHOULD_GEETEST_RESET_FETCH,
} from './constants';

export interface GeetestCaptchaState {
    loading: boolean;
    success: boolean;
    error?: CommonError;
    keys?: GeetestCaptchaKeys;
    captcha_response: string;
    reCaptchaSuccess: boolean;
    geetestCaptchaSuccess: boolean;
    shouldGeetestReset: boolean;
}

const initialState: GeetestCaptchaState = {
    loading: false,
    success: false,
    captcha_response: '',
    reCaptchaSuccess: false,
    geetestCaptchaSuccess: false,
    shouldGeetestReset: false,
};

export const getGeetestCaptchaReducer = (state = initialState, action: GeetestCaptchaAction) => {
    switch (action.type) {
        case GET_GEETEST_CAPTCHA_DATA:
            return {
                ...state,
                keys: action.keys,
                loading: false,
                success: true,
            };
        case GET_GEETEST_CAPTCHA_ERROR:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.error,
            };
        case GET_GEETEST_CAPTCHA_FETCH:
            return {
                ...state,
                loading: true,
                success: false,
            };
        case GEETEST_CAPTCHA_SUCCESS_DATA:
            return {
                geetestCaptchaSuccess: true,
                captcha_response: action.payload,
                shouldGeetestReset: false,
            };
        case SHOULD_GEETEST_RESET_FETCH:
            return {
                shouldGeetestReset: action.payload,
            };
        case RECAPTCHA_SUCCESS_DATA:
            return {
                reCaptchaSuccess: true,
                captcha_response: action.payload,
            };
        default:
            return state;
    }
};
