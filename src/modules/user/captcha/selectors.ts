import { RootState } from '../..';
import { GeetestCaptchaKeys } from './actions';

export const selectCaptchaKeys = (state: RootState): GeetestCaptchaKeys | undefined =>
    state.user.captchaKeys.keys;

export const selectCaptchaDataObjectLoading = (state: RootState): boolean =>
    state.user.captchaKeys.loading;

export const selectGeetestCaptchaSuccess = (state: RootState): boolean =>
    state.user.captchaKeys.geetestCaptchaSuccess;

export const selectRecaptchaSuccess = (state: RootState): boolean =>
    state.user.captchaKeys.reCaptchaSuccess;

export const selectShouldGeetestReset = (state: RootState): boolean =>
    state.user.captchaKeys.shouldGeetestReset;

export const selectCaptchaResponse = (state: RootState): string =>
    state.user.captchaKeys.captcha_response;
