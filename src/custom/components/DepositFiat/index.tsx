import * as React from 'react';
import { FormattedMessage } from 'react-intl';


interface DepositFiatProps {
    currency: string;
    description: string;
    details: string;
    title: string;
    uid: string;
    sepa?: boolean;
    isMore?: boolean;
}


const bankDataIBAN = (uid, currency) => [
    {
        key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.depositCurrency" />,
        value: <FormattedMessage id={`page.body.wallets.tabs.deposit.fiat.depositCurrency.${currency && `${currency}.`}value`} />,
    },
    {
        key: <FormattedMessage id={`page.body.wallets.tabs.deposit.fiat.${currency}.iban`} />,
        value: <FormattedMessage id={`page.body.wallets.tabs.deposit.fiat.iban.${currency && `${currency}.`}value`} />,
    },
    {
        key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.bankName" />,
        value: <FormattedMessage id={`page.body.wallets.tabs.deposit.fiat.bankName.${currency && `${currency}.`}value`} />,
    },
    {
        key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.bankAddress" />,
        value: <FormattedMessage id={`page.body.wallets.tabs.deposit.fiat.bankAddress.${currency && `${currency}.`}value`} />,
    },
    {
        key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.bankSwift" />,
        value: <FormattedMessage id={`page.body.wallets.tabs.deposit.fiat.bankSwift.${currency && `${currency}.`}value`} />,
    },
    {
        key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.referenceCode"/>,
        value: uid,
    },
];

const bankDataAED = (uid, currency) => [
    {
        key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.depositCurrency" />,
        value: <FormattedMessage id={`page.body.wallets.tabs.deposit.fiat.depositCurrency.${currency && `${currency}.`}value`} />,
    },
    {
        key: <FormattedMessage id={`page.body.wallets.tabs.deposit.fiat.${currency}.iban`} />,
        value: <FormattedMessage id={`page.body.wallets.tabs.deposit.fiat.iban.${currency && `${currency}.`}value`} />,
    },
    {
        key: <FormattedMessage id={`page.body.wallets.tabs.deposit.fiat.beneficiary`} />,
        value: <FormattedMessage id={`page.body.wallets.tabs.deposit.fiat.beneficiary.aed.value`} />,
    },
    {
        key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.bankName" />,
        value: <FormattedMessage id={`page.body.wallets.tabs.deposit.fiat.bankName.${currency && `${currency}.`}value`} />,
    },
    {
        key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.bankAddress" />,
        value: <FormattedMessage id={`page.body.wallets.tabs.deposit.fiat.bankAddress.${currency && `${currency}.`}value`} />,
    },
    {
        key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.bankSwift" />,
        value: <FormattedMessage id={`page.body.wallets.tabs.deposit.fiat.bankSwift.${currency && `${currency}.`}value`} />,
    },
    {
        key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.referenceCode"/>,
        value: uid,
    },
];

const bankDataSEPA = (uid, isMore) => [
    {
        key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.depositCurrency" />,
        value: <FormattedMessage id={`page.body.wallets.tabs.deposit.fiat.depositCurrency.sepa${isMore ? 'More' : 'Less'}.value`} />,
    },
    {
        key: <FormattedMessage id={`page.body.wallets.tabs.deposit.fiat.eur.sepa`} />,
        value: <FormattedMessage id={`page.body.wallets.tabs.deposit.fiat.sepa${isMore ? 'More' : 'Less'}.value`} />,
    },
    {
        key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.bankName" />,
        value: <FormattedMessage id={`page.body.wallets.tabs.deposit.fiat.bankName.sepa${isMore ? 'More' : 'Less'}.value`} />,
    },
    {
        key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.bankAddress" />,
        value: <FormattedMessage id={`page.body.wallets.tabs.deposit.fiat.bankAddress.sepa${isMore ? 'More' : 'Less'}.value`} />,
    },
    {
        key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.bankSwift" />,
        value: <FormattedMessage id={`page.body.wallets.tabs.deposit.fiat.bankSwift.sepa${isMore ? 'More' : 'Less'}.value`} />,
    },
    {
        key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.referenceCode"/>,
        value: uid,
    },
];


const minimal1 = (currency, sepa) => <FormattedMessage id={`page.body.wallets.tabs.deposit.fiat.minimal.${currency && `${currency}.`}text${sepa ? '.sepa' : ''}`} />;

const minimal = (currency, sepa) => <FormattedMessage id={`page.body.wallets.tabs.deposit.fiat.minimal.${currency && `${currency}.`}value${sepa ? '.sepa' : ''}`} />;

const sepaFee = isMore => <FormattedMessage id={`page.body.wallets.tabs.deposit.fiat.minimal.eur.value.sepa${isMore ? 'More' : 'Less'}`} />;

/**
 * Component to display bank account details which can be used for a
 * deposit
 */
const DepositFiat: React.FunctionComponent<DepositFiatProps> = (props: DepositFiatProps) => {
    const {
        currency,
        description,
        details,
        title,
        uid,
        sepa,
        isMore,
    } = props;
    const bankData = sepa ? bankDataSEPA : currency.toLowerCase() === 'aed' ? bankDataAED : bankDataIBAN;

    const renderDetails = (detail, index: number) => {
        const isRefCodDetail = detail.value === uid;
        return (
            <div className="cr-deposit-fiat-detail" key={index}>
                <p className="cr-deposit-fiat-detail__label">{detail.key}</p>
                <p
                    style={{color: isRefCodDetail ? '#E85E59' : ''}}
                    className="cr-deposit-fiat-detail__value"
                >
                    {detail.value}
                </p>
            </div>
        );
    };

    return (
        <div className="cr-deposit-fiat">
            <p className="cr-deposit-fiat__title">{title}</p>
            <p className="cr-deposit-fiat__description">{description}</p>
            {currency ? <p className="cr-deposit-fiat__description">{minimal1(currency, sepa)}<b>{minimal(currency, sepa)}</b> {sepa && sepaFee(isMore)}</p> : null}
            <div className="cr-deposit-fiat-credentials">{bankData(uid, sepa ? isMore : currency).map(renderDetails)}</div>
            <p className="cr-deposit-fiat__description">{details}</p>
        </div>
    );
};

export {
    DepositFiat,
    DepositFiatProps,
};
