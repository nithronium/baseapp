import { CommonError } from '../../../../modules/types';
import { DataStorageAction } from './actions';
import {
    DATA_STORAGE_ALREADY,
    DATA_STORAGE_DATA,
    DATA_STORAGE_ERROR,
    DATA_STORAGE_FETCH,
    DATA_STORAGE_PUSH,
    DATA_STORAGE_PUSH_DATA,
    DATA_STORAGE_PUSH_ERROR,
} from './constants';
import { DataStorageDataInterface } from './types';

export interface DataStorageState {
    fetch: {
        success: boolean;
        loading: boolean;
        data?: DataStorageDataInterface;
        error?: CommonError;
    };
    push: {
        success: boolean;
        loading: boolean;
        error?: CommonError;
    };
    already: string;
}

export const initialDataStorageState: DataStorageState = {
    fetch: {
        success: false,
        loading: false,
    },
    push: {
        success: false,
        loading: false,
    },
    already: '',
};

export const dataStorageFetchReducer = (state: DataStorageState['fetch'], action: DataStorageAction) => {
    switch (action.type) {
        case DATA_STORAGE_FETCH:
            return {
                ...state,
                loading: true,
                success: false,
            };
        case DATA_STORAGE_DATA:
            return {
                ...state,
                data: action.payload,
                loading: false,
                success: true,
            };
        case DATA_STORAGE_ERROR:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const dataStoragePushReducer = (state: DataStorageState['push'], action: DataStorageAction) => {
    switch (action.type) {
        case DATA_STORAGE_PUSH:
            return {
                ...state,
                loading: true,
                success: false,
            };
        case DATA_STORAGE_PUSH_DATA:
            return {
                ...state,
                loading: false,
                success: true,
            };
        case DATA_STORAGE_PUSH_ERROR:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export const dataStorageReducer = (state = initialDataStorageState, action: DataStorageAction) => {
    switch (action.type) {
        case DATA_STORAGE_FETCH:
        case DATA_STORAGE_DATA:
        case DATA_STORAGE_ERROR:
            const dataStorageFetchState = { ...state.fetch };
            return {
                ...state,
                fetch: dataStorageFetchReducer(dataStorageFetchState, action),
            };
        case DATA_STORAGE_PUSH:
        case DATA_STORAGE_PUSH_DATA:
        case DATA_STORAGE_PUSH_ERROR:
            const dataStoragePushState = { ...state.push };
            return {
                ...state,
                push: dataStoragePushReducer(dataStoragePushState, action),
            };
        case DATA_STORAGE_ALREADY:
            return {
                ...state,
                already: action.payload,
            };
        default:
            return state;
    }
};
