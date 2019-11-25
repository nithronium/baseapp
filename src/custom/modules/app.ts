import { combineReducers } from 'redux';
import { kycAuthReducer } from './user/kycAuth';

export const customUserReducer = combineReducers({
    kycAuth: kycAuthReducer,
});
