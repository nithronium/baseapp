import * as React from 'react';
import { useDispatch } from 'react-redux';
import { setGeetestCaptchaSuccess } from '../modules';

export const useGeetestCaptchaSuccess = value => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(setGeetestCaptchaSuccess(value));
    }, [dispatch, value]);
};
