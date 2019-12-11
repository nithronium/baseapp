import * as actions from './actions';
import {
    KYC_AUTH_DATA,
    KYC_AUTH_ERROR,
    KYC_AUTH_FETCH,
} from './constants';
import { KycAuthDataInterface } from './types';

describe('Kyc Auth actions', () => {
    it('should check kycAuthFetch action creator', () => {
        const expectedAction = {
            type: KYC_AUTH_FETCH,
        };

        expect(actions.kycAuthFetch()).toEqual(expectedAction);
    });

    it('should check kycAuthData action creator', () => {
        const payload: KycAuthDataInterface = {
            auth_token: '12JWD2398DH2CKS023D2H',
        };
        const expectedAction = { type: KYC_AUTH_DATA, payload };
        expect(actions.kycAuthData(payload)).toEqual(expectedAction);
    });

    it('should check kycAuthError action creator', () => {
        const payload = { code: 500, message: ['Server error'] };
        const expectedAction = { type: KYC_AUTH_ERROR, payload };
        expect(actions.kycAuthError(payload)).toEqual(expectedAction);
    });
});
