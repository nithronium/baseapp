import * as actions from './actions';
import {
  initialWithdrawLimitState,
  withdrawLimitReducer,
} from './reducer';
import { WithdrawLimit } from './types';

describe('withdrawLimitList reducer', () => {
    const withdrawLimit: WithdrawLimit = {
            withdraw:
            {
                limit: '10.0',
                period: 24,
                amount: '0.0',
                currency: 'btc',
            },
            deposit:
            {
                limit: '10',
                amount: '0.0',
                period: 24,
            },
        };

    const error = {
        code: 500,
        message: ['Server error'],
    };

    it('should handle WITHDRAW_LIMIT_FETCH', () => {
        const expectedState = {
            data: {
                withdraw:
                {
                    limit: '10.0',
                    period: 24,
                    amount: '0.0',
                    currency: 'btc',
                },
                deposit:
                {
                    limit: '10',
                    amount: '0.0',
                    period: 24,
                },
            },
            loading: true,
            success: false,
         };
        expect(withdrawLimitReducer(initialWithdrawLimitState, actions.withdrawLimitFetch())).toEqual(expectedState);
    });

    it('should handle WITHDRAW_LIMIT_DATA', () => {
        const expectedState = {
            data: withdrawLimit,
            loading: false,
            success: true,
         };
        expect(withdrawLimitReducer(initialWithdrawLimitState, actions.withdrawLimitData(withdrawLimit))).toEqual(expectedState);
    });

    it('should handle WITHDRAW_LIMIT_ERROR', () => {
        const expectedState = {
            data: {
                withdraw:
                {
                    limit: '10.0',
                    period: 24,
                    amount: '0.0',
                    currency: 'btc',
                },
                deposit:
                {
                    limit: '10',
                    amount: '0.0',
                    period: 24,
                },
            },
            loading: false,
            success: false,
            error: error,
         };
        expect(withdrawLimitReducer(initialWithdrawLimitState, actions.withdrawLimitError(error))).toEqual(expectedState);
    });
});
