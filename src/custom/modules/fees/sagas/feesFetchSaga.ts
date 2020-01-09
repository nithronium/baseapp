// tslint:disable-next-line
import { call, put, takeLatest } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { alertPush } from '../../../../modules/public/alert';
import { feesData, feesError } from '../actions';
import { FEES_FETCH } from '../constants';

// const mockFees = [
//     {
//         id: 1,
//         group: 'any',
//         market_id: 'btcusd',
//         maker: '0.0015',
//         taker: '0.0015',
//         created_at: '2019-09-18T11:41:28Z',
//         updated_at: '2019-09-18T11:41:28Z',
//     },
//     {
//         id: 2,
//         group: 'any',
//         market_id: 'btcusdt',
//         maker: '0.003',
//         taker: '0.003',
//         created_at: '2019-09-18T11:41:28Z',
//         updated_at: '2019-09-18T11:41:28Z',
//     },
//     {
//         id: 3,
//         group: 'any',
//         market_id: 'ethbtc',
//         maker: '0.003',
//         taker: '0.003',
//         created_at: '2019-09-18T11:41:28Z',
//         updated_at: '2019-09-18T11:41:28Z',
//     },
//     {
//         id: 4,
//         group: 'any',
//         market_id: 'ethusd',
//         maker: '0.0015',
//         taker: '0.0015',
//         created_at: '2019-09-18T11:41:28Z',
//         updated_at: '2019-09-18T11:41:28Z',
//     },
//     {
//         id: 5,
//         group: 'any',
//         market_id: 'any',
//         maker: '0.002',
//         taker: '0.002',
//         created_at: '2019-09-18T13:07:09Z',
//         updated_at: '2019-09-18T13:07:09Z',
//     },
//     {
//         id: 6,
//         group: 'vip-0',
//         market_id: 'any',
//         maker: '0.001',
//         taker: '0.002',
//         created_at: '2019-09-18T13:07:09Z',
//         updated_at: '2019-09-18T13:07:09Z',
//     },
//     {
//         id: 7,
//         group: 'vip-1',
//         market_id: 'any',
//         maker: '0.0008',
//         taker: '0.0018',
//         created_at: '2019-09-18T13:07:09Z',
//         updated_at: '2019-09-18T13:07:09Z',
//     },
//     {
//         id: 8,
//         group: 'vip-2',
//         market_id: 'any',
//         maker: '0.0006',
//         taker: '0.0016',
//         created_at: '2019-09-18T13:07:09Z',
//         updated_at: '2019-09-18T13:07:09Z',
//     },
//     {
//         id: 9,
//         group: 'vip-3',
//         market_id: 'any',
//         maker: '0.0',
//         taker: '0.0014',
//         created_at: '2019-09-18T13:07:09Z',
//         updated_at: '2019-09-18T13:07:09Z',
//     },
// ];

const feesOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* rootFeesSaga() {
    yield takeLatest(FEES_FETCH, feesFetchSaga);
}

export function* feesFetchSaga() {
    try {
        const fees = yield call(API.get(feesOptions), '/public/trading_fees');
        // fees = mockFees;
        yield put(feesData(fees));
    } catch (error) {
        yield put(feesError());
        yield put(alertPush({ message: error.message, code: error.code, type: 'error' }));
    }
}