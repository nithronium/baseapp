import { Button } from '@openware/components';
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
        window.getSelection().removeAllRanges();
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

    public sendRefCode = async () => {
        const { refId } = this.state;
        const { user } = this.props;
        const domen = window.document.location.origin;
        // console.log(refId);
        const url = `${domen}/api/v1/referral-code?user_uid=${user.uid}&referral_code=${refId}`;
        // const url = `${domen}/api/v1/referral-code?user_uid=${user.uid}&referral_code=IDBF19BD26D5`;
        try {
            const resp = await axios.get(url);
            // const resp2 = await saveCode(refId);
            // console.log(resp);
            // console.log(resp2);
            if (resp.status === 200) {
                const userRefUid = this.state.refId;
                this.setState({ userRefUid });
                localStorage.setItem('ref_id', userRefUid);
            } else {
                const refId = '';
                this.setState({ refId });
                this.props.fetchSuccess({ message: ['identity.user.referral_doesnt_exist'], type: 'error' });
            }
        } catch (err) {
            const refId = '';
            this.setState({ refId });
            this.props.fetchSuccess({ message: ['identity.user.referral_doesnt_exist'], type: 'error' });
        }
    };

    componentDidMount = () => {
        const userRefUid = this.props.user.referral_uid;
        const ref_id = localStorage.getItem('ref_id') || '';
        if (userRefUid && ref_id) {
            localStorage.removeItem('ref_id');
        }
        // console.log(userRefUid);
        this.setState({ userRefUid });
    };

    public render() {
        const { user } = this.props;
        const { refId, userRefUid } = this.state;
        // tslint:disable
        const referralLink = `${window.document.location.origin}/referral?refid=${user.uid}`;
        return (
            <div className="pg-profile-page__referral mb-3">
                {userRefUid ? (
                    <fieldset className="pg-copyable-text__section" onClick={this.doCopy}>
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
                ) : (
                    <div className="ref-code-input-field">
                        <p>
                            <a href="/referral#get-code">How to find a code?</a>
                        </p>
                        <CustomInput
                            type="text"
                            label={''}
                            placeholder={'Enter Your Referral Code'}
                            defaultLabel=""
                            handleChangeInput={value => {
                                this.setState({ refId: value });
                            }}
                            inputValue={refId}
                            handleFocusInput={() => {}}
                            classNameLabel=""
                            classNameInput="cr-email-form__input"
                            autoFocus={true}
                        />
                        <Button
                            type="submit"
                            className="ref-code-button"
                            label={'Save Code'}
                            onClick={() => {
                                this.sendRefCode();
                            }}
                        />
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
