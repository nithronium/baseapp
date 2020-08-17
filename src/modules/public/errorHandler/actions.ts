import { ERROR_HANDLE_DATA, ERROR_HANDLE_FETCH } from './constants';

export interface ErrorHandlerFetch {
    type: typeof ERROR_HANDLE_FETCH;
    payload: any;
    processingType: 'sentry' | 'alert' | 'console';
}

interface ErrorHandlerData {
    type: typeof ERROR_HANDLE_DATA;
}

export type ErrorHandlerAction = ErrorHandlerFetch | ErrorHandlerData;

export const sendError = (
    payload: ErrorHandlerFetch['payload'],
    processingType: ErrorHandlerFetch['processingType'],
): ErrorHandlerFetch => ({
    type: ERROR_HANDLE_FETCH,
    payload,
    processingType,
});

export const getErrorData = (): ErrorHandlerData => ({
    type: ERROR_HANDLE_DATA,
});
