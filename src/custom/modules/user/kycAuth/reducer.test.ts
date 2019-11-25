import * as actions from './actions';
import {
    initialKycAuthState,
    kycAuthReducer,
} from './reducer';
import { KycAuthDataInterface } from './types';

describe('KycAuth reducer', () => {
    const fakeData: KycAuthDataInterface = {
        auth_token: '12JWD2398DH2CKS023D2H',
    };

    const error = {
        code: 500,
        message: ['Server error'],
    };

    it('should handle KYC_AUTH_FETCH', () => {
        const expectedState = {
            ...initialKycAuthState,
            loading: true,
            success: false,
         };
        expect(kycAuthReducer(initialKycAuthState, actions.kycAuthFetch())).toEqual(expectedState);
    });

    it('should handle KYC_AUTH_DATA', () => {
        const expectedState = {
            ...initialKycAuthState,
            data: fakeData,
            loading: false,
            success: true,
         };

        expect(kycAuthReducer(initialKycAuthState, actions.kycAuthData(fakeData))).toEqual(expectedState);
    });

    it('should handle KYC_AUTH_ERROR', () => {
        const expectedState = {
            ...initialKycAuthState,
            loading: false,
            success: false,
            error: error,
         };
        expect(kycAuthReducer(initialKycAuthState, actions.kycAuthError(error))).toEqual(expectedState);
    });
});
