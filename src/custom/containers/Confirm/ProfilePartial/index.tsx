import { Button } from '@openware/components';
import cr from 'classnames';
import { History } from 'history';
import countries = require('i18n-iso-countries');
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import MaskInput from 'react-maskinput';
import {
  connect,
  MapDispatchToPropsFunction,
} from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { formatDate, isDateInFuture } from '../../../../helpers';
import {
    alertPush,
    editIdentity,
    labelFetch,
    RootState,
    selectCurrentLanguage,
    selectEditIdentityData,
    selectEditIdentitySuccess,
    selectSendIdentityData,
    selectUserInfo,
    User,
} from '../../../../modules';
import {
    selectSendIdentitySuccess,
    sendIdentity,
} from '../../../../modules/user/kyc/identity';
import { IdentityData } from '../../../../modules/user/kyc/identity/types';
import { changeUserLevel, changeUserProfileData } from '../../../../modules/user/profile';
import { Dropdown } from '../../../components';
import { DISALLOWED_COUNTRIES } from '../../../constants';
import { handleRedirectToConfirm } from '../../../helpers';
import { isValidDate } from '../../../helpers/checkDate';


interface ReduxProps {
    editData?: IdentityData;
    editSuccess?: string;
    lang: string;
    sendData?: IdentityData;
    sendSuccess?: string;
    user: User;
}

interface DispatchProps {
    changeUserLevel: typeof changeUserLevel;
    editIdentity: typeof editIdentity;
    fetchAlert: typeof alertPush;
    labelFetch: typeof labelFetch;
    sendIdentity: typeof sendIdentity;
}

interface OwnProps {
    toggleBlockNationalityModal: () => void;
}

interface HistoryProps {
    history: History;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}

interface State {
    countryOfBirth: string;
    dateOfBirth: string;
    firstName: string;
    lastName: string;
    metadata: {
        nationality: string,
    };
    dateOfBirthFocused: boolean;
    firstNameFocused: boolean;
    lastNameFocused: boolean;
    dateOfBirthValid: boolean;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps & RouterProps & HistoryProps & OwnProps;

// tslint:disable jsx-no-lambda no-submodule-imports
class ProfilePartialComponent extends React.Component<Props, State> {
    public state = {
        countryOfBirth: '',
        dateOfBirth: '',
        firstName: '',
        lastName: '',
        metadata: {
            nationality: '',
        },
        dateOfBirthFocused: false,
        firstNameFocused: false,
        lastNameFocused: false,
        dateOfBirthValid: false,
    };

    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };

    public componentDidUpdate(prev: Props) {
        const {
            editData,
            editSuccess,
            sendData,
            sendSuccess,
            user,
            history,
        } = this.props;

        // const redirectUrl = getRedirectUrl();
        // let url = '/kys-levels';
        // if (redirectUrl && typeof redirectUrl === 'string' && redirectUrl.indexOf('chatello') !== 0) {
        //     url = buildUrlWithRedirect('/confirm');
        // }

        if (!prev.sendSuccess && sendSuccess) {
            this.props.changeUserLevel({ level: +user.level + 1 });
            this.props.labelFetch();
            if (sendData) {
                this.props.changeUserProfileData(sendData);
            }
            handleRedirectToConfirm('phoneStep', history);
        }

        if (!prev.editSuccess && editSuccess) {
            this.props.changeUserLevel({ level: +user.level + 1 });
            this.props.labelFetch();
            if (editData) {
                this.props.changeUserProfileData(editData);
            }
            handleRedirectToConfirm('phoneStep', history);
        }
    }
//tslint:disable
    public componentDidMount() {
        this.updateUserProfileInfo();
    }

    public updateUserProfileInfo = () => {
        const { user } = this.props;
        const { firstName, lastName, dateOfBirth, countryOfBirth, metadata = {nationality: ''} } = this.state;
        if (user.profile) {
            if (user.profile.first_name && user.profile.first_name !== firstName) {
                this.setState({
                    firstName: user.profile.first_name,
                });
            }

            if (user.profile.last_name && user.profile.last_name !== lastName) {
                this.setState({
                    lastName: user.profile.last_name,
                });
            }

            if (user.profile.dob) {
                const tmp = user.profile.dob.split('-').reverse().join('/');
                if (tmp !== dateOfBirth) {
                    this.setState({
                        dateOfBirth: tmp,
                        dateOfBirthValid: true,
                    });
                }
            }

            if (user.profile.country && user.profile.country !== countryOfBirth) {
                this.setState({
                    countryOfBirth: user.profile.country,
                });
            }
            const currentNationality = user.profile.metadata && JSON.parse(user.profile.metadata).nationality;
            if (currentNationality && currentNationality !== metadata.nationality) {
                this.setState({
                    metadata: {
                        nationality: currentNationality,
                    },
                });
            }
        }
    };

    public render() {
        const { lang } = this.props;
        const {
            dateOfBirth,
            firstName,
            lastName,
            dateOfBirthFocused,
            firstNameFocused,
            lastNameFocused,
            countryOfBirth,
            metadata,
        } = this.state;


        const dateOfBirthGroupClass = cr('pg-confirm__content-profile-partial-col-row-content', {
            'pg-confirm__content-identity-col-row-content--focused': dateOfBirthFocused,
        });

        const firstNameGroupClass = cr('pg-confirm__content-profile-partial-col-row-content', {
            'pg-confirm__content-profile-partial-col-row-content--focused': firstNameFocused,
            'pg-confirm__content-profile-partial-col-row-content--wrong': firstName && !this.handleValidateInput('firstName', firstName),
        });

        const lastNameGroupClass = cr('pg-confirm__content-profile-partial-col-row-content', {
            'pg-confirm__content-profile-partial-col-row-content--focused': lastNameFocused,
            'pg-confirm__content-profile-partial-col-row-content--wrong': lastName && !this.handleValidateInput('lastName', lastName),
        });

        countries.registerLocale(require('i18n-iso-countries/langs/en.json'));
        countries.registerLocale(require('i18n-iso-countries/langs/ru.json'));
        countries.registerLocale(require('i18n-iso-countries/langs/zh.json'));

        const listOfCountries = countries.getNames(lang);
        const dataCountries = Object.values(listOfCountries);
        const chosenCountry = countries.getName(countryOfBirth, lang);
        const chosenNationality = countries.getName(metadata.nationality, lang);

        return (
            <div className="pg-confirm__content-profile-partial">
              <div className="pg-confirm__content-profile-partial-forms">
                  <div className="pg-confirm__content-profile-partial-col">
                      <div className="pg-confirm__content-profile-partial-col-row">
                        <fieldset className={firstNameGroupClass}>
                            {firstName && <legend>{this.translate('page.body.kyc.identity.firstName')}</legend>}
                                <input
                                    className="pg-confirm__content-profile-partial-col-row-content-number"
                                    type="string"
                                    placeholder={this.translate('page.body.kyc.identity.firstName')}
                                    value={firstName}
                                    onChange={this.handleChange('firstName')}
                                    onFocus={this.handleFieldFocus('firstName')}
                                    onBlur={this.handleFieldFocus('firstName')}
                                    autoFocus={true}
                                />
                        </fieldset>
                      </div>
                      <div className="pg-confirm__content-profile-partial-col-row">
                          <fieldset className={lastNameGroupClass}>
                              {lastName && <legend>{this.translate('page.body.kyc.identity.lastName')}</legend>}
                                  <input
                                      className="pg-confirm__content-profile-partial-col-row-content-number"
                                      type="string"
                                      placeholder={this.translate('page.body.kyc.identity.lastName')}
                                      value={lastName}
                                      onChange={this.handleChange('lastName')}
                                      onFocus={this.handleFieldFocus('lastName')}
                                      onBlur={this.handleFieldFocus('lastName')}
                                  />
                          </fieldset>
                      </div>
                      <div className="pg-confirm__content-profile-partial-col-row">
                          <div className="pg-confirm__content-profile-partial-col-row-content">
                              <div className="pg-confirm__content-profile-partial-col-row-content-label">
                                  {countryOfBirth && this.translate('page.body.kyc.identity.CoR')}
                              </div>
                              <Dropdown
                                  className="pg-confirm__content-documents-col-row-content-number"
                                  list={dataCountries}
                                  onSelect={value => this.selectCountry(listOfCountries, value)}
                                  placeholder={chosenCountry || countryOfBirth || this.translate('page.body.kyc.identity.CoR')}
                              />
                          </div>
                      </div>
                      <div className="pg-confirm__content-profile-partial-col-row">
                          <div className="pg-confirm__content-profile-partial-col-row-content">
                              <div className="pg-confirm__content-profile-partial-col-row-content-label">
                                  {metadata.nationality && this.translate('page.body.kyc.identity.nationality')}
                              </div>
                              <Dropdown
                                  className="pg-confirm__content-documents-col-row-content-number"
                                  list={dataCountries}
                                  onSelect={value => this.selectNationality(listOfCountries, value)}
                                  placeholder={chosenNationality || metadata.nationality || this.translate('page.body.kyc.identity.nationality')}
                              />
                          </div>
                      </div>
                      <div className="pg-confirm__content-profile-partial-col-row">
                          <fieldset className={dateOfBirthGroupClass}>
                              {dateOfBirth && <legend>{this.translate('page.body.kyc.identity.dateOfBirth')}</legend>}
                              <MaskInput
                                  className="pg-confirm__content-profile-partial-col-row-content-number dob-field"
                                  maskString="00/00/0000"
                                  mask="00/00/0000"
                                  onChange={this.handleChangeDate}
                                  onFocus={this.handleFieldFocus('dateOfBirth')}
                                  onBlur={this.handleFieldFocus('dateOfBirth')}
                                  value={dateOfBirth}
                                  placeholder={this.translate('page.body.kyc.identity.dateOfBirth')}
                              />
                          </fieldset>
                      </div>
                      <div className="pg-confirm__content-profile-partial-col-row" />
                  </div>
                </div>
                <div className="pg-confirm__content-deep">
                    <Button
                        className="pg-confirm__content-phone-deep-button"
                        label={this.translate('page.body.kyc.next')}
                        onClick={this.sendData}
                        disabled={this.handleCheckButtonDisabled()}
                    />
                </div>
            </div>
        );
    }

    private scrollToElement = (displayedElem: number) => {
            const element: HTMLElement = document.getElementsByClassName('pg-confirm__content-profile-partial-col-row')[displayedElem] as HTMLElement;
            element && element.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'});
    }

    private handleFieldFocus = (field: string) => {
        return () => {
            switch (field) {
                case 'dateOfBirth':
                    this.setState({
                        dateOfBirthFocused: !this.state.dateOfBirthFocused,
                    });
                    this.scrollToElement(2);
                    break;
                case 'firstName':
                    this.setState({
                        firstNameFocused: !this.state.firstNameFocused,
                    });
                    this.scrollToElement(0);
                    break;
                case 'lastName':
                    this.setState({
                        lastNameFocused: !this.state.lastNameFocused,
                    });
                    this.scrollToElement(1);
                    break;
                default:
                    break;
            }

        };
    }

    private handleChange = (key: string) => {
        return (e: OnChangeEvent) => {
            // @ts-ignore
            this.setState({
                [key]: e.target.value,
            });
        };
    };

    private handleChangeDate = (e: OnChangeEvent) => {
        this.setState({
            dateOfBirth: formatDate(e.target.value),
        });

        const fieldMaxLength = 10;

        if (e.target.value.length === fieldMaxLength) {
            const currentDate = new Date();
            const dateToCompare = currentDate.setFullYear(currentDate.getFullYear() - 18);

            if (!isValidDate(formatDate(e.target.value), dateToCompare) && !isDateInFuture(formatDate(e.target.value))) {
                this.setState({
                    dateOfBirthValid: true,
                });
            } else {
                this.props.fetchAlert({ message: ['resource.profile.dateOfBirth'], type: 'error'});
                this.setState({
                    dateOfBirthValid: false,
                });
            }
        } else {
            this.setState({
                dateOfBirthValid: false,
            });
        }
    };

    private selectNationality = (listOfCountries: countries.LocalizedCountryNames, value: number) => {
        if (DISALLOWED_COUNTRIES.includes(Object.keys(listOfCountries)[value])) {
            this.props.toggleBlockNationalityModal();
            return;
        }

        this.setState({
            metadata: { nationality: countries.getAlpha2Code(Object.values(listOfCountries)[value], this.props.lang) },
        });
    };

    private selectCountry = (listOfCountries: countries.LocalizedCountryNames, value: number) => {
        if (DISALLOWED_COUNTRIES.includes(Object.keys(listOfCountries)[value])) {
            this.props.toggleBlockNationalityModal();
            return;
        }

        this.setState({
            countryOfBirth: countries.getAlpha2Code(Object.values(listOfCountries)[value], this.props.lang),
        });
    };

    private handleValidateInput = (field: string, value: string): boolean => {
        switch (field) {
            case 'firstName':
                const firstNameRegex = new RegExp(`^[a-zA-Z]{1,100}$`);
                return value.match(firstNameRegex) ? true : false;
            case 'lastName':
                const lastNameRegex = new RegExp(`^[a-zA-Z]{1,100}$`);
                return value.match(lastNameRegex) ? true : false;
            default:
                return true;
        }
    }

    private handleCheckButtonDisabled = () => {
        const {
            dateOfBirth,
            dateOfBirthValid,
            firstName,
            lastName,
            countryOfBirth,
            metadata,
        } = this.state;

        const firstNameValid = this.handleValidateInput('firstName', firstName);
        const lastNameValid = this.handleValidateInput('lastName', lastName);

        return (
            !firstNameValid
            || !lastNameValid
            || !dateOfBirth
            || !dateOfBirthValid
            || !metadata.nationality
            || !countryOfBirth
        );
    }

    private sendData = () => {
        const { user } = this.props;
        const {
            countryOfBirth,
            dateOfBirth,
            firstName,
            lastName,
            metadata,
        } = this.state;
        const dob = !isDateInFuture(dateOfBirth) ? dateOfBirth : '';

        let profileInfo = {};

        if (user.profile && user.profile.address) {
            const currentUserState = user.profile.metadata && JSON.parse(user.profile.metadata).state;

            profileInfo = {
                first_name: firstName,
                last_name: lastName,
                dob,
                country: countryOfBirth,
                address: user.profile.address,
                postcode: user.profile.postcode,
                city: user.profile.city,
                metadata: JSON.stringify({
                    nationality: metadata.nationality,
                    state: currentUserState,
                }),
            };
        } else {
            profileInfo = {
                first_name: firstName,
                last_name: lastName,
                dob,
                country: countryOfBirth,
                metadata: JSON.stringify(metadata),
            };
        }

        // tslint:disable-next-line: prefer-switch
        if ((user.level === 2 || user.level === 3 || user.level === 4) || user.profile) {
            this.props.editIdentity(profileInfo);
        } else {
            this.props.sendIdentity(profileInfo);
        }
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    sendData: selectSendIdentityData(state),
    editData: selectEditIdentityData(state),
    editSuccess: selectEditIdentitySuccess(state),
    lang: selectCurrentLanguage(state),
    sendSuccess: selectSendIdentitySuccess(state),
    user: selectUserInfo(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        changeUserProfileData: payload => dispatch(changeUserProfileData(payload)),
        changeUserLevel: payload => dispatch(changeUserLevel(payload)),
        editIdentity: payload => dispatch(editIdentity(payload)),
        fetchAlert: payload => dispatch(alertPush(payload)),
        labelFetch: () => dispatch(labelFetch()),
        sendIdentity: payload => dispatch(sendIdentity(payload)),
    });

// tslint:disable-next-line
export const ProfilePartial = injectIntl(withRouter(connect(mapStateToProps, mapDispatchProps)(ProfilePartialComponent) as any));
