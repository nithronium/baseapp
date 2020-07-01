import { Button } from '@openware/components';
import cr from 'classnames';
import { History } from 'history';
import * as React from 'react';
import {
    FormattedMessage,
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  CustomInput,
  Modal,
} from '../../../components';
import { ProfileTwoFactorAuth } from '../../../containers/ProfileTwoFactorAuth';
import {
    PASSWORD_REGEX,
} from '../../../helpers';
import {
    openGuardModal,
    RootState,
    selectUserInfo,
    User,
} from '../../../modules';
import {
    changePasswordFetch,
    selectChangePasswordSuccess,
} from '../../../modules/user/profile';
import { PencilIcon } from '../../assets/images/PencilIcon';
import { buildPath, handleRedirectToConfirm } from '../../helpers';


interface ReduxProps {
    user: User;
    passwordChangeSuccess?: boolean;
}

interface RouterProps {
    history: History;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}

interface DispatchProps {
    changePassword: typeof changePasswordFetch;
    clearPasswordChangeError: () => void;
    openGuardModal: typeof openGuardModal;
}

interface ProfileProps {
    showModal: boolean;
}

interface State {
    showChangeModal: boolean;
    showModal: boolean;
    oldPassword: string;
    newPassword: string;
    confirmationPassword: string;
    oldPasswordFocus: boolean;
    newPasswordFocus: boolean;
    confirmPasswordFocus: boolean;
    isConfirm2faOpen: boolean;
}

type Props = ReduxProps & DispatchProps & RouterProps & ProfileProps & InjectedIntlProps & OnChangeEvent;

// tslint:disable:jsx-no-lambda
class ProfileAuthDetailsComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showChangeModal: false,
            showModal: false,
            oldPassword: '',
            newPassword: '',
            confirmationPassword: '',
            oldPasswordFocus: false,
            newPasswordFocus: false,
            confirmPasswordFocus: false,
            isConfirm2faOpen: false,
        };
    }

    public componentWillReceiveProps(next: Props) {
        if (next.passwordChangeSuccess) {
            this.setState({
                showChangeModal: false,
                oldPassword: '',
                newPassword: '',
                confirmationPassword: '',
                confirmPasswordFocus: false,
            });
        }
    }

    public render() {
        const {
            user,
        } = this.props;
        const {
            oldPasswordFocus,
            newPasswordFocus,
            confirmationPassword,
            oldPassword,
            newPassword,
            confirmPasswordFocus,
        } = this.state;

        const oldPasswordClass = cr('cr-email-form__group', {
            'cr-email-form__group--focused': oldPasswordFocus,
        });

        const newPasswordClass = cr('cr-email-form__group', {
            'cr-email-form__group--focused': newPasswordFocus,
        });

        const confirmPasswordClass = cr('cr-email-form__group', {
            'cr-email-form__group--focused': confirmPasswordFocus,
        });

        const changeModalBody = (
            <div className="cr-email-form__form-content">
                <div className={oldPasswordClass}>
                    <CustomInput
                        type="password"
                        label={this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.old'})}
                        placeholder={this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.old'})}
                        defaultLabel="Old password"
                        handleChangeInput={this.handleOldPassword}
                        inputValue={oldPassword}
                        handleFocusInput={this.handleFieldFocus('oldPassword')}
                        classNameLabel="cr-email-form__label"
                        classNameInput="cr-email-form__input"
                        autoFocus={true}
                    />
                </div>
                <div className={newPasswordClass}>
                    <CustomInput
                        type="password"
                        label={this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.new'})}
                        placeholder={this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.new'})}
                        defaultLabel="New password"
                        handleChangeInput={this.handleNewPassword}
                        inputValue={newPassword}
                        handleFocusInput={this.handleFieldFocus('newPassword')}
                        classNameLabel="cr-email-form__label"
                        classNameInput="cr-email-form__input"
                        autoFocus={false}
                    />
                </div>
                <div className={confirmPasswordClass}>
                    <CustomInput
                        type="password"
                        label={this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.conf'})}
                        placeholder={this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.conf'})}
                        defaultLabel="Password confirmation"
                        handleChangeInput={this.handleConfPassword}
                        inputValue={confirmationPassword}
                        handleFocusInput={this.handleFieldFocus('confirmationPassword')}
                        classNameLabel="cr-email-form__label"
                        classNameInput="cr-email-form__input"
                        autoFocus={false}
                    />
                </div>
                <div className="cr-email-form__button-wrapper">
                    <button
                        type="button"
                        className={this.isValidForm() ? 'cr-email-form__button' : 'cr-email-form__button cr-email-form__button--disabled'}
                        disabled={!this.isValidForm()}
                    >
                        {this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.button.change'})}
                    </button>
                </div>
            </div>
        );

        const modal = this.state.showChangeModal ? (
            <div className="cr-modal">
              <form className="cr-email-form" onSubmit={this.handleChangePassword}>
                <div className="pg-change-password-screen">
                  {this.renderChangeModalHeader()}
                  {changeModalBody}
                </div>
              </form>
            </div>
        ) : null;

        return (
            <div className="pg-profile-page__box pg-profile-page__left-col__basic">
                <div className="pg-profile-page__box-header pg-profile-page__left-col__basic__info-row">
                    <div className="pg-profile-page__left-col__basic__info-row__block">
                        <div className="pg-profile-page__row pg-profile-page__details-user">
                            <p>{user.email}</p>
                        </div>
                        <div className="pg-profile-page__row">
                            <h2>UID: {user.uid}</h2>
                        </div>
                        <div className="pg-profile-page__details-user__edit">
                            {user.level === 2 || user.level === 3 ? this.renderEditProfileLink() : null}
                            {user.level === 4 ? this.renderEditAddressLink() : null}
                        </div>
                    </div>
                </div>
                <div className="pg-profile-page__row">
                    <div>
                        <div className="pg-profile-page__label">
                            {this.props.intl.formatMessage({ id: 'page.body.profile.header.account.content.password'})}
                        </div>
                        <div>
                            ************
                        </div>
                    </div>
                    <button
                        className="cr-button pg-profile-page__btn-secondary-change"
                        onClick={this.showChangeModal}
                    >
                        {this.props.intl.formatMessage({ id: 'page.body.profile.header.account.content.password.button.change'})}
                    </button>
                    {modal}
                </div>
                {this.renderProfileTwoFactor()}

                <div className="profile-2fa-mfa-popup">
                    <Modal
                        show={this.state.showModal}
                        header={this.renderModalHeader()}
                        content={this.renderModalBody()}
                        footer={this.renderModalFooter()}
                    />

                    <Modal
                        show={this.state.isConfirm2faOpen}
                        header={this.renderConfirm2faHeader()}
                        content={this.renderConfirm2faBody()}
                        footer={this.renderConfirm2faFooter()}
                    />
                </div>
            </div>
        );
    }

    private renderConfirm2faHeader = () => {
        return (
            <div className="mfa-popup-header">
                {this.props.intl.formatMessage({ id: 'page.body.profile.header.account.auth2fa.mfa.header'})}
                <div
                    className="mfa-popup-close-button"
                    onClick={this.cancel2fa}
                >
                    ✕
                </div>
            </div>
        );
    };

    private renderConfirm2faBody = () => {
        const keys = new Array(15).fill(1).map((e, index) => index + 1).slice(1);
        const isMarked = (index: number) => [3, 5, 7, 9, 11, 13, 15].includes(index);
        const locale = location.pathname.includes('/ru') ? 'ru' : (location.pathname.includes('/zh') ? 'zh' : 'en');
        const breaks = {
            en: [3, 5, 9],
            ru: [3, 7],
            zh: [3, 9],
        }[locale];
        const hasBreakAfter = (index: number) => breaks.includes(index);
        return (
            <div>
                <div className="popup-content__spacer" />
                <div className="popup-content__spacer" />
                <div key={1} className="popup-content-item popup-content-item--header">
                    {this.props.intl.formatMessage({ id: `page.body.profile.header.account.auth2fa.mfa.text1`})}
                </div>
                <div className="popup-content__spacer" />
                {keys.map(key => {
                    const message = this.props.intl.formatMessage({ id: `page.body.profile.header.account.auth2fa.mfa.text${key}`});
                    return (
                        <>
                            <div key={key} className="popup-content-item">
                                {
                                    isMarked(key) ?
                                        <span>{message}</span> :
                                        message
                                }
                            </div>
                            {hasBreakAfter(key) ? <div className="popup-content__spacer" /> : null}
                        </>
                    );
                })}
            </div>
        );
    };

    private renderConfirm2faFooter = () => {
        return (
            <div className="auth2fa-mfa-footer">
                <button
                    className="cr-button pg-profile-page__btn-secondary-change"
                    onClick={this.goTo2fa}
                >
                    {this.props.intl.formatMessage({ id: 'page.body.kyc.confirm'})}
                </button>
            </div>
        );
    };

    private renderEditProfileLink() {
        return (
            <span onClick={() => handleRedirectToConfirm('profilePartialStep', this.props.history)}>
                {this.props.intl.formatMessage({ id: 'page.body.profile.header.account.content.profile.edit'})}
                <PencilIcon />
            </span>
        );
    }

    private renderEditAddressLink() {
        return (
            <span onClick={() => handleRedirectToConfirm('addressStep', this.props.history)}>
                {this.props.intl.formatMessage({ id: 'page.body.profile.header.account.content.address.edit'})}
                <PencilIcon />
            </span>
        );
    }

    private renderProfileTwoFactor = () => {
        return (
            <div className="pg-profile-page__row">
                <ProfileTwoFactorAuth is2faEnabled={this.props.user.otp} navigateTo2fa={this.handleNavigateTo2fa}/>
            </div>
        );
    };

    private renderModalHeader = () => {
        return (
            <div className="pg-exchange-modal-submit-header">
                <FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication.modalHeader"/>
            </div>
        );
    };

    private renderModalBody = () => {
        return (
            <div className="pg-exchange-modal-submit-body">
                <h2>
                    <FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication.modalBody"/>
                </h2>
            </div>
        );
    };

    private renderModalFooter = () => {
        return (
            <div className="pg-exchange-modal-submit-footer">
                <Button
                    className="pg-exchange-modal-submit-footer__button-inverse"
                    label="OK"
                    onClick={this.closeModal}
                />
            </div>
        );
    };

    private renderChangeModalHeader = () => (
        <div className="cr-email-form__options-group">
            <div className="cr-email-form__option">
              <div className="cr-email-form__option-inner">
                  <FormattedMessage id="page.body.profile.header.account.content.password.change"/>
                  <div className="cr-email-form__cros-icon" onClick={this.handleCancel}>
                      <img src={require('./close.svg')}/>
                  </div>
              </div>
            </div>
        </div>
    );

    private handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        this.props.changePassword({
            old_password: this.state.oldPassword,
            new_password: this.state.newPassword,
            confirm_password: this.state.confirmationPassword,
        });
    };

    private closeModal = () => {
        this.setState({
            showModal: false,
        });
      };

    private showChangeModal = () => {
        this.setState({
            showChangeModal: true,
        });
    }

    private cancel2fa = () => {
        this.setState({ isConfirm2faOpen: false });
    };

    private goTo2fa = () => {
        const lang = localStorage.getItem('lang_code') || 'en';
        this.props.history.push(buildPath('/security/2fa', lang), { enable2fa: true });
    };

    private handleNavigateTo2fa = (enable2fa: boolean) => {
        if (enable2fa) {
            this.setState({ isConfirm2faOpen: true });
        } else {
            this.setState({
                showModal: !this.state.showModal,
            });
        }
    }

    private handleOldPassword = (value: string) => {
        this.setState({
            oldPassword: value,
        });
    }

    private handleConfPassword = (value: string) => {
        this.setState({
            confirmationPassword: value,
        });
    }

    private handleNewPassword = (value: string) => {
        this.setState({
            newPassword: value,
        });
    }

    private handleCancel = () => {
        this.setState({
            showChangeModal: false,
            oldPassword: '',
            newPassword: '',
            confirmationPassword: '',
        });
    }

    private handleFieldFocus = (field: string) => {
        return () => {
            switch (field) {
                case 'oldPassword':
                    this.setState({
                        oldPasswordFocus: !this.state.oldPasswordFocus,
                    });
                    break;
                case 'newPassword':
                    this.setState({
                        newPasswordFocus: !this.state.newPasswordFocus,
                    });
                    break;
                case 'confirmationPassword':
                    this.setState({
                        confirmPasswordFocus: !this.state.confirmPasswordFocus,
                    });
                    break;
                default:
                    break;
            }
        };
    }

    private isValidForm() {
        const {
            confirmationPassword,
            oldPassword,
            newPassword,
        } = this.state;
        const isNewPasswordValid = newPassword.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = newPassword === confirmationPassword;

        return oldPassword && isNewPasswordValid && isConfirmPasswordValid;
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
    passwordChangeSuccess: selectChangePasswordSuccess(state),
});

const mapDispatchToProps = dispatch => ({
    changePassword: ({ old_password, new_password, confirm_password }) =>
        dispatch(changePasswordFetch({ old_password, new_password, confirm_password })),
    openGuardModal: () => dispatch(openGuardModal()),
});

const ProfileAuthDetailsConnected = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ProfileAuthDetailsComponent));
// tslint:disable-next-line:no-any
const ProfileAuthDetails = withRouter(ProfileAuthDetailsConnected as any);

export {
    ProfileAuthDetails,
};
