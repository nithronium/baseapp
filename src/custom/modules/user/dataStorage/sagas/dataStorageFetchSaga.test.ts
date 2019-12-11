import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../../helpers/jest';
import { rootSaga } from '../../../../../modules/index';
import {
    dataStorageData,
    dataStorageError,
    dataStorageFetch,
} from '../actions';
import { DataStorageDataInterface } from '../types';

const debug = false;

describe('Data storage fetch', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware<{}>;
    let mockAxios: MockAdapter;

    afterEach(() => {
        mockAxios.reset();
    });

    beforeEach(() => {
        mockAxios = setupMockAxios();
        sagaMiddleware = createSagaMiddleware();
        store = setupMockStore(sagaMiddleware, debug)();
        sagaMiddleware.run(rootSaga);
    });

    describe('Fetch data storage', () => {
        const fakeFetchPayload = {
            uid: 'UID1111111',
        };

        const fakeResponse: DataStorageDataInterface = {
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

        const mockDataStorageFetch = payload => {
            mockAxios.onGet(`/admin/users/${payload.uid}`).reply(200, fakeResponse);
        };

        const expectedActionsFetch = [
            dataStorageFetch(fakeFetchPayload),
            dataStorageData(fakeResponse),
        ];

        const expectedActionsError = [
            dataStorageFetch(fakeFetchPayload),
            dataStorageError({ code: 500, message: ['Server error'] }),
        ];

        it('should handle dataStorageFetch in success flow', async () => {
            mockDataStorageFetch(fakeFetchPayload);

            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === expectedActionsFetch.length) {
                        expect(actions).toEqual(expectedActionsFetch);
                        resolve();
                    }
                });
            });
            store.dispatch(dataStorageFetch(fakeFetchPayload));
            return promise;
        });

        it('should handle dataStorageFetch error', async () => {
            mockNetworkError(mockAxios);
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === expectedActionsError.length) {
                        expect(actions).toEqual(expectedActionsError);
                        resolve();
                    }
                });
            });
            store.dispatch(dataStorageFetch(fakeFetchPayload));
            return promise;
        });
    });
});
