import * as React from 'react';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { Redirect } from 'react-router';
import { buildPath } from '../custom/helpers';
import {
    changeLanguage,
    RootState,
    selectCurrentLanguage,
    selectEmailVerified,
    verificationFetch,
} from '../modules';
import { CommonError } from '../modules/types';

interface DispatchProps {
    verification: typeof verificationFetch;
    changeLanguage: typeof changeLanguage;
}

interface ReduxProps {
    currentLanguage: string;
    isEmailVerified?: boolean;
    error?: CommonError;
}

export interface RouterProps {
    location: {
        search: string;
    };
}

type Props = DispatchProps & RouterProps & ReduxProps;

export const extractToken = (props: RouterProps) => new URLSearchParams(props.location.search).get('confirmation_token');
export const extractLang = (props: RouterProps) => new URLSearchParams(props.location.search).get('lang');

class Verification extends React.Component<Props> {
    public componentDidMount() {
        const token = extractToken(this.props);
        const lang = extractLang(this.props);
        if (token) {
            this.props.verification({ token });
        }
        if (lang) {
            this.props.changeLanguage(lang.toLowerCase());
        }
    }

    public render() {
        const { currentLanguage } =this.props;

        return (
            <Redirect to={buildPath('/signin', currentLanguage)} />
        );
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    currentLanguage: selectCurrentLanguage(state),
    isEmailVerified: selectEmailVerified(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        verification: data => dispatch(verificationFetch(data)),
        changeLanguage: lang => dispatch(changeLanguage(lang)),
    });

const VerificationScreen = connect(mapStateToProps, mapDispatchToProps)(Verification);

export {
    VerificationScreen,
};
