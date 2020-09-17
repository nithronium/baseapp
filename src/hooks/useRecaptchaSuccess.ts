import * as React from 'react';
import { useDispatch } from 'react-redux';
import { setRecaptchaSuccess } from '../modules';

export const useRecaptchaSuccess = (value: string) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(setRecaptchaSuccess(value));
    }, [dispatch, value]);
};
