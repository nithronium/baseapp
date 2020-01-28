/* tslint:disable */
import * as React from 'react';
import { PasswordValidationDetails } from '.';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import './passwordValidationPopup.css';

interface Props extends InjectedIntlProps {
    passwordValidationDetails: PasswordValidationDetails;
    visible: boolean;
    passwordError: string;
}

export const PasswordValidationPopup: React.FC<Props> = injectIntl(({passwordValidationDetails, visible, passwordError, intl}) => {
    const translate = (value: string) => intl.formatMessage({ id: value });
    const passwordStrengthMessage = translate('page.signup.pwdvalidation.strength')
    const {
        isLengthAcceptable,
        hasDigits,
        hasCapitalLetters,
        hasLowerCaseLetters
    } = passwordValidationDetails;
    const lengtsValidActive = isLengthAcceptable ? 'active' : '';
    const lettersValidActive = hasCapitalLetters && hasLowerCaseLetters ? 'active' : '';
    const digitsValidActive = hasDigits ? 'active' : '';

    const indicatorSize = [
        lengtsValidActive,
        lettersValidActive,
        digitsValidActive
    ].reduce((ac, el) => el ? ac + 1 : ac, 0);

    return (
        <React.Fragment>
            <div id="pwd-validation-popup" className={`pwd-validation-popup ${visible ? 'active' : ''}`}>
                <h4 className="pwd-validation-popup-header">{translate('page.signup.pwdvalidation.header')}</h4>
                <ul>
                    <li
                        className={`pwd-validation-popup-list-item ${lengtsValidActive}`}
                    >
                        {translate('page.signup.pwdvalidation.length')}
                    </li>
                    <li
                        className={`pwd-validation-popup-list-item ${lettersValidActive}`}
                    >
                        {translate('page.signup.pwdvalidation.letters')}
                    </li>
                    <li
                        className={`pwd-validation-popup-list-item ${digitsValidActive}`}
                    >
                        {translate('page.signup.pwdvalidation.number')}
                    </li>
                </ul>
                <h4 className="pwd-validation-popup-indicator-label">{passwordStrengthMessage}</h4>
                <div className="pwd-validation-popup-indicator-wrapper">
                    <div className={`pwd-validation-popup-indicator-${indicatorSize}`}/>
                </div>
            </div>
            {passwordError && <div className={'cr-sign-up-form__error'}>{passwordError}</div>}
        </React.Fragment>
    );
});
