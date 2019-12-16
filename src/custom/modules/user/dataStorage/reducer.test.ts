import * as actions from './actions';
import {
    dataStorageReducer,
    initialDataStorageState,
} from './reducer';
import {
    DataStorageDataInterface,
    DataStorageItemInterface,
} from './types';

describe('Data storage reducer', () => {
    const fakeFetchPayload = {
        uid: 'UID1111111',
    };

    const fakeFetchData: DataStorageDataInterface = {
        data_storages: [
            {
              title: 'questionnaire',
              data: '{\"What is your favorite food?\":\"My favorite food is spaghetti\",\"Your first pet name\":\"Its name Bosya, it is cat\"}',
            },
            {
              title: 'randomKey',
              data: 'randomValue: randomValue',
            },
        ],
    };

    const fakePushPayload: DataStorageItemInterface = {
        title: 'randomKey',
        data: 'randomValue: randomValue',
    };

    const error = {
        code: 500,
        message: ['Server error'],
    };

    it('should handle DATA_STORAGE_FETCH', () => {
        const expectedState = {
            ...initialDataStorageState,
            fetch: {
                ...initialDataStorageState.fetch,
                loading: true,
                success: false,
            },
         };
        expect(dataStorageReducer(initialDataStorageState, actions.dataStorageFetch(fakeFetchPayload))).toEqual(expectedState);
    });

    it('should handle DATA_STORAGE_DATA', () => {
        const expectedState = {
            ...initialDataStorageState,
            fetch: {
                ...initialDataStorageState.fetch,
                data: fakeFetchData,
                loading: false,
                success: true,
            },
        };

        expect(dataStorageReducer(initialDataStorageState, actions.dataStorageData(fakeFetchData))).toEqual(expectedState);
    });

    it('should handle DATA_STORAGE_ERROR', () => {
        const expectedState = {
            ...initialDataStorageState,
            fetch: {
                ...initialDataStorageState.fetch,
                loading: false,
                success: false,
                error: error,
            },
        };

        expect(dataStorageReducer(initialDataStorageState, actions.dataStorageError(error))).toEqual(expectedState);
    });

    it('should handle DATA_STORAGE_PUSH', () => {
        const expectedState = {
            ...initialDataStorageState,
            push: {
                ...initialDataStorageState.push,
                loading: true,
                success: false,
            },
         };
        expect(dataStorageReducer(initialDataStorageState, actions.dataStoragePush(fakePushPayload))).toEqual(expectedState);
    });

    it('should handle DATA_STORAGE_PUSH_DATA', () => {
        const expectedState = {
            ...initialDataStorageState,
            push: {
                ...initialDataStorageState.push,
                loading: false,
                success: true,
            },
        };

        expect(dataStorageReducer(initialDataStorageState, actions.dataStoragePushData())).toEqual(expectedState);
    });

    it('should handle DATA_STORAGE_PUSH_ERROR', () => {
        const expectedState = {
            ...initialDataStorageState,
            push: {
                ...initialDataStorageState.push,
                loading: false,
                success: false,
                error: error,
            },
        };

        expect(dataStorageReducer(initialDataStorageState, actions.dataStoragePushError(error))).toEqual(expectedState);
    });
});
