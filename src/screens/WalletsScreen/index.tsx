//tslint:disable
import { Button, Loader } from '@openware/components';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { CurrencyInfo, DepositCrypto, TabPanel, WalletItemProps, WalletList } from '../../components';
import { ModalWithdrawConfirmation } from '../../containers/ModalWithdrawConfirmation';
import { ModalWithdrawSubmit } from '../../containers/ModalWithdrawSubmit';
import { EstimatedValue } from '../../containers/Wallets/EstimatedValue';
import { WalletHistory } from '../../containers/Wallets/History';
import { Withdraw, WithdrawProps } from '../../containers/Wallets/Withdraw';
import { WithdrawLite } from '../../containers/Wallets/WithdrawLite';
import { /*CardDepositFiat,*/ DepositFiat } from '../../custom/components';
import { buildPath } from '../../custom/helpers';
import { VersionGuardWrapper } from '../../decorators';
import { formatCCYAddress, setDocumentTitle } from '../../helpers';
import {
    alertPush,
    beneficiariesFetch,
    Beneficiary,
    openGuardModal,
    RootState,
    selectBeneficiariesActivateSuccess,
    selectBeneficiariesDeleteSuccess,
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


interface ReduxProps {
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
    bchAddress?: string;
    filteredWallets?: WalletItemProps[] | null;
    tab: string;
    withdrawDone: boolean;
    total: number;
    currentTabIndex: number;
    card: boolean;
    sepa: boolean;
    wire: boolean;
}

type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;

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
        };
    }

    //tslint:disable
    public translate = (id: string) => this.props.intl.formatMessage({ id });

    private title = this.translate('page.body.wallets.tabs.deposit.fiat.message1');
    private description = this.translate('page.body.wallets.tabs.deposit.fiat.message2');
    private details = this.translate('page.body.wallets.tabs.deposit.fiat.message3');
    

    public componentDidMount() {
        setDocumentTitle('Wallets');
        const { wallets, fetchAddress } = this.props;
        const { selectedWalletIndex } = this.state;

        

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
            this.setState({
                selectedWalletIndex: 0,
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

    public render() {
        const { wallets, historyList, mobileWalletChosen, walletsLoading } = this.props;
        const {
            beneficiary,
            total,
            selectedWalletIndex,
            filteredWallets,
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
                                walletItems={filteredWallets || formattedWallets}
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
        const { selectedWalletIndex, otpCode, amount, beneficiary } = this.state;
        if (selectedWalletIndex === -1) {
            return;
        }

        const { currency } = this.props.wallets[selectedWalletIndex];
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

    private renderDeposit = () => {
        // const levelMessage = this.translate('page.body.wallets.tabs.deposit.fiat.levelMessage');
        // const levelLink = this.translate('page.body.wallets.tabs.deposit.fiat.levelLink');
        const { addressDepositError, wallets, user, selectedWalletAddress } = this.props;
        const { selectedWalletIndex, card, sepa } = this.state;
        const currency = (wallets[selectedWalletIndex] || { currency: '' }).currency;
        const text = this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.submit' });
        const error = addressDepositError
            ? this.props.intl.formatMessage({ id: addressDepositError.message })
            : this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.error' });

        const walletAddress = formatCCYAddress(currency, selectedWalletAddress);

        if (wallets[selectedWalletIndex].type === 'coin') {
            return (
                <React.Fragment>
                    <CurrencyInfo wallet={wallets[selectedWalletIndex]} />
                    <DepositCrypto
                        data={walletAddress}
                        handleOnCopy={this.handleOnCopy}
                        error={error}
                        text={text}
                        disabled={walletAddress === ''}
                        copiableTextFieldText={this.translate('page.body.wallets.tabs.deposit.ccy.message.address')}
                        copyButtonText={this.translate('page.body.wallets.tabs.deposit.ccy.message.button')}
                    />
                    {currency && <WalletHistory label="deposit" type="deposits" currency={currency} />}
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    {this.renderTypeTabs(currency.toLowerCase())}
                    {card ?
                        <div style={{fontSize: '18px', paddingTop: '20px', textAlign: 'center'}}>{this.translate('comingsoon')}</div> :
                        // (this.props.user.level > 1 ?   //Check user level if > 1 show CardDepositFiat component else show mesage
                        //     <div>
                        //         <CardDepositFiat
                        //             currency={currency.toUpperCase()}
                        //             translate={this.translate} />
                        //         {currency && <WalletHistory label="deposit" type="deposits" currency={currency} />} 
                        //     </div>
                        //     : 
                        //     <div style={{padding: '10px 20px', color: 'red', fontSize: '20px'}}>  
                        //         <p>{levelMessage}</p>                            
                        //         <p><a href="/confirm">{levelLink}</a></p>
                        //     </div> ) : 
                        sepa ? 
                        <div>
                        <CurrencyInfo wallet={wallets[selectedWalletIndex]} />                    
                        <DepositFiat
                            currency={currency.toLowerCase()}
                            title={this.title}
                            description={this.description}
                            details={this.details}
                            uid={user ? user.uid : ''}
                            sepa={sepa}            
                        />
                        <div className="fiat-alert">
                            {this.translate('page.wallets.withdraw.fiat')}
                        </div>
                        {currency && <WalletHistory label="deposit" type="deposits" currency={currency} />} 
                            </div> :
                            <div>
                                <CurrencyInfo wallet={wallets[selectedWalletIndex]} />                        
                                <DepositFiat
                                    currency={currency.toLowerCase()}
                                    title={this.title}
                                    description={this.description}
                                    details={this.details}
                                    uid={user.uid}
                                />
                                {currency && <WalletHistory label="deposit" type="deposits" currency={currency} />}
                            </div>                       
                    }        
                    
                </React.Fragment>
            );
        }
    };

    private renderWithdraw = () => {
        const { walletsError, user, wallets } = this.props;
        const { selectedWalletIndex } = this.state;
        const currency = (wallets[selectedWalletIndex] || { currency: '' }).currency;

        return (
            <React.Fragment>
                {wallets[selectedWalletIndex].type === 'fiat' ? this.renderTypeTabs(currency.toLowerCase()) : ''}
                <CurrencyInfo wallet={wallets[selectedWalletIndex]} />
                {walletsError && <p className="pg-wallet__error">{walletsError.message}</p>}                
                {this.renderWithdrawBlock()}
                {user.otp && currency && <WalletHistory label="withdraw" type="withdraws" currency={currency} />}
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
            withdraw2faLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.code2fa' }),
            withdrawFeeLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.fee' }),
            withdrawTotalLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.total' }),
            withdrawButtonLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.button' }),
        };

        return otp ? <Withdraw {...withdrawProps} /> : this.isOtpDisabled();
        // return otp ? this.renderTypeTabs(currency.toLowerCase()) : this.isOtpDisabled();
    };


    private renderTypeTabs = (currency) => {

        return  (
                    <div style={{                       //Tabs pannel (Wire/ Sepa/ Card)
                        display: 'flex',
                        textAlign: 'center',
                        padding: '0 20px',
                        fontSize: '18px',
                        color: 'white',
                        marginBottom: '15px'
                    }}>
                        <div style={{                   //Wire
                            borderRadius: '5px 0 0 5px',
                            padding: '10px 0', flex: '1 1 auto',
                            cursor: 'pointer',
                            background: this.state.wire ? '#11B382' : 'none',
                            border: this.state.wire?  'none' : '1px solid #FFFFFF33',
                            color: this.state.wire ?  '#FFFFFF' : '#FFFFFF33',
                        }}
                            onClick={() => this.setState({ card: false, sepa: false, wire: true })}>
                            {this.translate('page.body.wallets.tabs.deposit.fiat.button.wire')}
                        </div>
                        { currency=== 'eur' && <div style={{    //Sepa
                            padding: '10px 0', flex: '1 1 auto',
                            cursor: 'pointer', background: this.state.sepa ? '#11B382' : 'none',
                            border: this.state.sepa ? 'none' : '1px solid #FFFFFF33',
                            color: this.state.sepa ?  '#FFFFFF' :'#FFFFFF33'
                        }} onClick={() => this.setState({ card: false, sepa: true, wire: false })}>
                            {this.translate('page.body.wallets.tabs.deposit.fiat.button.sepa')}
                        </div>
                        }
                        <div style={{                       //Card
                            borderRadius: '0 5px 5px 0',
                            padding: '10px 0', flex: '1 1 auto',
                            cursor: 'pointer', background: this.state.card ? '#11B382' : 'none',
                            border: this.state.card ? 'none' : '1px solid #FFFFFF33',
                            color: this.state.card ?  '#FFFFFF' :'#FFFFFF33'
                        }} onClick={() => this.setState({ card: true, sepa: false, wire: false })}>
                            {this.translate('page.body.wallets.tabs.deposit.fiat.button.card')}
                        </div>
                    </div>)
    }

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


    private redirectToEnable2fa = () => this.props.history.push(buildPath('/security/2fa', this.props.currentLanguage), { enable2fa: true });

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
        this.setState({ selectedWalletIndex: nextWalletIndex, withdrawDone: false });
        this.props.setMobileWalletUi(wallets[nextWalletIndex].name);
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
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
});

// tslint:disable-next-line:no-any
export const WalletsScreen = injectIntl(
    withRouter(connect(
        mapStateToProps,
        mapDispatchToProps
    )(WalletsComponent) as any)
);
