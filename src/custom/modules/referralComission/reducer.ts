import { ReferralComissionActions, ReferralComissionPayload } from './actions';
import { REFERRAL_COMISSION_DATA, REFERRAL_COMISSION_ERROR, REFERRAL_COMISSION_FETCH } from './constants';

export interface ReferralComissionState {
    loading: boolean;
    data: ReferralComissionPayload;
}

const initialState: ReferralComissionState = {
    loading: false,
    data: {
        legend: '',
        // TODO: fix
    },
};

export const referralComissionReducer = (state = initialState, action: ReferralComissionActions) => {
    switch (action.type) {
        case REFERRAL_COMISSION_DATA:
            return {
                ...state,
                loading: false,
                data: action.payload,
            };
        case REFERRAL_COMISSION_ERROR:
            return {
                ...state,
                loading: false,
            };
        case REFERRAL_COMISSION_FETCH:
            return {
                ...state,
                loading: true,
            };
        default:
            return state;
    }
};
