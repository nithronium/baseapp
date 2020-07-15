import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../../helpers/jest';
import { rootSaga } from '../../../../../modules/index';
import { kycAuthData, kycAuthError, kycAuthFetch } from '../actions';
import { KycAuthDataInterface } from '../types';

const debug = false;

describe('KycAuth', () => {
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

    describe('Fetch kycAuth data', () => {
        const fakeResponse: KycAuthDataInterface = {
            auth_token: '12JWD2398DH2CKS023D2H',
        };

        const mockKycAuthFetch = () => {
            mockAxios.onGet('/private/kyc/auth').reply(200, fakeResponse);
        };

        const expectedActionsFetch = [
            kycAuthFetch(),
            kycAuthData(fakeResponse),
        ];

        const expectedActionsError = [
            kycAuthFetch(),
            kycAuthError({ code: 500, message: ['Server error'] }),
        ];

        it('should fetch kycAuth in success flow', async () => {
            mockKycAuthFetch();

            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === expectedActionsFetch.length) {
                        expect(actions).toEqual(expectedActionsFetch);
                        resolve();
                    }
                });
            });
            store.dispatch(kycAuthFetch());

            return promise;
        });

        it('should handle kycAuth error', async () => {
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
            store.dispatch(kycAuthFetch());

            return promise;
        });
    });
});
