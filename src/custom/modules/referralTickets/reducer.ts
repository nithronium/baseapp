import { ReferralTicketsActions, ReferralTicketsPayload } from './actions';
import { REFERRAL_TICKETS_DATA, REFERRAL_TICKETS_FETCH } from './constants';

export interface ReferralTicketsState {
    loading: boolean;
    data: ReferralTicketsPayload;
}

const initialState: ReferralTicketsState = {
    loading: false,
    data: {
        bonuses: [],
        referrals: [],
        user: {
            usdBalance: 0,
            usdTickets: 0,
            emrxBalance: 0,
            emrxTickets: 0,
        },
    },
};

export const referralTicketsReducer = (state = initialState, action: ReferralTicketsActions) => {
    switch (action.type) {
        case REFERRAL_TICKETS_DATA:
            return {
                ...state,
                loading: false,
                data: action.payload,
            };
        case REFERRAL_TICKETS_FETCH:
            return {
                ...state,
                loading: true,
            };
        default:
            return state;
    }
};
