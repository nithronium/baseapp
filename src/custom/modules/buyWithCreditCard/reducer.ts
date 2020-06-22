
import {
    CreateCardOrderResponse,
    CreditCardActions,
} from './actions';

import {
    CREATE_CREDIT_CARD_ORDER_DATA,
    CREATE_CREDIT_CARD_ORDER_ERROR,
    CREATE_CREDIT_CARD_ORDER_FETCH,
} from './constants';

const initialState = {
    error: false,
    loading: false,
    data: {},
};

export interface CreaditCardState {
    error: boolean;
    loading: boolean;
    data: CreateCardOrderResponse;
}

export const buyWithCreditCardReducer = (state = initialState, action: CreditCardActions) => {
    switch (action.type) {
        case CREATE_CREDIT_CARD_ORDER_ERROR:
            return {
                ...state,
                error: true,
                loading: false,
            };
        case CREATE_CREDIT_CARD_ORDER_DATA:
            return {
                ...state,
                loading: false,
                error: false,
                data: action.payload,
            };
        case CREATE_CREDIT_CARD_ORDER_FETCH:
            return {
                ...state,
                loading: true,
            };
        default:
            return state;
    }
};
