// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import {
    orderBookData,
    orderBookError,
    OrderBookFetch,
} from '../actions';

const orderBookOptions: RequestOptions = {
    apiVersion: 'peatio',
};

export function* orderBookSaga(action: OrderBookFetch) {
    try {
        // tslint:disable-next-line:no-console
        console.log('...........testsssss');
        const market = action.payload;
        // tslint:disable-next-line:no-console
        console.log('...........market', market);
        if (!market.id) {
            throw new Error(`ERROR: Empty market provided to orderBookSaga`);
        }
        const orderBook = yield call(API.get(orderBookOptions), `/public/markets/${market.id}/order-book`);
        // tslint:disable-next-line:no-console
        console.log('...........orderBook', orderBook);
        yield put(orderBookData({ ...orderBook, market: market.id }));
    } catch (error) {
        // tslint:disable-next-line:no-console
        console.log('...........error?');
        yield put(orderBookError(error));
    }
}
