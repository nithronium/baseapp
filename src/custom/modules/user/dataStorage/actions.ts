import { CommonError } from '../../../../modules/types';
import {
    DATA_STORAGE_ALREADY,
    DATA_STORAGE_DATA,
    DATA_STORAGE_ERROR,
    DATA_STORAGE_FETCH,
    DATA_STORAGE_GET_DATA,
    DATA_STORAGE_PUSH,
    DATA_STORAGE_PUSH_DATA,
    DATA_STORAGE_PUSH_ERROR,
} from './constants';
import {
    DataStorageDataInterface,
    DataStorageItemInterface,
} from './types';

export interface DataStorageFetch {
    type: typeof DATA_STORAGE_FETCH;
    payload: {
        uid: string;
    };
}

export interface DataStorageData {
    type: typeof DATA_STORAGE_DATA;
    payload: DataStorageDataInterface;
}

export interface DataStorageError {
    type: typeof DATA_STORAGE_ERROR;
    payload: CommonError;
}

export interface DataStoragePush {
    type: typeof DATA_STORAGE_PUSH;
    payload: DataStorageItemInterface;
}

export interface DataStoragePushData {
    type: typeof DATA_STORAGE_PUSH_DATA;
}

export interface DataStorageGetData {
    type: typeof DATA_STORAGE_GET_DATA;
}

export interface DataStorageSetAlready {
    type: typeof DATA_STORAGE_ALREADY;
    payload: string;
}

export interface DataStoragePushError {
    type: typeof DATA_STORAGE_PUSH_ERROR;
    payload: CommonError;
}


export type DataStorageAction = DataStorageFetch
    | DataStorageData
    | DataStorageError
    | DataStoragePush
    | DataStoragePushData
    | DataStorageSetAlready
    | DataStoragePushError;

export const dataStorageFetch = (payload: DataStorageFetch['payload']): DataStorageFetch => ({
    type: DATA_STORAGE_FETCH,
    payload,
});

export const dataStorageData = (payload: DataStorageData['payload']): DataStorageData => ({
    type: DATA_STORAGE_DATA,
    payload,
});

export const dataStorageError = (payload: DataStorageError['payload']): DataStorageError => ({
    type: DATA_STORAGE_ERROR,
    payload,
});

export const dataStoragePush = (payload: DataStoragePush['payload']): DataStoragePush => ({
    type: DATA_STORAGE_PUSH,
    payload,
});

export const dataStoragePushData = (): DataStoragePushData => ({
    type: DATA_STORAGE_PUSH_DATA,
});

export const dataStorageGetData = (): DataStorageGetData => ({
    type: DATA_STORAGE_GET_DATA,
});

export const dataStorageSetAlready = (payload: DataStorageSetAlready['payload']): DataStorageSetAlready => ({
    type: DATA_STORAGE_ALREADY,
    payload,
});

export const dataStoragePushError = (payload: DataStoragePushError['payload']): DataStoragePushError => ({
    type: DATA_STORAGE_PUSH_ERROR,
    payload,
});
