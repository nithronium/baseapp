// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { getParameters, removeParameters } from '../../auth/UTMparameters';
import {
    profileIdentityData,
    profileIdentityError,
} from '../actions';

const userOptions: RequestOptions = {
    apiVersion: 'barong',
};

const UTMParamConfig: RequestOptions = {
    apiVersion: 'applogic',
};

export function* profileIdentitySaga() {
    try {
        const data = getParameters();
        const profilePhone = yield call(API.get(userOptions), '/resource/phones');
        const profileIdentity = yield call(API.get(userOptions), '/resource/profiles/me');
        profileIdentity.number = profilePhone.filter(w => w.validated_at)[0].number;
        yield put(profileIdentityData(profileIdentity));
        if (data) {
            yield call(API.post(UTMParamConfig), '/private/utm', data);
            removeParameters();
        }
    } catch (error) {
        yield put(profileIdentityError(error));
    }
}
