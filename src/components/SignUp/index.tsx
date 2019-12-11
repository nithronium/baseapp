import { Checkbox } from '@openware/components';
import cr from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { CustomInput } from '../';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../../helpers';
import { PasswordValidationPopup } from './PasswordValidationPopup';

export interface PasswordValidationDetails {
    isLengthAcceptable: boolean;
    hasDigits: boolean;
    hasCapitalLetters: boolean;
    hasLowerCaseLetters: boolean;
}

export interface SignUpFormProps {
    isLoading?: boolean;
    title?: string;
    onSignUp: () => void;
    onSignIn?: () => void;
    className?: string;
    image?: string;
    labelSignIn?: string;
    labelSignUp?: string;
    emailLabel?: string;
    passwordLabel?: string;
    confirmPasswordLabel?: string;
    referalCodeLabel?: string;
    corporateTextLink?: string;
    termsMessage?: string;
    refId: string;
    password: string;
    email: string;
    confirmPassword: string;
    handleChangeEmail: (value: string) => void;
    handleChangePassword: (value: string) => void;
    handleChangeConfirmPassword: (value: string) => void;
    handleChangeRefId: (value: string) => void;
    hasConfirmed: boolean;
    clickCheckBox: () => void;
    validateForm: () => void;
    emailError: string;
    passwordError: string;
    passwordValidationDetails?: PasswordValidationDetails;
    confirmationError: string;
    handleFocusEmail: () => void;
    handleFocusPassword: () => void;
    handleFocusConfirmPassword: () => void;
    handleFocusRefId: () => void;
    confirmPasswordFocused: boolean;
    refIdFocused: boolean;
    emailFocused: boolean;
    passwordFocused: boolean;
    captchaType: 'recaptcha' | 'geetest' | 'none';
    renderCaptcha: JSX.Element | null;
    reCaptchaSuccess: boolean;
    geetestCaptchaSuccess: boolean;
    captcha_response: string;
}

export class SignUpForm extends React.Component<SignUpFormProps> {
    public render() {
        const {
            email,
            password,
            confirmPassword,
            refId,
            onSignIn,
            image,
            isLoading,
            labelSignIn,
            labelSignUp,
            emailLabel,
            passwordLabel,
            confirmPasswordLabel,
            referalCodeLabel,
            termsMessage,
            hasConfirmed,
            emailError,
            passwordError,
            passwordValidationDetails,
            confirmationError,
            emailFocused,
            passwordFocused,
            confirmPasswordFocused,
            refIdFocused,
            corporateTextLink,
        } = this.props;

        const emailGroupClass = cr('cr-sign-up-form__group', {
            'cr-sign-up-form__group--focused': emailFocused,
        });

        const passwordGroupClass = cr('cr-sign-up-form__group', {
            'cr-sign-up-form__group--focused': passwordFocused,
        });

        const confirmPasswordGroupClass = cr('cr-sign-up-form__group', {
            'cr-sign-up-form__group--focused': confirmPasswordFocused,
        });
        const refIdGroupClass = cr('cr-sign-up-form__group', {
            'cr-sign-up-form__group--focused': refIdFocused,
        });
        const termsLink = termsMessage ? (
            <div className="cr-sign-up-form__terms-link">
                {termsMessage.split(':')[0]} <a href="/terms">{termsMessage.split(':')[1]}</a>
            </div>
        ) : null;
        const logo = image ? (
            <h1 className="cr-sign-up-form__title">
                <img className="cr-sign-up-form__image" src={image} alt="logo" />
            </h1>
        ) : null;

        return (
            <form>
                <div className="cr-sign-up-form">
                    <div className="cr-sign-up-form__options-group">
                        <div className="cr-sign-up-form__option">
                            <div className="cr-sign-up-form__option-inner cr-sign-in-form__tab-signin" onClick={onSignIn}>
                                {labelSignIn ? labelSignIn : 'Sign In'}
                            </div>
                        </div>
                        <div className="cr-sign-up-form__option">
                            <div className="cr-sign-up-form__option-inner __selected">
                                {labelSignUp ? labelSignUp : 'Sign Up'}
                            </div>
                        </div>
                    </div>
                    <div className="cr-sign-up-form__form-content">
                        {logo}
                        <div className={emailGroupClass}>
                            <CustomInput
                                type="email"
                                label={emailLabel || 'Email'}
                                placeholder={emailLabel || 'Email'}
                                defaultLabel="Email"
                                handleChangeInput={this.props.handleChangeEmail}
                                inputValue={email}
                                handleFocusInput={this.props.handleFocusEmail}
                                classNameLabel="cr-sign-up-form__label"
                                classNameInput="cr-sign-up-form__input"
                                autoFocus={true}
                            />
                            {emailError && <div className="cr-sign-up-form__error">{emailError}</div>}
                        </div>
                        <div className={passwordGroupClass}>
                            <CustomInput
                                type="password"
                                label={passwordLabel || 'Password'}
                                placeholder={passwordLabel || 'Password'}
                                defaultLabel="Password"
                                handleChangeInput={this.props.handleChangePassword}
                                inputValue={password}
                                handleFocusInput={this.props.handleFocusPassword}
                                classNameLabel="cr-sign-up-form__label"
                                classNameInput="cr-sign-up-form__input"
                                autoFocus={false}
                            />
                            {!passwordValidationDetails && passwordError && <div className={'cr-sign-up-form__error'}>{passwordError}</div>}
                            {passwordValidationDetails && <PasswordValidationPopup visible={!!password} passwordError={passwordError} passwordValidationDetails={passwordValidationDetails} />}
                        </div>
                        <div className={confirmPasswordGroupClass}>
                            <CustomInput
                                type="password"
                                label={confirmPasswordLabel || 'Confirm Password'}
                                placeholder={confirmPasswordLabel || 'Confirm Password'}
                                defaultLabel="Confirm Password"
                                handleChangeInput={this.props.handleChangeConfirmPassword}
                                inputValue={confirmPassword}
                                handleFocusInput={this.props.handleFocusConfirmPassword}
                                classNameLabel="cr-sign-up-form__label"
                                classNameInput="cr-sign-up-form__input"
                                autoFocus={false}
                            />
                            {confirmationError && <div className={'cr-sign-up-form__error'}>{confirmationError}</div>}
                        </div>
                        <div className={refIdGroupClass}>
                            <CustomInput
                                type="text"
                                label={referalCodeLabel || 'Referral code'}
                                placeholder={referalCodeLabel || 'Referral code'}
                                defaultLabel="Referral code"
                                handleChangeInput={this.props.handleChangeRefId}
                                inputValue={refId}
                                handleFocusInput={this.props.handleFocusRefId}
                                classNameLabel="cr-sign-up-form__label"
                                classNameInput="cr-sign-up-form__input"
                                autoFocus={false}
                            />
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                        <Checkbox
                            checked={hasConfirmed}
                            className="cr-sign-up-form__checkbox"
                            onChange={this.props.clickCheckBox}
                            label={''}
                            // label={termsMessage ? termsMessage : 'I  agree all statements in '}
                        />
                            {termsLink}
                        </div>
                        {this.props.renderCaptcha}
                        <div className="cr-sign-up-form__button-wrapper">
                        <Button
                                block={true}
                                type="button"
                                disabled={this.disableButton()}
                                onClick={e => this.handleClick(e)}
                                size="lg"
                                variant="primary"
                            >
                                {isLoading ? 'Loading...' : (labelSignUp ? labelSignUp : 'Sign up')}
                            </Button>
                            <a className="cr-sign-up-form__corporate-link" key="ru" rel="alternate noopener noreferrer" href={'https://kb.emirex.com/corporate_account_verification'} hrefLang="ru" title={corporateTextLink} target="_blank">{corporateTextLink}</a>
                        </div>
                    </div>
                </div>
            </form>
        );
    }

    private disableButton = (): boolean => {
        const {
            email,
            password,
            confirmPassword,
            hasConfirmed,
            reCaptchaSuccess,
            isLoading,
            captchaType,
            geetestCaptchaSuccess,
        } = this.props;

        if (!hasConfirmed || isLoading || !email.match(EMAIL_REGEX) || !password || !confirmPassword) {
            return true;
        }
        if (captchaType === 'recaptcha' && !reCaptchaSuccess) {
            return true;
        }
        if (captchaType === 'geetest' && !geetestCaptchaSuccess) {
            return true;
        }
        return false;
    };

    private handleSubmitForm() {
        this.props.onSignUp();
    }

    private isValidForm() {
        const { email, password, confirmPassword } = this.props;
        const isEmailValid = email.match(EMAIL_REGEX);
        const isPasswordValid = password.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = password === confirmPassword;

        return email && isEmailValid && (password && isPasswordValid) && (confirmPassword && isConfirmPasswordValid);
    }

    private handleClick = (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (e) {
            e.preventDefault();
        }
        if (!this.isValidForm()) {
            this.props.validateForm();
        } else {
            this.handleSubmitForm();
        }
    };
}
