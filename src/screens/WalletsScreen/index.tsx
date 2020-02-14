import { Button, Spinner } from 'react-bootstrap';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { CurrencyInfo, TabPanel, WalletItemProps, WalletList } from '../../components';
import { Withdraw, WithdrawProps } from '../../containers';
import { ModalWithdrawConfirmation } from '../../containers/ModalWithdrawConfirmation';
import { ModalWithdrawSubmit } from '../../containers/ModalWithdrawSubmit';
import { EstimatedValue } from '../../containers/Wallets/EstimatedValue';
import { WalletHistory } from '../../containers/Wallets/History';
import { BlurComponent } from '../../custom/components';
import { buildPath } from '../../custom/helpers';
import { formatCCYAddress, setDocumentTitle } from '../../helpers';
import {
    alertPush,
    beneficiariesFetch,
    Beneficiary,
    currenciesFetch,
    Currency,
    RootState,
    selectBeneficiariesActivateSuccess,
    selectBeneficiariesDeleteSuccess,
    selectCurrentColorTheme,
    selectCurrentLanguage,
    selectCurrencies,
    selectHistory,
    selectMobileWalletUi,
    selectUserInfo,
    selectWalletAddress,
    selectWallets,
    selectWalletsAddressError,
    selectWalletsLoading,
    selectWithdrawLimit,
    selectWithdrawSuccess,
    setMobileWalletUi,
    User,
    WalletHistoryList,
    walletsAddressFetch,
    walletsData,
    walletsFetch,
    walletsWithdrawCcyFetch, WithdrawLimit,
    withdrawLimitFetch,
} from '../../modules';
import { CommonError } from '../../modules/types';
import { TypeTabs } from './TypeTabs';
import { getBalance } from '../../api';
import { History } from 'history';
import { CoinFragment } from './DepositTab/CoinFragment';
import { FiatFragment } from './DepositTab/FiatFragment';

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
    withdrawLimitData: WithdrawLimit;
    beneficiariesActivateSuccess: boolean;
    beneficiariesDeleteSuccess: boolean;
    currencies: Currency[];
}

interface DispatchProps {
    fetchBeneficiaries: typeof beneficiariesFetch;
    fetchWallets: typeof walletsFetch;
    fetchAddress: typeof walletsAddressFetch;
    clearWallets: () => void;
    walletsWithdrawCcy: typeof walletsWithdrawCcyFetch;
    fetchSuccess: typeof alertPush;
    setMobileWalletUi: typeof setMobileWalletUi;
    fetchWithdrawLimit: typeof withdrawLimitFetch;
    currenciesFetch: typeof currenciesFetch;
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
        const { wallets, fetchAddress, fetchWithdrawLimit } = this.props;
        const { selectedWalletIndex } = this.state;
        fetchWithdrawLimit();
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
            this.props.fetchBeneficiaries();
        }

        if (selectedWalletIndex === -1 && wallets.length) {
            this.setState({ selectedWalletIndex: 0 });
            wallets[0].type === 'coin' && wallets[0].balance !== undefined && fetchAddress({ currency: wallets[0].currency });
        }

        if (!this.props.currencies.length) {
            this.props.currenciesFetch();
        }
    }

    public componentWillUnmount() {
        this.props.clearWallets();
    }

    public componentWillReceiveProps(next: Props) {
        const { wallets, beneficiariesActivateSuccess, beneficiariesDeleteSuccess, withdrawSuccess } = this.props;

        if (wallets.length === 0 && next.wallets.length > 0) {
            const isEurFirst = next.wallets[0].currency.toLowerCase() === 'eur';
            this.setState({
                selectedWalletIndex: 0,
                sepa: isEurFirst,
                wire: !isEurFirst,
                card: false,
            });
            this.props.fetchBeneficiaries();
            next.wallets[0].type === 'coin' && next.wallets[0].balance !== undefined && this.props.fetchAddress({ currency: next.wallets[0].currency });
        }

        if (!withdrawSuccess && next.withdrawSuccess) {
            this.toggleSubmitModal();
        }

        if ((next.beneficiariesActivateSuccess && !beneficiariesActivateSuccess) ||
            (next.beneficiariesDeleteSuccess && !beneficiariesDeleteSuccess)) {
            this.props.fetchBeneficiaries();
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
                    <div className="text-center">
                        {walletsLoading && <Spinner animation="border" variant="primary" />}
                    </div>
                    <div className={`row no-gutters pg-wallet__tabs-content ${!historyList.length && 'pg-wallet__tabs-content-height'}`}>
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
            withdrawDone: false,
        }));
    };

    private renderTabs() {
        const { tab, selectedWalletIndex } = this.state;
        const { wallets } = this.props;

        if (selectedWalletIndex === -1) {
            return [{ content: null, label: '' }];
        }

        const showWithdraw = wallets[selectedWalletIndex].type === 'fiat' || wallets[selectedWalletIndex].balance !== undefined;

        return [
            {
                content: tab === this.translate('page.body.wallets.tabs.deposit') ? this.renderDeposit(showWithdraw) : null,
                label: this.translate('page.body.wallets.tabs.deposit'),
            },
            {
                content: tab === this.translate('page.body.wallets.tabs.withdraw') ? this.renderWithdraw() : null,
                label: this.translate('page.body.wallets.tabs.withdraw'),
                disabled: !showWithdraw,
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

    private handleGenerateAddress = () => {
        const { selectedWalletIndex } = this.state;
        const { wallets } = this.props;

        if (!wallets[selectedWalletIndex].address && wallets.length && wallets[selectedWalletIndex].type !== 'fiat') {
            this.props.fetchAddress({ currency: wallets[selectedWalletIndex].currency });
        }
    }

    private renderDeposit = (isAccountActivated: boolean) => {
        const { addressDepositError, wallets, user, selectedWalletAddress, currencies } = this.props;
        const { selectedWalletIndex } = this.state;
        const currency = (wallets[selectedWalletIndex] || { currency: '' }).currency;
        const currencyItem = (currencies && currencies.find(item => item.id === currency)) || { min_confirmations: 6 };
        const text = this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.submit' },
                                                   { confirmations: currencyItem.min_confirmations });
        const error = addressDepositError ?
            this.props.intl.formatMessage({id: addressDepositError.message}) :
            this.props.intl.formatMessage({id: 'page.body.wallets.tabs.deposit.ccy.message.error'});

        const walletAddress = formatCCYAddress(currency, selectedWalletAddress);

        const buttonLabel = `
            ${this.translate('page.body.wallets.tabs.deposit.ccy.button.generate')} ${currency.toUpperCase()} ${this.translate('page.body.wallets.tabs.deposit.ccy.button.address')}
        `;

        if (wallets[selectedWalletIndex].type === 'coin') {
            return (
                <React.Fragment>
                    <CurrencyInfo wallet={wallets[selectedWalletIndex]}/>
                    <CoinFragment
                        data={walletAddress}
                        handleOnCopy={this.handleOnCopy}
                        error={error}
                        text={text}
                        disabled={walletAddress === ''}
                        copiableTextFieldText={this.translate('page.body.wallets.tabs.deposit.ccy.message.address')}
                        copyButtonText={this.translate('page.body.wallets.tabs.deposit.ccy.message.button')}
                        handleGenerateAddress={this.handleGenerateAddress}
                        buttonLabel={buttonLabel}
                        isAccountActivated={isAccountActivated}
                    />
                    {currency && <WalletHistory label="deposit" type="deposits" currency={currency} />}
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <CurrencyInfo wallet={wallets[selectedWalletIndex]}/>
                    <FiatFragment title={this.title} description={this.description} uid={user ? user.uid : ''}/>
                    {currency && <WalletHistory label="deposit" type="deposits" currency={currency} />}
                </React.Fragment>
            );
        }
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
                            this.renderEnterpriseContent()
                        )}
                        {user.otp && currency && <WalletHistory label="withdraw" type="withdraws" currency={currency} />}
                </BlurComponent>
                </React.Fragment>  }
            </React.Fragment>
        );
    };

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

    private title = this.translate('page.body.wallets.tabs.deposit.fiat.message1');
    private description = this.translate('page.body.wallets.tabs.deposit.fiat.message2');

    private isOtpDisabled = () => {
        return (
            <React.Fragment>
                <p className="pg-wallet__enable-2fa-message">
                    {this.translate('page.body.wallets.tabs.withdraw.content.enable2fa')}
                </p>
                <Button
                    block={true}
                    onClick={this.redirectToEnable2fa}
                    size="lg"
                    variant="primary"
                >
                    {this.translate('page.body.wallets.tabs.withdraw.content.enable2faButton')}
                </Button>
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
        const { tab } = this.state;
        const depositTab = { label: this.renderTabs()[0].label, index: 0 };

        if (!value.address && wallets.length && value.balance !== undefined && value.type !== 'fiat') {
            this.props.fetchAddress({ currency: value.currency });
        } else if (tab !== depositTab.label && value.type !== 'fiat') {
            this.onTabChange(depositTab.index, depositTab.label);
            this.onCurrentTabChange(depositTab.index);
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
    withdrawLimitData: selectWithdrawLimit(state),
    beneficiariesActivateSuccess: selectBeneficiariesActivateSuccess(state),
    beneficiariesDeleteSuccess: selectBeneficiariesDeleteSuccess(state),
    currencies: selectCurrencies(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    fetchBeneficiaries: () => dispatch(beneficiariesFetch()),
    fetchWallets: () => dispatch(walletsFetch()),
    fetchAddress: ({ currency }) => dispatch(walletsAddressFetch({ currency })),
    walletsWithdrawCcy: params => dispatch(walletsWithdrawCcyFetch(params)),
    clearWallets: () => dispatch(walletsData([])),
    fetchSuccess: payload => dispatch(alertPush(payload)),
    fetchWithdrawLimit: () => dispatch(withdrawLimitFetch()),
    setMobileWalletUi: payload => dispatch(setMobileWalletUi(payload)),
    paymentError: payload => dispatch(alertPush(payload)),
    currenciesFetch: () => dispatch(currenciesFetch()),
});

// tslint:disable-next-line:no-any
export const WalletsScreen = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(WalletsComponent) as any));
