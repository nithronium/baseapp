import classnames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import logo = require('../../../assets/images/logo.svg');
import logoLight = require('../../../assets/images/logoLight.svg');
import { VersionGuardWrapper } from '../../../decorators';
import { setDocumentTitle } from '../../../helpers';
import {
    alertPush,
    Label,
    labelFetch,
    RootState,
    selectCurrentColorTheme,
    selectLabelData,
    selectUserInfo,
    User,
} from '../../../modules';
import { Documents } from '../../containers/Confirm/Documents';
import { Idenfy } from '../../containers/Confirm/Idenfy';
import { Phone } from '../../containers/Confirm/Phone';
import { ProfilePartial } from '../../containers/Confirm/ProfilePartial';
import { Questionnaire } from '../../containers/Confirm/Questionnaire';

interface ReduxProps {
    colorTheme: string;
    userData: User;
    labels: Label[];
}

interface HistoryProps {
    history: History;
}

interface ConfirmState {
    title: string;
    level: number;
    kycAlert: boolean;
    documentsAlert: boolean;
}

interface DispatchProps {
    fetchAlert: typeof alertPush;
    labelFetch: typeof labelFetch;
}

type Props = ReduxProps & HistoryProps & DispatchProps;

class ConfirmComponent extends React.Component<Props, ConfirmState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            title: '',
            level: 0,
            kycAlert: false,
            documentsAlert: false,
        };
    }

    public componentDidMount() {
        setDocumentTitle('Confirm');
        this.props.labelFetch();
        const { userData } = this.props;
        this.setState({
            level: userData.level,
        });
    }

    public goBack = event => {
      event.preventDefault();
      this.props.history.push('/profile');
    };

    // tslint:disable:jsx-no-multiline-js
    public render() {
        const { colorTheme, userData } = this.props;

        const currentProfileLevel = userData.level;
        const cx = classnames('pg-confirm__progress-items', {
            'pg-confirm__progress-first': currentProfileLevel === 0 || currentProfileLevel === 1,
            'pg-confirm__progress-second': currentProfileLevel === 2 || currentProfileLevel === 3,
            'pg-confirm__progress-third': currentProfileLevel === 4 || currentProfileLevel === 5,
        });

        return (
            <div className="pg-wrapper">
                <div className="pg-logo">
                    {colorTheme === 'light' ? (
                        <img src={logoLight} className="pg-logo__img" alt="Logo" />
                    ) : (
                        <img src={logo} className="pg-logo__img" alt="Logo" />
                    )}
                </div>
                <div className="pg-confirm">
                    <div className="pg-confirm-box">
                        <a
                            href="#"
                            onClick={this.goBack}
                            className="pg-confirm-box-close"
                        />
                        <div className="pg-confirm__progress">
                            <div className={cx}>
                                <div className="pg-confirm__progress-circle-1">
                                    <span className="pg-confirm__title-text pg-confirm__active-1">
                                    <FormattedMessage id="page.body.kyc.head.level.first"/>
                                    </span>
                                </div>
                                <div className="pg-confirm__progress-line-1" />
                                <div className="pg-confirm__progress-circle-2">
                                    <span className="pg-confirm__title-text pg-confirm__active-2">
                                    <FormattedMessage id="page.body.kyc.head.level.second"/>
                                    </span>
                                </div>
                                <div className="pg-confirm__progress-line-2" />
                                <div className="pg-confirm__progress-circle-3">
                                    <span className="pg-confirm__title-text pg-confirm__active-3">
                                    <FormattedMessage id="page.body.kyc.head.level.third"/>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="pg-confirm__content">
                            {VersionGuardWrapper(this.renderContent, Phone)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    //tslint:enable:jsx-no-multiline-js

    private handleCheckPendingLabels = (labels: Label[]) => {
        const { history, fetchAlert } = this.props;
        const labelsToCheck = [
            'email',
            'profile',
            'phone',
            'identity',
            'document',
            'questionnaire',
        ];

        const pendingLabel = labels.find(l => labelsToCheck.includes(l.key) && l.value === 'pending' && l.scope === 'private');

        if (pendingLabel) {
            fetchAlert({ message: [`resource.profile.${pendingLabel.key}`], type: 'error'});
            history.push('/profile');
        }
    }

    private renderContent = () => {
        const {
            history,
            labels,
            userData: { level },
            fetchAlert,
        } = this.props;

        if (!labels.length) {
            return null;
        }

        this.handleCheckPendingLabels(labels);

        if (level === 1) {
            return <ProfilePartial />;
        }

        if (level === 2) {
            return <Phone />;
        }

        if (level === 3) {
            const kycVerification = labels.find(label => label.key === 'document' && label.value === 'denied' && label.scope === 'private');

            if (kycVerification && !this.state.kycAlert) {
                fetchAlert({ message: ['resource.profile.kyc.denied'], type: 'error' });
                this.setState({
                    kycAlert: true,
                });
            }

            return <Idenfy />;
        }

        if (level === 4) {
            const documentsVerification = labels.find(label => label.key === 'document' && label.value === 'denied' && label.scope === 'private');

            if (documentsVerification && !this.state.documentsAlert) {
                fetchAlert({ message: ['resource.profile.document.denied'], type: 'error' });
                this.setState({
                    documentsAlert: true,
                });
            }

            return <Documents />;
        }

        if (level === 5) {
            return <Questionnaire />;
        }

        history.push('/profile');

        return null;
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    colorTheme: selectCurrentColorTheme(state),
    userData: selectUserInfo(state),
    labels: selectLabelData(state),
});

const mapDispatchToProps = dispatch => ({
    fetchAlert: payload => dispatch(alertPush(payload)),
    labelFetch: () => dispatch(labelFetch()),
});

// tslint:disable-next-line
export const ConfirmScreen = withRouter(connect(mapStateToProps, mapDispatchToProps)(ConfirmComponent) as any);
