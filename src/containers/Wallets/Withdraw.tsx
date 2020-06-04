// tslint:disable:jsx-no-lambda
import { Button ,/*Decimal,*/ Input } from '@openware/components';
import classnames from 'classnames';
import * as React from 'react';
import {
    CustomInput,
    /*SummaryField,*/
    WhiteList,
} from '../../components';
import { Beneficiary } from '../../modules';

interface WithdrawProps {
    borderItem?: string;
    currency: string;
    fee: number;
    sepa: boolean;
    wire: boolean;
    card: boolean;
    onClick: (amount: number, total: number, beneficiary: Beneficiary, otpCode: string) => void;
    fixed: number;
    className?: string;
    type: 'fiat' | 'coin';
    twoFactorAuthRequired?: boolean;
    withdrawAmountLabel?: string;
    withdrawReceiveLabel?: string;
    withdrawTransactionLabel?: string;
    withdraw2faLabel?: string;
    withdrawFeeLabel?: string;
    withdrawTotalLabel?: string;
    withdrawButtonLabel?: string;
    inputErrorText?: string;
    withdrawDone: boolean;
    soon: string;
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

interface WithdrawState {
    amount: number | string;
    beneficiary: Beneficiary;
    otpCode: string;
    withdrawAmountFocused: boolean;
    withdrawReceiveFocused: boolean;
    withdrawTransactionFocused: boolean;
    withdrawCodeFocused: boolean;
    total: number;
    inputError: boolean;
}

type Props = WithdrawProps;

class Withdraw extends React.Component<Props, WithdrawState> {
    public state = {
        amount: 0,
        beneficiary: defaultBeneficiary,
        otpCode: '',
        withdrawAmountFocused: false,
        withdrawReceiveFocused: false,
        withdrawTransactionFocused: false,
        withdrawCodeFocused: false,
        total: 0,
        inputError: false,
    };

    public componentWillReceiveProps(nextProps) {
        if (this.props.currency !== nextProps.currency || nextProps.withdrawDone) {
            this.setState({
                amount: 0,
                otpCode: '',
                total: 0,
            });
        }
    }
    public componentDidMount(): void {
        this.setState({
            amount: this.props.fee * 2,
            total: this.props.fee,
        });
    }

    // @ts-ignore
    private trueFixed = num => {
        if (num[num.length - 1] === '0') {
            return this.trueFixed(num.slice(0, -1));
        } else {
            return num;
        }
    };

    public render() {
        const {
            amount,
            beneficiary,
            total,
            withdrawAmountFocused,
            withdrawReceiveFocused,
            withdrawTransactionFocused,
            otpCode,
            inputError,
        } = this.state;
        const {
            // borderItem,
            className,
            currency,
            type,
            fee,
            twoFactorAuthRequired,
            withdrawAmountLabel,
            // withdrawFeeLabel,
            withdrawReceiveLabel,
            withdrawTransactionLabel,
            withdrawButtonLabel,
            card,
            soon,
            fixed,
            inputErrorText,
        } = this.props;
        //tslint:disable-next-line:no-console
        const cx = classnames('cr-withdraw', className);
        const lastDividerClassName = classnames('cr-withdraw__divider', {
            'cr-withdraw__divider-one': twoFactorAuthRequired,
            'cr-withdraw__divider-two': !twoFactorAuthRequired,
        });

        const withdrawReceiveClass = classnames('cr-withdraw__group__receive', {
          'cr-withdraw__group__receive--focused': withdrawReceiveFocused,
        });

        const withdrawTransactionClass = classnames('cr-withdraw__group__transaction', {
          'cr-withdraw__group__transaction--focused': withdrawTransactionFocused,
        });

        const withdrawAmountClass = classnames('cr-withdraw__group__amount', {
          'cr-withdraw__group__amount--focused': withdrawAmountFocused,
        });
// tslint:disable
        return (
            card ? <div style={{fontSize: '18px', margin: '20px auto', maxWidth: '200px'}}>{soon}</div> :
            <div className={cx}>
                <div className="cr-withdraw-column">
                    <div className="cr-withdraw__group__address">
                        <WhiteList
                            currency={currency}
                            type={type}
                            onChangeValue={this.handleChangeBeneficiary}
                        />
                    </div>
                    <div className="cr-withdraw__divider cr-withdraw__divider-one" />
                    <div className={withdrawAmountClass}>
                        <label className="cr-withdraw__label">
                            {(Number(amount) >= 0) && withdrawAmountLabel}
                        </label>
                        <Input
                            type="number"
                            value={amount}
                            placeholder={withdrawAmountLabel}
                            className="cr-withdraw__input"
                            onFocus={() => this.handleFieldFocus('amount')}
                            onBlur={() => this.handleFieldFocus('amount')}
                            onChangeValue={type === 'fiat' ? this.handleChangeInputAmountFiat : this.handleChangeInputAmountCoin}
                        />
                        {inputError && <div className={"fiat-alert"}>{inputErrorText}</div>}
                    </div>
                    <div className={lastDividerClassName} />
                    {twoFactorAuthRequired && this.renderOtpCodeInput()}
                    { type !== 'fiat' && <React.Fragment>
                        <div className={withdrawReceiveClass}>
                            <label className="cr-withdraw__label">
                                {(Number(amount) >= 0) && withdrawReceiveLabel}
                            </label>
                            <Input
                                type="text"
                                value={(+amount - fee) > 0 ? this.trueFixed((+amount - fee).toFixed(fixed)) : 0}
                                placeholder={withdrawReceiveLabel}
                                className="cr-withdraw__input"
                                onFocus={() => {}}
                                onBlur={() => {}}
                                onChangeValue={() => {}}
                            />
                            <div className="cr-withdraw__group__close" />
                        </div>
                        <div className={withdrawTransactionClass}>
                            <label className="cr-withdraw__label">
                                {withdrawTransactionLabel}
                            </label>
                            <Input
                                type="text"
                                value={fee}
                                className="cr-withdraw__input"
                                onFocus={() => {}}
                                onBlur={() => {}}
                                onChangeValue={() => {}}
                            />
                            <div className="cr-withdraw__group__close" />
                        </div>
                    </React.Fragment> }
                </div>
                
                <div className="cr-withdraw-column" style={{justifyContent: 'flex-start'}}>
                    
                    {/* <div>
                        <SummaryField
                            className="cr-withdraw__summary-field"
                            message={withdrawFeeLabel ? withdrawFeeLabel : 'Fee'}
                            content={this.renderFee()}
                            borderItem={borderItem}
                        />
                        <SummaryField
                            className="cr-withdraw__summary-field"
                            message={withdrawTotalLabel ? withdrawTotalLabel : 'Total Withdraw Amount'}
                            content={this.renderTotal()}
                            borderItem={borderItem}
                        />
                    </div> */}
                    <div className="cr-withdraw__deep" >
                        <Button
                            className="cr-withdraw__button"
                            label={withdrawButtonLabel ? withdrawButtonLabel : 'WITHDRAW'}
                            onClick={this.handleClick}
                            disabled={Number(total) <= 0 || !Boolean(beneficiary.id) || !Boolean(otpCode)}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // private renderFee = () => {
    //     const { fee, fixed, currency } = this.props;
    //     return (
    //         <span>
    //             <Decimal fixed={fixed}>{fee.toString()}</Decimal> {currency.toUpperCase()}
    //         </span>
    //     );
    // };

    // private renderTotal = () => {
    //     const total = this.state.total;
    //     const { fixed, currency } = this.props;
    //     return total ? (
    //         <span>
    //             <Decimal fixed={fixed}>{total.toString()}</Decimal> {currency.toUpperCase()}
    //         </span>
    //     ) : <span>0 {currency.toUpperCase()}</span>;
    // };

    private renderOtpCodeInput = () => {
        const { otpCode, withdrawCodeFocused } = this.state;
        const { withdraw2faLabel } = this.props;
        const withdrawCodeClass = classnames('cr-withdraw__group__code', {
          'cr-withdraw__group__code--focused': withdrawCodeFocused,
        });
        return (
            <React.Fragment>
                <div className={withdrawCodeClass}>
                    <CustomInput
                        type="text"
                        label={withdraw2faLabel || '2FA code'}
                        placeholder={withdraw2faLabel || '2FA code'}
                        defaultLabel="2FA code"
                        handleChangeInput={this.handleChangeInputOtpCode}
                        inputValue={otpCode}
                        handleFocusInput={() => this.handleFieldFocus('code')}
                        classNameLabel="cr-withdraw__label"
                        classNameInput="cr-withdraw__input"
                        autoFocus={false}
                    />
                </div>
                <div className="cr-withdraw__divider cr-withdraw__divider-two" />
            </React.Fragment>
        );
    };

    private handleClick = () => this.props.onClick(
        parseFloat(`${this.state.amount}`),
        this.state.total,
        this.state.beneficiary,
        this.state.otpCode,
    );

    private handleFieldFocus = (field: string) => {
        switch (field) {
            case 'amount':
                this.setState(prev => ({
                    withdrawAmountFocused: !prev.withdrawAmountFocused,
                }));
                break;
            case 'receive':
                this.setState(prev => ({
                    withdrawReceiveFocused: !prev.withdrawReceiveFocused,
                }));
                break;
            case 'transaction':
                this.setState(prev => ({
                    withdrawTransactionFocused: !prev.withdrawTransactionFocused,
                }));
                break;
            case 'code':
                this.setState(prev => ({
                    withdrawCodeFocused: !prev.withdrawCodeFocused,
                }));
                break;
            default:
                break;
        }
    };

    private handleChangeInputAmountCoin = (text: string) => {
        const { fixed, fee } = this.props;
        const value = (text !== '') ? Number(parseFloat(text).toFixed(fixed)) : 0;
        const total = (value - fee) || 0;
        if (total <= fee && (value < (fee * 2))) {
            this.setTotal(fee);
            this.setState({inputError: true});
        } else {
            this.setTotal(total);
            this.setState({inputError: false});
        }
        this.setState({ amount: text});
    };

    private handleChangeInputAmountFiat = (text: string) => {
        const { fixed } = this.props;
        const value = (text !== '') ? Number(parseFloat(text).toFixed(fixed)) : '';
        const total = (value !== '') ? value - this.props.fee : 0;
        if (total < 0) {
            this.setState({total: 0});
        } else {
            this.setState({total});
        }
        this.setState({ amount: value });
    };

    private setTotal = (value: number) => {
        this.setState({ total: value });
    };

    private handleChangeBeneficiary = (value: Beneficiary) => {
        this.setState({
            beneficiary: value,
        });
    };

    private handleChangeInputOtpCode = (otpCode: string) => {
        this.setState({ otpCode });
    };
}

export {
    Withdraw,
    WithdrawProps,
    WithdrawState,
};
