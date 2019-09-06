import classnames from 'classnames';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { TipIcon } from '../../assets/images/TipIcon';
import { TrashBin } from '../../assets/images/TrashBin';
import {
    beneficiariesDelete,
    Beneficiary,
    BeneficiaryBank,
    RootState,
    selectBeneficiaries,
    selectBeneficiariesCreate,
} from '../../modules';
import { WhiteListActivateModal } from './WhiteListActivateModal';
import { WhiteListAddModal } from './WhiteListAddModal';

interface ReduxProps {
    whitelist: Beneficiary[];
    whitelistAddData: Beneficiary;
}

interface DispatchProps {
    deleteAddress: typeof beneficiariesDelete;
}

interface OwnProps {
    currency: string;
    type: 'fiat' | 'coin';
    onChangeValue: (beneficiary: Beneficiary) => void;
}

interface State {
    currentWithdrawalBeneficiary: Beneficiary;
    isOpenAddressModal: boolean;
    isOpenConfirmationModal: boolean;
    isOpenDropdown: boolean;
    isOpenTip: boolean;
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

type Props = ReduxProps & DispatchProps & OwnProps & InjectedIntlProps;

// tslint:disable jsx-no-multiline-js
class WhiteListComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            currentWithdrawalBeneficiary: defaultBeneficiary,
            isOpenAddressModal: false,
            isOpenConfirmationModal: false,
            isOpenDropdown: false,
            isOpenTip: false,
        };
    }

    public componentDidMount() {
        const { currency, whitelist } = this.props;
        if (currency && whitelist.length) {
            const filtredWhitelist = this.handleFilterByState(this.handleFilterByCurrency(whitelist, currency));
            if (filtredWhitelist.length) {
                this.handleSetCurrentAddress(filtredWhitelist[0]);
            }
        }
    }

    public componentWillReceiveProps(nextProps: Props) {
        const { currency, whitelist } = this.props;

        if ((nextProps.currency && nextProps.currency !== currency) ||
            (nextProps.whitelist.length && nextProps.whitelist !== whitelist)) {
            const filtredWhitelist = this.handleFilterByState(this.handleFilterByCurrency(nextProps.whitelist, nextProps.currency));

            if (filtredWhitelist.length) {
                this.handleSetCurrentAddress(filtredWhitelist[0]);
            }
        }
    }

    public render() {
        const {
            currency,
            type,
            whitelist,
            whitelistAddData,
        } = this.props;
        const {
            currentWithdrawalBeneficiary,
            isOpenAddressModal,
            isOpenConfirmationModal,
        } = this.state;
        const filtredWhitelist = this.handleFilterByState(this.handleFilterByCurrency(whitelist, currency));

        return (
            <div className="cr-white-list">
                <span className="cr-white-list__title">{type === 'coin' ? this.translate('page.body.wallets.whitelist.title') : this.translate('page.body.wallets.whitelist.fiat.title')}</span>
                {filtredWhitelist.length ? this.renderAddressDropdown(filtredWhitelist, currentWithdrawalBeneficiary, type) : this.renderAddAddress()}
                {isOpenAddressModal && (
                    <WhiteListAddModal
                        currency={currency}
                        type={type}
                        handleToggleAddAddressModal={this.handleToggleAddAddressModal}
                        handleToggleConfirmationModal={this.handleToggleConfirmationModal}
                    />
                )}
                {isOpenConfirmationModal && (
                    <WhiteListActivateModal
                        whitelistAddData={whitelistAddData}
                        handleToggleConfirmationModal={this.handleToggleConfirmationModal}
                    />
                )}
            </div>
        );
    }

    private renderAddAddress = () => {
        return (
            <div className="cr-white-list__add" onClick={this.handleClickToggleAddAddressModal()}>
                <span className="cr-white-list__add__label">{this.translate('page.body.wallets.whitelist.addAddress')}</span>
                <img src={require('../../assets/images/PlusIcon.svg')} className="cr-white-list__add__icon"/>
            </div>
        );
    }

    private renderDropdownItem = (item: Beneficiary, index: number, type: 'fiat' | 'coin') => {
        if (type === 'fiat') {
            return (
                <div key={index} className="cr-white-list__dropdown__body__item item">
                    <div className="item__left" onClick={this.handleClickSelectAddress(item)}>
                        <span className="item__left__title">{this.translate('page.body.wallets.whitelist.dropdown.fiat.name')}</span>
                        <span className="item__left__address">{item.name}</span>
                    </div>
                    <div className="item__left" onClick={this.handleClickSelectAddress(item)}>
                        <span className="item__left__title">{this.translate('page.body.wallets.whitelist.dropdown.fiat.fullName')}</span>
                        <span className="item__left__address">{item.data ? (item.data as BeneficiaryBank).full_name : ''}</span>
                    </div>
                    <div className="item__right">
                        <span className="item__right__delete" onClick={this.handleClickDeleteAddress(item)}><TrashBin/></span>
                    </div>
                </div>
            );
        }

        return (
            <div key={index} className="cr-white-list__dropdown__body__item item">
                <div className="item__left" onClick={this.handleClickSelectAddress(item)}>
                    <span className="item__left__title">{this.translate('page.body.wallets.whitelist.dropdown.address')}</span>
                    <span className="item__left__address">{item.data ? item.data.address : ''}</span>
                </div>
                <div className="item__right">
                    <span className="item__right__delete" onClick={this.handleClickDeleteAddress(item)}><TrashBin/></span>
                </div>
            </div>
        );
    }

    private renderDropdownBody = (whitelist: Beneficiary[], type: 'fiat' | 'coin') => {
        const dropdownBodyClassName = classnames('cr-white-list__dropdown__body', {
            'fiat-body': type === 'fiat',
        });

        return (
            <div className={dropdownBodyClassName}>
                {whitelist && whitelist.map((item, index) => this.renderDropdownItem(item, index, type))}
                <div className="cr-white-list__dropdown__body__add add" onClick={this.handleClickToggleAddAddressModal()}>
                    <span className="add__label">{this.translate('page.body.wallets.whitelist.addAddress')}</span>
                    <img className="add__icon" src={require('../../assets/images/PlusIcon.svg')}/>
                </div>
            </div>
        );
    }

    private renderDropdownTipCryptoNote = (note: string) => {
        return (
            <div className="tip__content__block">
                <span className="tip__content__block__label">{this.translate('page.body.wallets.whitelist.tipDescription')}</span>
                <span className="tip__content__block__value">{note}</span>
            </div>
        );
    }

    private renderDropdownTipCrypto = (currentWithdrawalBeneficiary: Beneficiary) => {
        if (currentWithdrawalBeneficiary) {
            return (
                <div className="cr-white-list__dropdown__tip tip">
                    <div className="tip__content">
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">{this.translate('page.body.wallets.whitelist.tipAddress')}</span>
                            <span className="tip__content__block__value">{currentWithdrawalBeneficiary.data.address}</span>
                        </div>
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">{this.translate('page.body.wallets.whitelist.tipName')}</span>
                            <span className="tip__content__block__value">{currentWithdrawalBeneficiary.name}</span>
                        </div>
                        {currentWithdrawalBeneficiary.description && this.renderDropdownTipCryptoNote(currentWithdrawalBeneficiary.description)}
                    </div>
                </div>
            );
        }

        return;
    }

    private renderDropdownTipFiatDescription = (description: string) => {
        return (
            <div className="tip__content__block">
                <span className="tip__content__block__label">{this.translate('page.body.wallets.whitelist.dropdown.fiat.description')}</span>
                <span className="tip__content__block__value">{description}</span>
            </div>
        );
    }

    private renderDropdownTipFiat = (currentWithdrawalBeneficiary: Beneficiary) => {
        if (currentWithdrawalBeneficiary) {
            return (
                <div className="cr-white-list__dropdown__tip tip fiat-tip">
                    <div className="tip__content">
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">{this.translate('page.body.wallets.whitelist.dropdown.fiat.name')}</span>
                            <span className="tip__content__block__value">{currentWithdrawalBeneficiary.name}</span>
                        </div>
                        {currentWithdrawalBeneficiary.description && this.renderDropdownTipFiatDescription(currentWithdrawalBeneficiary.description)}
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">{this.translate('page.body.wallets.whitelist.dropdown.fiat.account')}</span>
                            <span className="tip__content__block__value">{(currentWithdrawalBeneficiary.data as BeneficiaryBank).account_number}</span>
                        </div>
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">{this.translate('page.body.wallets.whitelist.dropdown.fiat.bankOfBeneficiary')}</span>
                            <span className="tip__content__block__value">{(currentWithdrawalBeneficiary.data as BeneficiaryBank).bank_name}</span>
                        </div>
                    </div>
                </div>
            );
        }

        return;
    }

    private renderAddressDropdown = (whitelist: Beneficiary[], currentWithdrawalBeneficiary: Beneficiary, type: 'fiat' | 'coin') => {
        const { isOpenDropdown, isOpenTip } = this.state;

        const dropdownClassName = classnames('cr-white-list__dropdown', {
            'cr-white-list__dropdown--open': isOpenDropdown,
        });

        if (type === 'fiat') {
            return (
                <div className={dropdownClassName}>
                    <div className="cr-white-list__dropdown__select fiat-select select" onClick={this.handleToggleDropdown}>
                        <div className="select__left">
                            <span className="select__left__title">{this.translate('page.body.wallets.whitelist.dropdown.fiat.name')}</span>
                            <span className="select__left__address">{currentWithdrawalBeneficiary.name}</span>
                            <span className="select_left__title">{this.translate('page.body.wallets.whitelist.dropdown.fiat.fullName')}</span>
                            <span className="select__left__address">{currentWithdrawalBeneficiary.data ? (currentWithdrawalBeneficiary.data as BeneficiaryBank).full_name : ''}</span>
                        </div>
                        <div className="select__right">
                        <span className="select__right__tip" onMouseOver={this.handleToggleTip} onMouseOut={this.handleToggleTip}><TipIcon/></span>
                        <span className="select__right__select">{this.translate('page.body.wallets.whitelist.dropdown.select')}</span>
                        <span className="select__right__chevron"><img src={require('../../assets/images/ChevronIcon.svg')}/></span>
                        </div>
                    </div>
                    {isOpenDropdown && this.renderDropdownBody(whitelist, type)}
                    {isOpenTip && this.renderDropdownTipFiat(currentWithdrawalBeneficiary)}
                </div>
            );
        }

        return (
            <div className={dropdownClassName}>
                <div className="cr-white-list__dropdown__select select" onClick={this.handleToggleDropdown}>
                    <div className="select__left">
                        <span className="select__left__title">{this.translate('page.body.wallets.whitelist.dropdown.address')}</span>
                        <span className="select__left__address">{currentWithdrawalBeneficiary.data.address}</span>
                    </div>
                    <div className="select__right">
                    <span className="select__right__tip" onMouseOver={this.handleToggleTip} onMouseOut={this.handleToggleTip}><TipIcon/></span>
                    <span className="select__right__select">{this.translate('page.body.wallets.whitelist.dropdown.select')}</span>
                    <span className="select__right__chevron"><img src={require('../../assets/images/ChevronIcon.svg')}/></span>
                    </div>
                </div>
                {isOpenDropdown && this.renderDropdownBody(whitelist, type)}
                {isOpenTip && this.renderDropdownTipCrypto(currentWithdrawalBeneficiary)}
            </div>
        );
    }

    private handleClickDeleteAddress = (item: Beneficiary) => () => {
        this.handleDeleteAddress(item);
    }

    private handleClickSelectAddress = (item: Beneficiary) => () => {
        this.handleSetCurrentAddress(item);
    }

    private handleClickToggleAddAddressModal = () => () => {
        this.handleToggleAddAddressModal();
    }

    private handleDeleteAddress = (item: Beneficiary) => {
        const payload = {
            id: item.id,
        };

        this.props.deleteAddress(payload);
    }

    private handleFilterByCurrency = (whitelist: Beneficiary[], currency: string) => {
        if (whitelist.length && currency) {
            return whitelist.filter(item => item.currency.toLowerCase() === currency.toLowerCase());
        }

        return [];
    }

    private handleFilterByState = (whitelist: Beneficiary[]) => {
        if (whitelist.length) {
            return whitelist.filter(item => item.state.toLowerCase() === 'active');
        }
        return [];
    }

    private handleSetCurrentAddress = (item: Beneficiary) => {
        if (item.data) {
            this.setState({
                currentWithdrawalBeneficiary: item,
                isOpenDropdown: false,
            });
            this.props.onChangeValue(item);
        }
    }

    private handleToggleAddAddressModal = () => {
        this.setState(prevState => ({
            isOpenAddressModal: !prevState.isOpenAddressModal,
        }));
    }

    private handleToggleConfirmationModal = () => {
        this.setState(prevState => ({
            isOpenConfirmationModal: !prevState.isOpenConfirmationModal,
        }));
    }

    private handleToggleDropdown = () => {
        this.setState(prevState => ({
            isOpenDropdown: !prevState.isOpenDropdown,
        }));
    }

    private handleToggleTip = () => {
        this.setState(prevState => ({
            isOpenTip: !prevState.isOpenTip,
        }));
    }

    private translate = (id: string) => this.props.intl.formatMessage({ id });
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    whitelist: selectBeneficiaries(state),
    whitelistAddData: selectBeneficiariesCreate(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    deleteAddress: payload => dispatch(beneficiariesDelete(payload)),
});

// tslint:disable-next-line:no-any
export const WhiteList = injectIntl(connect(mapStateToProps, mapDispatchToProps)(WhiteListComponent) as any);
