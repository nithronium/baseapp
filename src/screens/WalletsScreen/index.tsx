//tslint:disable
import { Button, Loader } from '@openware/components';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { CurrencyInfo, TabPanel, WalletItemProps, WalletList } from '../../components';
import { ModalWithdrawConfirmation } from '../../containers/ModalWithdrawConfirmation';
import { ModalWithdrawSubmit } from '../../containers/ModalWithdrawSubmit';
import { EstimatedValue } from '../../containers/Wallets/EstimatedValue';
import { WalletHistory } from '../../containers/Wallets/History';
import { Withdraw, WithdrawProps } from '../../containers/Wallets/Withdraw';
import { WithdrawLite } from '../../containers/Wallets/WithdrawLite';
import { BlurComponent } from '../../custom/components';
import { buildPath } from '../../custom/helpers';
import { VersionGuardWrapper } from '../../decorators';
import { setDocumentTitle } from '../../helpers';
import {
    alertPush,
    beneficiariesFetch,
    Beneficiary,
    openGuardModal,
    RootState,
    selectBeneficiariesActivateSuccess,
    selectBeneficiariesDeleteSuccess,
    selectCurrentColorTheme,
    selectCurrentLanguage,
    selectHistory,
    selectMobileWalletUi,
    selectUserInfo,
    selectWalletAddress,
    selectWallets,
    selectWalletsAddressError,
    selectWalletsLoading,
    selectWithdrawSuccess,
    setMobileWalletUi,
    User,
    WalletHistoryList,
    walletsAddressFetch,
    walletsData,
    walletsFetch,
    walletsWithdrawCcyFetch,
} from '../../modules';
import { CommonError } from '../../modules/types';
import { DepositTab } from './DepositTab';
import { TypeTabs } from './TypeTabs';
import { getBalance } from '../../api';

import { History } from 'history';

interface HP {
    history: History;
}
interface ReduxProps {
    colorTheme: string;
    currentLanguage: string;
    user: User;
    wallets: WalletItemProps[];
    withdrawSuccess: boolean;
    addressDepositError?: CommonError;
    walletsLoading?: boolean;
    historyList: WalletHistoryList;
    mobileWalletChosen: string;
    selectedWalletAddress: string;
    whitelistActivateSuccess: boolean;
    whitelistDeleteSuccess: boolean;
}

interface DispatchProps {
    fetchWhitelist: typeof beneficiariesFetch;
    fetchWallets: typeof walletsFetch;
    fetchAddress: typeof walletsAddressFetch;
    clearWallets: () => void;
    walletsWithdrawCcy: typeof walletsWithdrawCcyFetch;
    fetchSuccess: typeof alertPush;
    setMobileWalletUi: typeof setMobileWalletUi;
    openGuardModal: typeof openGuardModal;
}

const defaultBeneficiary: Beneficiary = {
    id: 0,
    currency: '',
    name: '',
    state: '',
    data: {
        address: '',
    },
};

interface WalletsState {
    activeIndex: number;
    otpCode: string;
    amount: number;
    beneficiary: Beneficiary;
    selectedWalletIndex: number;
    withdrawSubmitModal: boolean;
    withdrawConfirmModal: boolean;
    tab: string;
    withdrawDone: boolean;
    total: number;
    currentTabIndex: number;
    card: boolean;
    sepa: boolean;
    wire: boolean;
    balance: number;
}

type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps & HP;

class WalletsComponent extends React.Component<Props, WalletsState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            activeIndex: 0,
            selectedWalletIndex: -1,
            withdrawSubmitModal: false,
            withdrawConfirmModal: false,
            otpCode: '',
            amount: 0,
            beneficiary: defaultBeneficiary,
            tab: this.translate('page.body.wallets.tabs.deposit'),
            withdrawDone: false,
            total: 0,
            currentTabIndex: 0,
            card: false,
            sepa: false,
            wire: true,
            balance: 0,
        };
    }

    //tslint:disable
    public translate = (id: string) => this.props.intl.formatMessage({ id });

    public componentDidMount() {
        setDocumentTitle('Wallets');
        const { wallets, fetchAddress } = this.props;
        const { selectedWalletIndex } = this.state;

        getBalance()
            .then(data => {
                this.setState({
                    balance: data.quote || 0,
                });
            })
            .catch(() => {
                this.setState({ balance: 0 });
            });

        if (this.props.wallets.length === 0) {
            this.props.fetchWallets();
        }

        if (wallets.length > 0) {
            this.props.fetchWhitelist();
        }

        if (selectedWalletIndex === -1 && wallets.length) {
            this.setState({ selectedWalletIndex: 0 });
            wallets[0].type === 'coin' && fetchAddress({ currency: wallets[0].currency });
        }
    }

    public componentWillUnmount() {
        this.props.clearWallets();
    }

    public componentWillReceiveProps(next: Props) {
        const { wallets, whitelistActivateSuccess, whitelistDeleteSuccess, withdrawSuccess } = this.props;

        if (wallets.length === 0 && next.wallets.length > 0) {
            const isEurFirst = next.wallets[0].currency.toLowerCase() === 'eur';
            this.setState({
                selectedWalletIndex: 0,
                sepa: isEurFirst,
                wire: !isEurFirst,
                card: false,
            });
            this.props.fetchWhitelist();
            next.wallets[0].type === 'coin' && this.props.fetchAddress({ currency: next.wallets[0].currency });
        }

        if (!withdrawSuccess && next.withdrawSuccess) {
            this.toggleSubmitModal();
        }

        if (
            (next.whitelistActivateSuccess && !whitelistActivateSuccess) ||
            (next.whitelistDeleteSuccess && !whitelistDeleteSuccess)
        ) {
            this.props.fetchWhitelist();
        }
    }

    public message = () => {
        this.props.fetchSuccess({ message: ['page.profile.update.balance'], type: 'error' });
    };

    public render() {
        const { wallets, historyList, mobileWalletChosen, walletsLoading } = this.props;
        const {
            beneficiary,
            total,
            selectedWalletIndex,
            withdrawSubmitModal,
            withdrawConfirmModal,
            currentTabIndex,
        } = this.state;

        const formattedWallets = wallets.map((wallet: WalletItemProps) => ({
            ...wallet,
            currency: wallet.currency.toUpperCase(),
            iconUrl: wallet.iconUrl ? wallet.iconUrl : '',
        }));
        const selectedCurrency = (wallets[selectedWalletIndex] || { currency: '' }).currency;

        let confirmationAddress = '';
        if (wallets[selectedWalletIndex]) {
            confirmationAddress =
                wallets[selectedWalletIndex].type === 'fiat'
                    ? beneficiary.name
                    : beneficiary.data
                    ? (beneficiary.data.address as string)
                    : '';
        }
        //tslint:disable
        return (
            <React.Fragment>
                <EstimatedValue wallets={wallets} />
                <div className="pg-container pg-wallet">
                    <div className="text-center">{walletsLoading && <Loader />}</div>
                    <div
                        className={`row no-gutters pg-wallet__tabs-content ${!historyList.length &&
                            'pg-wallet__tabs-content-height'}`}
                    >
                        <div className={`col-md-5 col-sm-12 col-12 ${mobileWalletChosen && 'd-none d-md-block'}`}>
                            <WalletList
                                onWalletSelectionChange={this.onWalletSelectionChange}
                                walletItems={formattedWallets}
                                activeIndex={this.state.activeIndex}
                                onActiveIndexChange={this.onActiveIndexChange}
                            />
                        </div>
                        <div
                            className={`pg-wallet__tabs col-md-7 col-sm-12 col-12 ${!mobileWalletChosen && 'd-none d-md-block'}`}
                        >
                            <TabPanel
                                panels={this.renderTabs()}
                                onTabChange={this.onTabChange}
                                currentTabIndex={currentTabIndex}
                                onCurrentTabChange={this.onCurrentTabChange}
                            />
                        </div>
                    </div>
                    <ModalWithdrawSubmit
                        show={withdrawSubmitModal}
                        currency={selectedCurrency}
                        onSubmit={this.toggleSubmitModal}
                    />
                    <ModalWithdrawConfirmation
                        show={withdrawConfirmModal}
                        amount={total}
                        currency={selectedCurrency}
                        rid={confirmationAddress}
                        onSubmit={this.handleWithdraw}
                        onDismiss={this.toggleConfirmModal}
                    />
                </div>
            </React.Fragment>
        );
    }

    private onTabChange = (index, label) => this.setState({ tab: label });

    private onActiveIndexChange = index => this.setState({ activeIndex: index });

    private onCurrentTabChange = index => this.setState({ currentTabIndex: index });

    private toggleSubmitModal = () => {
        this.setState((state: WalletsState) => ({
            withdrawSubmitModal: !state.withdrawSubmitModal,
            withdrawDone: true,
        }));
    };

    private toggleConfirmModal = (amount?: number, total?: number, beneficiary?: Beneficiary, otpCode?: string) => {
        this.setState((state: WalletsState) => ({
            amount: amount ? amount : 0,
            beneficiary: beneficiary ? beneficiary : defaultBeneficiary,
            otpCode: otpCode ? otpCode : '',
            withdrawConfirmModal: !state.withdrawConfirmModal,
            total: total ? total : 0,
        }));
    };

    private renderTabs() {
        const { tab, selectedWalletIndex } = this.state;

        if (selectedWalletIndex === -1) {
            return [{ content: null, label: '' }];
        }

        return [
            {
                content: tab === this.translate('page.body.wallets.tabs.deposit') ? this.renderDeposit() : null,
                label: this.translate('page.body.wallets.tabs.deposit'),
            },
            {
                content: tab === this.translate('page.body.wallets.tabs.withdraw') ? this.renderWithdraw() : null,
                label: this.translate('page.body.wallets.tabs.withdraw'),
            },
        ];
    }

    private handleWithdraw = () => {
        const { wallets } = this.props;
        const { selectedWalletIndex, otpCode, amount, beneficiary } = this.state;
        if (selectedWalletIndex === -1) {
            return;
        }

        const { currency } = wallets[selectedWalletIndex];
        const withdrawRequest = {
            amount,
            currency: currency.toLowerCase(),
            otp: otpCode,
            beneficiary_id: beneficiary.id,
        };
        this.props.walletsWithdrawCcy(withdrawRequest);
        this.toggleConfirmModal();
    };

    private handleOnCopy = () => {
        this.props.fetchSuccess({ message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success' });
    };

    private onError = (data) => {
        this.props.paymentError(data);
    };

    private renderDeposit = () => {
        const { addressDepositError, wallets, user, selectedWalletAddress, colorTheme } = this.props;
        const { selectedWalletIndex, card, sepa, wire } = this.state;
        return (
            <DepositTab
                addressDepositError={addressDepositError}
                colorTheme={colorTheme}
                wallets={wallets}
                user={user}
                selectedWalletAddress={selectedWalletAddress}
                selectedWalletIndex={selectedWalletIndex}
                card={card}
                sepa={sepa}
                wire={wire}
                handleOnCopy={this.handleOnCopy}
                action={this.setState.bind(this)}
                balance={this.state.balance}
                message={this.message}
                history={this.props.history}
                lang={this.props.currentLanguage}
                onError={this.onError}
            />
        );
    };

    private renderWithdraw = () => {
        const { walletsError, user, wallets } = this.props;
        const { selectedWalletIndex, sepa, card, wire } = this.state;
        const currency = (wallets[selectedWalletIndex] || { currency: '' }).currency;
        return (
           <React.Fragment >
                {wallets[selectedWalletIndex].type === 'fiat' && (
                    <TypeTabs
                        action={this.setState.bind(this)}
                        currency={currency.toLowerCase()}
                        sepa={sepa}
                        card={card}
                        wire={wire}
                    />
                )}
               { wire && currency === 'eur'
                   ? <div style={{ fontSize: '18px', paddingTop: '20px', textAlign: 'center' }}>{this.translate('comingsoon')}</div>
                   : <React.Fragment>
                {currency.toLowerCase() === 'usd'}
                <CurrencyInfo wallet={wallets[selectedWalletIndex]} />
               <BlurComponent isBlur={user < 4}>
                   {walletsError && <p className="pg-wallet__error">{walletsError.message}</p>}
                    {['usd', 'aed'].includes(currency.toLowerCase()) ? (
                        <div style={{ textAlign: 'center', fontSize: '18px', padding: '20px' }}>{this.translate('comingsoon')}</div>
                    ) : (
                        this.renderWithdrawBlock()
                    )}
                    {user.otp && currency && <WalletHistory label="withdraw" type="withdraws" currency={currency} />}
               </BlurComponent>
                </React.Fragment>  }
            </React.Fragment>
        );
    };

    private renderWithdrawBlock = () => VersionGuardWrapper(this.renderEnterpriseContent, this.renderLiteContent);

    private renderLiteContent = () => <WithdrawLite openModal={this.props.openGuardModal} />;

    private renderEnterpriseContent = () => {
        const { withdrawDone, selectedWalletIndex, sepa, wire, card } = this.state;

        if (selectedWalletIndex === -1) {
            return [{ content: null, label: '' }];
        }
        const {
            user: { level, otp },
            wallets,
        } = this.props;
        const wallet = wallets[selectedWalletIndex];
        const { currency, fee, type } = wallet;
        const fixed = (wallet || { fixed: 0 }).fixed;

        const withdrawProps: WithdrawProps = {
            withdrawDone,
            currency,
            fee,
            sepa,
            wire,
            card,
            onClick: this.toggleConfirmModal,
            borderItem: 'empty-circle',
            twoFactorAuthRequired: this.isTwoFactorAuthRequired(level, otp),
            fixed,
            type,
            withdrawAmountLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.amount' }),
            withdrawReceiveLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.receive' }),
            withdrawTransactionLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.transaction' }),
            withdraw2faLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.code2fa' }),
            withdrawFeeLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.fee' }),
            withdrawTotalLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.total' }),
            withdrawButtonLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.button' }),
            inputErrorText: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.inputError' }),
            soon: this.props.intl.formatMessage({ id: 'comingsoon' }),
        };

        return otp ? <Withdraw {...withdrawProps} /> : this.isOtpDisabled();
    };

    private isOtpDisabled = () => {
        return (
            <React.Fragment>
                <p className="pg-wallet__enable-2fa-message">
                    {this.translate('page.body.wallets.tabs.withdraw.content.enable2fa')}
                </p>
                <Button
                    className="pg-wallet__button-2fa"
                    label={this.translate('page.body.wallets.tabs.withdraw.content.enable2faButton')}
                    onClick={this.redirectToEnable2fa}
                />
            </React.Fragment>
        );
    };

    private redirectToEnable2fa = () =>
        this.props.history.push(buildPath('/security/2fa', this.props.currentLanguage), { enable2fa: true });

    private isTwoFactorAuthRequired(level: number, is2faEnabled: boolean) {
        return level > 1 || (level === 1 && is2faEnabled);
    }

    private onWalletSelectionChange = (value: WalletItemProps) => {
        const { wallets } = this.props;
        if (!value.address && wallets.length && value.type !== 'fiat') {
            this.props.fetchAddress({ currency: value.currency });
        }
        const nextWalletIndex = this.props.wallets.findIndex(
            wallet => wallet.currency.toLowerCase() === value.currency.toLowerCase()
        );
        const isEur = value.currency.toLowerCase() === 'eur';
        const tabs = {
            sepa: isEur,
            wire: !isEur,
            card: false,
        };
        this.setState({ selectedWalletIndex: nextWalletIndex, withdrawDone: false, ...tabs });
        this.props.setMobileWalletUi(wallets[nextWalletIndex].name);
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    colorTheme: selectCurrentColorTheme(state),
    currentLanguage: selectCurrentLanguage(state),
    user: selectUserInfo(state),
    wallets: selectWallets(state),
    walletsLoading: selectWalletsLoading(state),
    addressDepositError: selectWalletsAddressError(state),
    withdrawSuccess: selectWithdrawSuccess(state),
    historyList: selectHistory(state),
    mobileWalletChosen: selectMobileWalletUi(state),
    selectedWalletAddress: selectWalletAddress(state),
    whitelistActivateSuccess: selectBeneficiariesActivateSuccess(state),
    whitelistDeleteSuccess: selectBeneficiariesDeleteSuccess(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    fetchWhitelist: () => dispatch(beneficiariesFetch()),
    fetchWallets: () => dispatch(walletsFetch()),
    fetchAddress: ({ currency }) => dispatch(walletsAddressFetch({ currency })),
    walletsWithdrawCcy: params => dispatch(walletsWithdrawCcyFetch(params)),
    clearWallets: () => dispatch(walletsData([])),
    fetchSuccess: payload => dispatch(alertPush(payload)),
    setMobileWalletUi: payload => dispatch(setMobileWalletUi(payload)),
    openGuardModal: () => dispatch(openGuardModal()),
    paymentError: payload => dispatch(alertPush(payload)),
});

// tslint:disable-next-line:no-any
export const WalletsScreen = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(WalletsComponent) as any));
