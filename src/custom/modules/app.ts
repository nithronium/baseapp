import { combineReducers } from 'redux';
import { dataStorageReducer } from './user/dataStorage';
import { kycAuthReducer } from './user/kycAuth';

export const customUserReducer = combineReducers({
    dataStorage: dataStorageReducer,
    kycAuth: kycAuthReducer,
});
