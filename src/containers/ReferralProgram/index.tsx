import axios from 'axios';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl, intlShape } from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
// import { saveCode } from '../../api';
import { CopyableTextField, CustomInput } from '../../components';
import { alertPush, RootState, selectUserInfo, User } from '../../modules';

interface ReduxProps {
    user: User;
}

interface DispatchProps {
    fetchSuccess: typeof alertPush;
}

type CopyTypes = HTMLInputElement | null;

const copy = (id: string) => {
    const copyText: CopyTypes = document.querySelector(`#${id}`);

    if (copyText) {
        copyText.select();

        document.execCommand('copy');
        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
        }
    }
};


type Props = ReduxProps & DispatchProps & InjectedIntlProps;
//tslint:disable
class ReferralProgramClass extends React.Component<Props> {
    public static propsTypes: React.ValidationMap<any> = {
        intl: intlShape.isRequired,
    };
    public readonly state = {
        refId: '',
        userRefUid: '',
    };

    public translate = (e: string) => {
        return this.props.intl.formatMessage({ id: e });
    };

    public doCopy = () => {
        copy('referral-id');
        this.props.fetchSuccess({ message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success' });
    };

    public doCopyIEO = () => {
        copy('referral-IEO-id');
        this.props.fetchSuccess({ message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success' });
    };

    public sendRefCode = async () => {
        const { refId } = this.state;
        const { user } = this.props;
        const domen = window.document.location.origin;

        const url = `${domen}/api/v1/referral-code?user_uid=${user.uid}&referral_code=${refId}`;

        try {
            const resp = await axios.get(url);
            if (resp.status === 200 && !resp.data ) {
                 const userRefUid = this.state.refId;
                this.setState({ userRefUid });
                localStorage.setItem('ref_id', userRefUid);
            } else  if (resp.status === 200 && resp.data) {
                const message = `refcode.${resp.data.errors[0]}`;
                const refId = '';
                this.setState({ refId });
                this.props.fetchSuccess({ message: [message], type: 'error' });
            }
        } catch (error) {
            const refId = '';
            this.setState({ refId });
            this.props.fetchSuccess({ message: ['server.internal_error'], type: 'error' });
        }
    };

    public componentDidMount = () => {
        let userRefUid = this.props.user.referral_uid;
        const ref_id = localStorage.getItem('ref_id') || '';
        if (userRefUid && ref_id) {
            localStorage.removeItem('ref_id');
        }
        if (!userRefUid && ref_id) {
            userRefUid = ref_id
        }
        this.setState({ userRefUid });
    };

    public render() {
        const { user } = this.props;
        const { refId, userRefUid } = this.state;
        // tslint:disable
        const lang = localStorage.getItem('lang_code') || 'en';
        const locale = lang === 'en' ? '' : `/${lang}`;
        const referralLink = `${window.document.location.origin}/signup?refid=${user.uid}`;
        return (
            <div className="pg-profile-page__referral mb-3">
                {userRefUid ? (
                    <React.Fragment>
                    <fieldset className="pg-copyaIDFC3F0CD62Able-text__section" onClick={this.doCopy}>
                    <legend className="cr-deposit-crypto__copyable-title">
                        <FormattedMessage id="page.body.profile.header.referralProgram" />
                    </legend>
                    <CopyableTextField
                        className="pg-copyable-text-field__input"
                        value={referralLink}
                        fieldId="referral-id"
                        copyButtonText={this.translate('page.body.profile.content.copyLink')}
                    />
                        </fieldset>
                        </React.Fragment>
                ) : (
                    <div className="ref-code-input-field">
                            <div className="ref-code-input-field-link">
                                <p>{this.translate('profile.how_find_code')}{' '}</p>
                                <p><a href={`${locale}/referral#get-code"`}>{this.translate('profile.click_here')}</a></p>
                        </div>
                        <CustomInput
                            type="text"
                            label={''}
                            placeholder={this.translate('profile.enter_code')}
                            defaultLabel=""
                            handleChangeInput={value => {
                                this.setState({ refId: value });
                            }}
                            inputValue={refId}
                            handleFocusInput={() => {}}
                            classNameLabel=""
                            classNameInput="cr-email-form__input"
                        />
                        <button
                            type="submit"
                            className="ref-code-button cr-button"
                            onClick={() => {
                                this.sendRefCode();
                            }}
                        >
                            {this.translate('profile.save_code')}
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    fetchSuccess: payload => dispatch(alertPush(payload)),
});

// tslint:disable-next-line
export const ReferralProgram = injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(ReferralProgramClass) as any);
