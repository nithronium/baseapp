// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import {
    beneficiariesData,
    beneficiariesError,
} from '../actions';

const config: RequestOptions = {
    apiVersion: 'peatio',
};

export function* beneficiariesSaga() {
    try {
        const beneficiaries = yield call(API.get(config), '/account/beneficiaries');
        yield put(beneficiariesData(beneficiaries));
    } catch (error) {
        yield put(beneficiariesError(error));
        yield put(sendError(error, 'alert'));
    }
}
