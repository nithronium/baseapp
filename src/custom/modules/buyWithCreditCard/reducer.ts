
import {
    CreditCardActions,
} from './actions';

import {
    CREDIT_CARD_ERROR,
} from './constants';

const initialState = {
    error: false,
    loading: false,
};

export interface CreaditCardState {
    error: boolean;
    loading: boolean;
}

export const buyWithCreditCardReducer = (state = initialState, action: CreditCardActions) => {
    switch (action.type) {
        case CREDIT_CARD_ERROR:
            return {
                ...state,
                error: true,
            };
        default:
            return state;
    }
};
