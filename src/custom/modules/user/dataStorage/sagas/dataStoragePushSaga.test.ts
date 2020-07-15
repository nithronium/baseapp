import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../../helpers/jest';
import { rootSaga } from '../../../../../modules/index';
import {
    dataStoragePush,
    dataStoragePushData,
    dataStoragePushError,
} from '../actions';
import { DataStorageItemInterface } from '../types';

const debug = false;

describe('Data storage push', () => {
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
        const fakePushPayload: DataStorageItemInterface = {
            title: 'randomKey',
            data: 'randomValue: randomValue',
        };

        const mockDataStoragePush = () => {
            mockAxios.onPost('/resource/data_storage').reply(201);
        };

        const expectedActionsFetch = [
            dataStoragePush(fakePushPayload),
            dataStoragePushData(),
        ];

        const expectedActionsError = [
            dataStoragePush(fakePushPayload),
            dataStoragePushError({ code: 500, message: ['Server error'] }),
        ];

        it('should handle dataStoragePush in success flow', async () => {
            mockDataStoragePush();

            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === expectedActionsFetch.length) {
                        expect(actions).toEqual(expectedActionsFetch);
                        resolve();
                    }
                });
            });
            store.dispatch(dataStoragePush(fakePushPayload));

            return promise;
        });

        it('should handle dataStoragePush error', async () => {
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
            store.dispatch(dataStoragePush(fakePushPayload));

            return promise;
        });
    });
});
