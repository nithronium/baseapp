import { CommonError } from '../../../modules/types';
import {
    CREDIT_CARD_ERROR,
} from './constants';

export interface CreditCardError {
    type: typeof CREDIT_CARD_ERROR;
    payload: CommonError;
}

export type CreditCardActions = CreditCardError;

export const creditCardError = (payload: CommonError): CreditCardError => ({
    type: CREDIT_CARD_ERROR,
    payload,
});

