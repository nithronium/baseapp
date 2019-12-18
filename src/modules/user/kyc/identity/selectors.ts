import { RootState } from '../../../index';
import { IdentityState } from './reducer';

export const selectEditIdentitySuccess = (state: RootState): IdentityState['edit']['success'] =>
    state.user.identity.edit.success;

export const selectEditIdentityData = (state: RootState): IdentityState['edit']['data'] =>
    state.user.identity.edit.data;

export const selectEditIdentityError = (state: RootState): IdentityState['edit']['error'] =>
    state.user.identity.edit.error;

export const selectSendIdentitySuccess = (state: RootState): IdentityState['send']['success'] =>
    state.user.identity.send.success;

export const selectSendIdentityData = (state: RootState): IdentityState['send']['data'] =>
    state.user.identity.send.data;

export const selectSendIdentityError = (state: RootState): IdentityState['send']['error'] =>
    state.user.identity.send.error;
