import * as React from 'react';
import { useDispatch } from 'react-redux';
import { setShouldGeetestReset } from '../modules';

export const useSetShouldGeetestReset = (value: boolean) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(setShouldGeetestReset(value));
    }, [dispatch, value]);
};
