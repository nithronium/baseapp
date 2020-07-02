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
    selectCurrentLanguage,
    selectLabelData,
    selectUserInfo,
    User,
} from '../../../modules';
import { changeUserLevel } from '../../../modules/user/profile';
import { BlockNationalityModal } from '../../components';
import { Documents } from '../../containers/Confirm/Documents';
import { Idenfy } from '../../containers/Confirm/Idenfy';
import { Phone } from '../../containers/Confirm/Phone';
import { ProfileAddress } from '../../containers/Confirm/ProfileAddress';
import { ProfilePartial } from '../../containers/Confirm/ProfilePartial';
import { Questionnaire } from '../../containers/Confirm/Questionnaire';
import { buildPath } from '../../helpers/buildPath';

import { getRedirectUrl, handleRedirectToConfirm, redirectIfSpecified } from '../../helpers';

interface ReduxProps {
    colorTheme: string;
    userData: User;
    labels: Label[];
    currentLanguage: string;
}

interface HistoryProps {
    history: History;
}

interface DispatchProps {
    changeUserLevel: typeof changeUserLevel;
    fetchAlert: typeof alertPush;
    labelFetch: typeof labelFetch;
}

interface ConfirmState {
    title: string;
    level: number;
    kycAlert: boolean;
    documentsAlert: boolean;
    showNationalityBlockModal: boolean;
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
            showNationalityBlockModal: false,
        };
    }

    public componentDidMount() {
        setDocumentTitle('Confirm');
        this.props.labelFetch();
        const { userData, history } = this.props;
        this.setState({
            level: userData.level,
        });
        if (history.location && history.location.state) {
            if (history.location.state.profileEdit) {
                handleRedirectToConfirm('profile', history);
            }
            if (history.location.state.addressEdit) {
                handleRedirectToConfirm('address', history);
            }
        } else {
            this.redirectByUserLevel()
        }
    }

    public redirectByUserLevel = () => {
        const { userData, history, currentLanguage } = this.props;

        switch (userData.level) {
            case 1: handleRedirectToConfirm('profilePartialStep', history);break;
            case 2: {
                handleRedirectToConfirm('phoneStep', history);
                break;
            }
            case 3: handleRedirectToConfirm('identifyStep', history);break;
            case 4: {
                if (userData.profile && userData.profile.address) {
                    const redirectUrl = getRedirectUrl();
                    if (redirectUrl && hasUrlForRedirect(redirectUrl)) {
                        console.log('ConfirmComponent redirect');
                        redirect(() => history.push(buildPath(redirectIfSpecified('/kyc-levels'), currentLanguage)));
                        return;
                    }
                    handleRedirectToConfirm('profAddressStep', history);
                } else {
                    handleRedirectToConfirm('addressStep', history);
                }
                // tslint:disable-next-line
            } break;
            case 5: handleRedirectToConfirm('questionnaireStep', history);break;

            default: handleRedirectToConfirm('', history);break;
        }
    };

    public goBack = event => {
      const lang = this.props.currentLanguage;
      event.preventDefault();
      this.props.history.push(buildPath(redirectIfSpecified('/kyc-levels'), lang));
    };

    public renderExpertProgressBar() {
        const { userData } = this.props;
        const currentProfileLevel = userData.level;
        const stepLabels = this.handleGetStepLabels(currentProfileLevel);
        const cx = classnames('pg-confirm__progress-items pg-confirm__center', {
            'pg-confirm__progress-first': currentProfileLevel === 1 || currentProfileLevel === 4,
            'pg-confirm__progress-second': [1,2,3,5].includes(currentProfileLevel),
        });
        return (
            <div className="pg-confirm__progress">
            <div className={cx}>
                <div className={`pg-confirm__progress-circle-1${currentProfileLevel === 5 ? ' active-circle' : ''}`}>
                    <span className="pg-confirm__title-text pg-confirm__active-1">
                    <FormattedMessage id={stepLabels[0]}/>
                    </span>
                </div>
            </div>
        </div>
        );
    }

    public renderStarterProgressBar() {
        const {
            history,
            userData } = this.props;
        const currentProfileLevel = userData.level;
        const stepLabels = this.handleGetStepLabels(currentProfileLevel);
        const profilePartialStep = history.location && history.location.state && history.location.state.profilePartialStep;
        const phoneStep = history.location && history.location.state && history.location.state.phoneStep;
        const identifyStep = history.location && history.location.state && history.location.state.identifyStep;
        const profileEdit = history.location && history.location.state && history.location.state.profileEdit;

        return (
            <div className="pg-confirm__progress">
                <div className="pg-confirm__progress-items pg-confirm__progress-items--long">
                    <div className={`pg-confirm__progress-circle-0`}>
                        <span className="pg-confirm__title-text pg-confirm__active-0">
                            <FormattedMessage id={stepLabels[0]}/>
                        </span>
                    </div>
                    <div className="pg-confirm__progress-line-1" />
                    <div className={`pg-confirm__progress-circle-1${(profilePartialStep || profileEdit) ? ' active-circle' : ''}`}>
                        <span className="pg-confirm__title-text pg-confirm__active-1">
                            <FormattedMessage id={stepLabels[1]}/>
                        </span>
                    </div>
                    <div className="pg-confirm__progress-line-2" />
                    <div className={`pg-confirm__progress-circle-2${phoneStep ? ' active-circle' : ''}`}>
                        <span className="pg-confirm__title-text pg-confirm__active-2">
                            <FormattedMessage id={stepLabels[2]}/>
                        </span>
                    </div>
                    <div className="pg-confirm__progress-line-3" />
                    <div className={`pg-confirm__progress-circle-3${identifyStep ? ' active-circle' : ''}`}>
                        <span className="pg-confirm__title-text pg-confirm__active-3">
                            <FormattedMessage id={stepLabels[3]}/>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
    public renderMasterProgressBar() {
        const { history, userData } = this.props;
        const currentProfileLevel = userData.level;
        const stepLabels = this.handleGetStepLabels(currentProfileLevel);
        const addressStep = history.location && history.location.state && history.location.state.addressStep;
        const profAddressStep = history.location && history.location.state && history.location.state.profAddressStep;

        return (
            <div className="pg-confirm__progress">
            <div className="pg-confirm__progress-items pg-confirm__progress-items--long">
                <div className={`pg-confirm__progress-circle-1${addressStep ? ' active-circle' : ''}`}>
                    <span className="pg-confirm__title-text pg-confirm__active-1">
                    <FormattedMessage id={stepLabels[0]}/>
                    </span>
                </div>
                <div className="pg-confirm__progress-line-1" />
                <div className={`pg-confirm__progress-circle-2${profAddressStep ? ' active-circle' : ''}`}>
                    <span className="pg-confirm__title-text pg-confirm__active-2">
                    <FormattedMessage id={stepLabels[1]}/>
                    </span>
                </div>
            </div>
        </div>
        );
    }

    public progressBarRender = userLvl => {
        const { history } = this.props;
        const editAddress = history.location && history.location.state && history.location.state.editAddress;
        const editProfile = history.location && history.location.state && history.location.state.editProfile;
        if (editAddress || editProfile) {
            return editProfile ? this.renderStarterProgressBar() : this.renderMasterProgressBar();
        } else {
            switch (userLvl) {
                case 0:
                case 1:
                case 2:
                case 3: return this.renderStarterProgressBar();
                case 4: return this.renderMasterProgressBar();
                case 5: return this.renderExpertProgressBar();
                default: return this.renderExpertProgressBar();
            }
        }

    };

    // tslint:disable:jsx-no-multiline-js
    public render() {
        const {
            colorTheme,
            // history,
            userData } = this.props;
        const { showNationalityBlockModal } = this.state;

        const currentProfileLevel = userData.level;
        // const isProfileEdit = history.location && history.location.state && history.location.state.profileEdit;

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
                        {this.progressBarRender(currentProfileLevel)}
                        <div className="pg-confirm__content">
                            {VersionGuardWrapper(this.renderContent, Phone)}
                        </div>
                    </div>
                </div>
                {showNationalityBlockModal ? (
                    <BlockNationalityModal
                        className="pg-block-nationality-modal"
                        toggleModal={this.handleToggleBlockNationalityModal}
                    />
                ) : null}
            </div>
        );
    }
    //tslint:enable:jsx-no-multiline-js

    private handleToggleBlockNationalityModal = () => {
        this.setState(prevState => ({
            showNationalityBlockModal: !prevState.showNationalityBlockModal,
        }));
    }

    private handleGetStepLabels = (currentProfileLevel: number): string[] => {
        const { history } = this.props;
        if (history.location && history.location.state) {
            if (history.location.state.profilePartialStep || history.location.state.phoneStep || history.location.state.identifyStep || history.location.state.profileEdit) {
                return ['page.body.kyc.head.level.first', 'page.body.kyc.head.level.second', 'page.body.kyc.head.level.third', 'page.body.kyc.head.level.fourth'];
            }

            if (history.location.state.addressStep || history.location.state.addressEdit) {
                return ['page.body.kyc.head.level.fifth.address', 'page.body.kyc.head.level.fifth'];
            }
        }

        switch (currentProfileLevel) {
            case 0:
            case 1:
            case 2:
            case 3:
                return ['page.body.kyc.head.level.first', 'page.body.kyc.head.level.second', 'page.body.kyc.head.level.third', 'page.body.kyc.head.level.fourth'];
            case 4:
                return ['page.body.kyc.head.level.fifth.address', 'page.body.kyc.head.level.fifth'];
            case 5:
            case 6:
                return ['page.body.kyc.head.level.sixth'];
            default:
                return ['page.body.kyc.head.level.first', 'page.body.kyc.head.level.second'];
        }
    }

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
            fetchAlert({ message: [`resource.profile.${pendingLabel.key}.pending`], type: 'error'});
            history.push(redirectIfSpecified('/kyc-levels'));
        }
    }

    private renderThirdLevel() {
        const {
            labels,
        } = this.props;
        const kycApproved = labels.find(label => label.key === 'identity' && label.value === 'approved' && label.scope === 'private');

        if (kycApproved) {
            this.props.changeUserLevel({ level: 4 });
            return <Documents />;
        }

        return <Idenfy />;
    }

    private renderFourthLevel() {
        const {
            labels,
            fetchAlert,
            history,
        } = this.props;


        const documentsVerification = labels.find(label => label.key === 'document' && label.value === 'rejected' && label.scope === 'private');

        if (documentsVerification && !this.state.documentsAlert) {
            fetchAlert({ message: ['resource.profile.document.denied'], type: 'error' });
            this.setState({
                documentsAlert: true,
            });
        }

        if (history.location && history.location.state && history.location.state.profAddressStep) {
            return <Documents />;
        }
        if (history.location && history.location.state && history.location.state.addressStep) {
            return <ProfileAddress />;
        }

        return null;
    }

    // @ts-ignore
    private renderContent = () => {
        const {
            history,
            labels,
            currentLanguage,
        } = this.props;
        if (!labels.length) {
            return null;
        }
        let locationState = '';
        if (history.location && history.location.state) {
            if (history.location.state.profilePartialStep) { locationState = 'profilePartialStep'; }
            if (history.location.state.addressEdit) { locationState = 'addressEdit'; }
            if (history.location.state.profileEdit) { locationState = 'profileEdit'; }
            if (history.location.state.phoneStep) { locationState = 'phoneStep'; }
            if (history.location.state.identifyStep) { locationState = 'identifyStep'; }
            if (history.location.state.addressStep) { locationState = 'addressStep'; }
            if (history.location.state.profAddressStep) { locationState = 'profAddressStep'; }
            if (history.location.state.questionnaireStep) { locationState = 'questionnaireStep'; }
        } else {
            this.redirectByUserLevel()
        }
        this.handleCheckPendingLabels(labels);
        if (locationState === 'profilePartialStep') {
            return <ProfilePartial toggleBlockNationalityModal={this.handleToggleBlockNationalityModal} />;
        }

        if (locationState === 'addressEdit') {
            return <ProfileAddress />;
        }

        if (locationState === 'profileEdit') {
            return <ProfilePartial toggleBlockNationalityModal={this.handleToggleBlockNationalityModal}  />;
        }

        if (locationState === 'profAddressEdit') {
            return <ProfileAddress />;
        }

        if (locationState === 'phoneStep') {
            return <Phone />;
        }

        if (locationState === 'identifyStep') {
            return this.renderThirdLevel();
        }

        if (['addressStep', 'profAddressStep'].includes(locationState)) {
            const redirectUrl = getRedirectUrl();
            if (redirectUrl && redirectUrl.indexOf('chatello') !== -1) {
                history.push(buildPath(redirectIfSpecified('/kyc-levels'), currentLanguage));
            }
            return this.renderFourthLevel();
        }
        if (locationState ===  'questionnaireStep') {
            return <Questionnaire />;
        }
        // history.push(redirectIfSpecified('/profile'));
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    colorTheme: selectCurrentColorTheme(state),
    userData: selectUserInfo(state),
    labels: selectLabelData(state),
    currentLanguage: selectCurrentLanguage(state),
});

const mapDispatchToProps = dispatch => ({
    changeUserLevel: payload => dispatch(changeUserLevel(payload)),
    fetchAlert: payload => dispatch(alertPush(payload)),
    labelFetch: () => dispatch(labelFetch()),
});

// tslint:disable-next-line
export const ConfirmScreen = withRouter(connect(mapStateToProps, mapDispatchToProps)(ConfirmComponent) as any);
