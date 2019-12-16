
import { RootState } from '../../../../modules';
import { CommonError } from '../../../../modules/types';
import { KycAuthState } from './reducer';

export const selectKycAuthData = (state: RootState): KycAuthState['data'] =>
    state.customUser.kycAuth.data;

export const selectKycAuthSuccess = (state: RootState): boolean =>
    state.customUser.kycAuth.success;

export const selectKycAuthLoading = (state: RootState): boolean =>
    state.customUser.kycAuth.loading;

export const selectKycAuthError = (state: RootState): CommonError | undefined =>
    state.customUser.kycAuth.error;
