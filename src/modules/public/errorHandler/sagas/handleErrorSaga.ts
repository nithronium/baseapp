import * as Sentry from '@sentry/browser';
import { call, put } from 'redux-saga/effects';
import { alertPush } from '../../alert';
import { ErrorHandlerFetch, getErrorData } from '../actions';

export function* handleErrorSaga(action: ErrorHandlerFetch) {
    const { processingType } = action;

    switch (processingType) {
        case 'sentry':
            yield call(handleSentryError, action.payload);
            break;
        case 'alert':
            yield call(handleAlertError,  action.payload);
            break;
        case 'console':
            yield call(handleConsoleError, action.payload);
            break;
        default:
            break;
    }

    yield put(getErrorData());
}

function* handleSentryError(error) {
    for (const item of error.message) {
        yield call(Sentry.captureException, item);
    }
}

function* handleAlertError(error) {
    yield put(alertPush({
        message: error.message,
        code: error.code,
        type: 'error',
    }));
}

function* handleConsoleError(error) {
    yield call(window.console.error, error.message[0]);
}
