import {
    Button,
    Dropdown,
} from '@openware/components';
import cr from 'classnames';
import countries = require('i18n-iso-countries');
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import MaskInput from 'react-maskinput';
import {
  connect,
  MapDispatchToPropsFunction,
} from 'react-redux';
import { formatDate, isDateInFuture } from '../../../../helpers';
import { RootState, selectCurrentLanguage } from '../../../../modules';
import {
    selectSendIdentitySuccess,
    sendIdentity,
} from '../../../../modules/user/kyc/identity';
import { labelFetch } from '../../../../modules/user/kyc/label';
import { changeUserLevel } from '../../../../modules/user/profile';
import { nationalities } from '../../../../translations/nationalities';

interface ReduxProps {
    success?: string;
    lang: string;
}

interface DispatchProps {
    changeUserLevel: typeof changeUserLevel;
    sendIdentity: typeof sendIdentity;
    labelFetch: typeof labelFetch;
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
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

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
    };

    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };

    public componentDidUpdate(prev: Props) {
        if (!prev.success && this.props.success) {
            this.props.changeUserLevel({ level: 1 });
            this.props.labelFetch();
        }
    }

    public render() {
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
        const { success, lang } = this.props;

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

        const dataNationalities = nationalities.map(value => {
            return this.translate(value);
        });
        const onSelectNationality = value => this.selectNationality(dataNationalities[value]);

        /* tslint:disable */
        countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
        countries.registerLocale(require("i18n-iso-countries/langs/ru.json"));
        countries.registerLocale(require("i18n-iso-countries/langs/zh.json"));
        /* tslint:enable */

        const dataCountries = Object.values(countries.getNames(lang));
        const onSelectCountry = value => this.selectCountry(dataCountries[value]);

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
                                onSelect={onSelectCountry}
                                placeholder={this.translate('page.body.kyc.identity.CoR')}
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
                                list={dataNationalities}
                                onSelect={onSelectNationality}
                                placeholder={this.translate('page.body.kyc.identity.nationality')}
                            />
                        </div>
                    </div>
                    <div className="pg-confirm__content-profile-partial-col-row">
                        <fieldset className={dateOfBirthGroupClass}>
                            {dateOfBirth && <legend>{this.translate('page.body.kyc.identity.dateOfBirth')}</legend>}
                            <MaskInput
                                className="pg-confirm__content-profile-partial-col-row-content-number"
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
              {success && <p className="pg-confirm__success">{this.translate(success)}</p>}
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
    }

    private selectNationality = (value: string) => {
        this.setState({
            metadata: { nationality: value },
        });
    };

    private selectCountry = (value: string) => {
        this.setState({
            countryOfBirth: countries.getAlpha2Code(value, this.props.lang),
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
            || !metadata.nationality
            || !countryOfBirth
        );
    }

    private sendData = () => {
        const dob = !isDateInFuture(this.state.dateOfBirth) ? this.state.dateOfBirth : '';
        const profileInfo = {
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            dob,
            country: this.state.countryOfBirth,
            metadata: JSON.stringify(this.state.metadata),
        };
        this.props.sendIdentity(profileInfo);
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    success: selectSendIdentitySuccess(state),
    lang: selectCurrentLanguage(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        changeUserLevel: payload => dispatch(changeUserLevel(payload)),
        sendIdentity: payload => dispatch(sendIdentity(payload)),
        labelFetch: () => dispatch(labelFetch()),
    });

// tslint:disable-next-line
export const ProfilePartial = injectIntl(connect(mapStateToProps, mapDispatchProps)(ProfilePartialComponent) as any);
