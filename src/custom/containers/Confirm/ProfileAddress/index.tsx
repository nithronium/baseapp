import { Button } from '@openware/components';
import cr from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import {
  connect,
  MapDispatchToPropsFunction,
} from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import {
    alertPush,
    editIdentity,
    labelFetch,
    RootState,
    selectCurrentLanguage,
    selectEditIdentityData,
    selectEditIdentitySuccess,
    selectUserInfo,
    User,
} from '../../../../modules';
import { IdentityData } from '../../../../modules/user/kyc/identity/types';
import { changeUserProfileData } from '../../../../modules/user/profile';
import { handleRedirectToConfirm } from '../../../helpers';

interface ReduxProps {
    editData?: IdentityData;
    editSuccess?: string;
    lang: string;
    user: User;
}

interface DispatchProps {
    editIdentity: typeof editIdentity;
    fetchAlert: typeof alertPush;
    labelFetch: typeof labelFetch;
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
    city: string;
    postcode: string;
    residentialAddress: string;
    state: string;
    cityFocused: boolean;
    postcodeFocused: boolean;
    residentialAddressFocused: boolean;
    stateFocused: boolean;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps & RouterProps & HistoryProps;

// tslint:disable jsx-no-lambda no-submodule-imports
class ProfileAddressComponent extends React.Component<Props, State> {
    public state = {
        city: '',
        postcode: '',
        residentialAddress: '',
        state: '',
        cityFocused: false,
        postcodeFocused: false,
        residentialAddressFocused: false,
        stateFocused: false,
    };

    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };

    public componentDidUpdate(prev: Props) {
        const {
            editData,
            editSuccess,
            user,
            history,
        } = this.props;
        if (!prev.editSuccess && editSuccess) {
            this.props.labelFetch();
            if (editData) {
                this.props.changeUserProfileData({...editData, addAddress: true});
                handleRedirectToConfirm('profAddressStep', this.props.history);
            }
        }
        if (history.location && history.location.state && history.location.state.addressEdit && user.profile) {
            const { city, postcode, residentialAddress, state } = this.state;
            this.getAddress(user, city, postcode, residentialAddress, state);
        }
    }
//tslint:disable
    public componentDidMount() {
        const { user } = this.props;
        if (user.profile) {
            const { city, postcode, residentialAddress, state } = this.state;
            this.getAddress(user, city, postcode, residentialAddress, state);
        }
    }

    public getAddress = (user, city, postcode, residentialAddress, state ) => {
        if (user.profile.city && user.profile.city !== city) {
            this.setState({
                city: user.profile.city,
            });
        }

        if (user.profile.postcode && user.profile.postcode !== postcode) {
            this.setState({
                postcode: user.profile.postcode,
            });
        }

        if (user.profile.address && user.profile.address !== residentialAddress) {
            this.setState({
                residentialAddress: user.profile.address,
            });
        }

        const currentState = user.profile.metadata && JSON.parse(user.profile.metadata).state;
        if (currentState && currentState !== state) {
            this.setState({
                state: currentState,
            });
        }
    };

    public render() {
        const {
            city,
            postcode,
            residentialAddress,
            state,
            cityFocused,
            postcodeFocused,
            residentialAddressFocused,
            stateFocused,
        } = this.state;

        const cityGroupClass = cr('pg-confirm__content-profile-address-col-row-content', {
            'pg-confirm__content-profile-address-col-row-content--focused': cityFocused,
            'pg-confirm__content-profile-address-col-row-content--wrong': city && !this.handleValidateInput('city', city),
        });

        const postcodeGroupClass = cr('pg-confirm__content-profile-address-col-row-content', {
            'pg-confirm__content-profile-address-col-row-content--focused': postcodeFocused,
            'pg-confirm__content-profile-address-col-row-content--wrong': postcode && !this.handleValidateInput('postcode', postcode),
        });

        const residentialAddressGroupClass = cr('pg-confirm__content-profile-address-col-row-content', {
            'pg-confirm__content-profile-address-col-row-content--focused': residentialAddressFocused,
            'pg-confirm__content-profile-address-col-row-content--wrong': residentialAddress && !this.handleValidateInput('residentialAddress', residentialAddress),
        });

        const stateGroupClass = cr('pg-confirm__content-profile-address-col-row-content', {
            'pg-confirm__content-profile-address-col-row-content--focused': stateFocused,
            'pg-confirm__content-profile-address-col-row-content--wrong': state && !this.handleValidateInput('state', state),
        });

        return (
            <div className="pg-confirm__content-profile-address">
                <div className="pg-confirm__content-profile-address-forms">
                    <div className="pg-confirm__content-profile-address-col">
                        <div className="pg-confirm__content-profile-address-col-row">
                            <fieldset className={cityGroupClass}>
                                {city && <legend>{this.translate('page.body.kyc.identity.city')}</legend>}
                                <input
                                    className="pg-confirm__content-profile-address-col-row-content-number"
                                    type="string"
                                    placeholder={this.translate('page.body.kyc.identity.city')}
                                    value={city}
                                    onChange={this.handleChange('city')}
                                    onFocus={this.handleFieldFocus('city')}
                                    onBlur={this.handleFieldFocus('city')}
                                    autoFocus={true}
                                />
                            </fieldset>
                        </div>
                        <div className="pg-confirm__content-profile-address-col-row">
                            <fieldset className={stateGroupClass}>
                                {state && <legend>{this.translate('page.body.kyc.identity.state')}</legend>}
                                <input
                                    className="pg-confirm__content-profile-address-col-row-content-number"
                                    type="string"
                                    placeholder={this.translate('page.body.kyc.identity.state')}
                                    value={state}
                                    onChange={this.handleChange('state')}
                                    onFocus={this.handleFieldFocus('state')}
                                    onBlur={this.handleFieldFocus('state')}
                                />
                            </fieldset>
                        </div>
                        <div className="pg-confirm__content-profile-address-col-row">
                            <fieldset className={residentialAddressGroupClass}>
                                {residentialAddress && <legend>{this.translate('page.body.kyc.identity.residentialAddress')}</legend>}
                                <input
                                    className="pg-confirm__content-profile-address-col-row-content-number"
                                    type="string"
                                    placeholder={this.translate('page.body.kyc.identity.residentialAddress')}
                                    value={residentialAddress}
                                    onChange={this.handleChange('residentialAddress')}
                                    onFocus={this.handleFieldFocus('residentialAddress')}
                                    onBlur={this.handleFieldFocus('residentialAddress')}
                                />
                            </fieldset>
                        </div>
                        <div className="pg-confirm__content-profile-address-col-row">
                            <fieldset className={postcodeGroupClass}>
                                {postcode && <legend>{this.translate('page.body.kyc.identity.postcode')}</legend>}
                                <input
                                    className="pg-confirm__content-profile-address-col-row-content-number"
                                    type="string"
                                    placeholder={this.translate('page.body.kyc.identity.postcode')}
                                    value={postcode}
                                    onChange={this.handleChange('postcode')}
                                    onFocus={this.handleFieldFocus('postcode')}
                                    onBlur={this.handleFieldFocus('postcode')}
                                />
                            </fieldset>
                        </div>
                        <div className="pg-confirm__content-profile-address-col-row" />
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
            const element: HTMLElement = document.getElementsByClassName('pg-confirm__content-profile-address-col-row')[displayedElem] as HTMLElement;
            element && element.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'});
    }

    private handleFieldFocus = (field: string) => {
        return () => {
            switch (field) {
                case 'city':
                    this.setState({
                        cityFocused: !this.state.cityFocused,
                    });
                    this.scrollToElement(0);
                    break;
                case 'state':
                    this.setState({
                        stateFocused: !this.state.stateFocused,
                    });
                    this.scrollToElement(1);
                    break;
                case 'residentialAddress':
                    this.setState({
                        residentialAddressFocused: !this.state.residentialAddressFocused,
                    });
                    this.scrollToElement(2);
                    break;
                case 'postcode':
                    this.setState({
                        postcodeFocused: !this.state.postcodeFocused,
                    });
                    this.scrollToElement(3);
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

    private handleValidateInput = (field: string, value: string): boolean => {
        switch (field) {
            case 'residentialAddress':
                const residentialAddressRegex = /^[a-zA-Z0-9\-,.;:"'&()\\\/#\s]+$/gi;
                return residentialAddressRegex.test(value);
            case 'city':
                const cityRegex = new RegExp(`^[a-zA-Z]+$`);
                return cityRegex.test(value);
            case 'postcode':
                const postcodeRegex = new RegExp(`^[0-9\-]{1,12}$`);
                return postcodeRegex.test(value);
            case 'state':
                // const stateRegex = new RegExp(`^[a-zA-Z]{1,100}$`);
                // return stateRegex.test(value);
                return true;
            default:
                return true;
        }
    }

    private handleCheckButtonDisabled = () => {
        const {
            city,
            postcode,
            residentialAddress,
            state,
        } = this.state;


        const residentialAddressValid = this.handleValidateInput('residentialAddress', residentialAddress);
        const cityValid = this.handleValidateInput('city', city);
        const postcodeValid = this.handleValidateInput('postcode', postcode);
        const stateValid = this.handleValidateInput('state', state);

        return !(
            residentialAddressValid
            && cityValid
            && postcodeValid
            && stateValid
        );
    }

    private sendData = () => {
        const { user } = this.props;
        const {
            city,
            postcode,
            residentialAddress,
            state,
        } = this.state;

        const currentUserNationality = user.profile.metadata && JSON.parse(user.profile.metadata).nationality;

        const profileInfo = {
            first_name: user.profile.first_name,
            last_name: user.profile.last_name,
            dob: user.profile.dob,
            country: user.profile.country,
            address: residentialAddress,
            postcode: postcode,
            city: city,
            metadata: JSON.stringify({
                nationality: currentUserNationality,
                state: state,
            }),
        };

        this.props.editIdentity(profileInfo);
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    editData: selectEditIdentityData(state),
    editSuccess: selectEditIdentitySuccess(state),
    lang: selectCurrentLanguage(state),
    user: selectUserInfo(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        changeUserProfileData: payload => dispatch(changeUserProfileData(payload)),
        editIdentity: payload => dispatch(editIdentity(payload)),
        fetchAlert: payload => dispatch(alertPush(payload)),
        labelFetch: () => dispatch(labelFetch()),
    });

// tslint:disable-next-line
export const ProfileAddress = injectIntl(withRouter(connect(mapStateToProps, mapDispatchProps)(ProfileAddressComponent) as any));
