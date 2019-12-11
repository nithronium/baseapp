
import { RootState } from '../../../../modules';
import { CommonError } from '../../../../modules/types';
import { DataStorageState } from './reducer';

/* Data storage fetch */
export const selectDataStorageFetchData = (state: RootState): DataStorageState['fetch']['data'] =>
    state.customUser.dataStorage.fetch.data;

export const selectDataStorageFetchSuccess = (state: RootState): boolean =>
    state.customUser.dataStorage.fetch.success;

export const selectDataStorageFetchLoading = (state: RootState): boolean =>
    state.customUser.dataStorage.fetch.loading;

export const selectDataStorageFetchError = (state: RootState): CommonError | undefined =>
    state.customUser.dataStorage.fetch.error;

/* Data storage push */
export const selectDataStoragePushSuccess = (state: RootState): boolean =>
    state.customUser.dataStorage.push.success;

export const selectDataStoragePushLoading = (state: RootState): boolean =>
    state.customUser.dataStorage.push.loading;

export const selectDataStoragePushError = (state: RootState): CommonError | undefined =>
    state.customUser.dataStorage.push.error;
