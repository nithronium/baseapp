import { History } from 'history';
import * as React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapStateToProps } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { buildPath } from '../../custom/helpers';
import { setDocumentTitle } from '../../helpers';
import {
    emailVerificationFetch,
    RootState,
    selectCurrentLanguage,
    selectSendEmailVerificationLoading,
} from '../../modules';

const logo = require('../../assets/images/logo.svg');

interface OwnProps {
    history: History;
    location: {
        state: {
            email: string;
        };
    };
}

interface DispatchProps {
    emailVerificationFetch: typeof emailVerificationFetch;
}

interface ReduxProps {
    emailVerificationLoading: boolean;
}

type Props = DispatchProps & ReduxProps & OwnProps & InjectedIntlProps;

class EmailVerificationComponent extends React.Component<Props> {
    public componentDidMount() {
        const {
            history,
            i18n,
            location,
        } = this.props;

        setDocumentTitle('Email verification');

        if (!location.state || !location.state.email) {
            history.push(buildPath('/signin', i18n));
        }
    }

    public render() {
        const { emailVerificationLoading } = this.props;

        const title = this.props.intl.formatMessage({ id: 'page.header.signUp.modal.header' });
        const text = this.props.intl.formatMessage({ id: 'page.header.signUp.modal.body' });
        const button = this.props.intl.formatMessage({ id: 'page.resendConfirmation' });

        return (
            <div className="pg-emailverification-container">
                <div className="cr-logo">
                    <img src={logo} className="cr-logo__img" alt="Logo" />
                </div>
                <div className="pg-emailverification">
                    <div className="pg-emailverification-title">{title}</div>
                    <div className="pg-emailverification-body">
                        <div className="pg-emailverification-body-text">{text}</div>
                        <div className="pg-emailverification-body-container">
                            {emailVerificationLoading ? <Spinner animation="border" variant="primary" />
                                : <Button
                                    className="pg-emailverification-body-container-button"
                                    onClick={this.handleClick}
                                    block={true}
                                    variant="primary"
                                    size="lg">
                                        {button}
                                  </Button>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    private handleClick = () => {
        this.props.emailVerificationFetch({
          email: this.props.location.state.email,
        });
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    emailVerificationLoading: selectSendEmailVerificationLoading(state),
    i18n: selectCurrentLanguage(state),
});

const mapDispatchProps = {
    emailVerificationFetch,
};

//tslint:disable-next-line:no-any
export const EmailVerificationScreen = injectIntl(withRouter(connect(mapStateToProps, mapDispatchProps)(EmailVerificationComponent) as any));
