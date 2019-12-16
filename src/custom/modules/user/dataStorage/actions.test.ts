import * as actions from './actions';
import {
    DATA_STORAGE_DATA,
    DATA_STORAGE_ERROR,
    DATA_STORAGE_FETCH,
    DATA_STORAGE_PUSH,
    DATA_STORAGE_PUSH_DATA,
    DATA_STORAGE_PUSH_ERROR,
} from './constants';
import {
    DataStorageDataInterface,
    DataStorageItemInterface,
} from './types';

describe('Data storage actions', () => {
    it('should check DataStorageFetch action creator', () => {
        const fakeFetchPayload = {
            uid: 'UID1111111',
        };

        const expectedAction = {
            type: DATA_STORAGE_FETCH,
            payload: fakeFetchPayload,
        };

        expect(actions.dataStorageFetch(fakeFetchPayload)).toEqual(expectedAction);
    });

    it('should check DataStorageData action creator', () => {
        const fakeResponseData: DataStorageDataInterface = {
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

        const expectedAction = { type: DATA_STORAGE_DATA, payload: fakeResponseData };
        expect(actions.dataStorageData(fakeResponseData)).toEqual(expectedAction);
    });

    it('should check DataStorageError action creator', () => {
        const payload = { code: 500, message: ['Server error'] };
        const expectedAction = { type: DATA_STORAGE_ERROR, payload };
        expect(actions.dataStorageError(payload)).toEqual(expectedAction);
    });

    it('should check DataStoragePush action creator', () => {
        const fakePushPayload: DataStorageItemInterface = {
            title: 'randomKey',
            data: 'randomValue: randomValue',
        };

        const expectedAction = {
            type: DATA_STORAGE_PUSH,
            payload: fakePushPayload,
        };

        expect(actions.dataStoragePush(fakePushPayload)).toEqual(expectedAction);
    });

    it('should check DataStoragePushData action creator', () => {
        const expectedAction = { type: DATA_STORAGE_PUSH_DATA };
        expect(actions.dataStoragePushData()).toEqual(expectedAction);
    });

    it('should check DataStoragePushError action creator', () => {
        const payload = { code: 500, message: ['Server error'] };
        const expectedAction = { type: DATA_STORAGE_PUSH_ERROR, payload };
        expect(actions.dataStoragePushError(payload)).toEqual(expectedAction);
    });
});
