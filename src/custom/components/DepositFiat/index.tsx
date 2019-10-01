import * as React from 'react';
import { FormattedMessage } from 'react-intl';


interface DepositFiatProps {
    currency: string;
    description: string;
    details: string;
    title: string;
    uid: string;
}


const bankData = (uid, currency) => [
    {
        key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.depositCurrency" />,
        value: <FormattedMessage id={`page.body.wallets.tabs.deposit.fiat.depositCurrency.${currency && `${currency}.`}value`} />,
    },
    {
        key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.iban" />,
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
        key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.referenceCode" />,
        value: uid,
    },
];

const minimal = (currency) => <FormattedMessage id={`page.body.wallets.tabs.deposit.fiat.minimal.${currency && `${currency}.`}value`} />

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
    } = props;

    const renderDetails = (detail, index: number) => {
        return (
            <div className="cr-deposit-fiat-detail" key={index}>
                <p className="cr-deposit-fiat-detail__label">{detail.key}:</p>
                <p className="cr-deposit-fiat-detail__value">{detail.value}</p>
            </div>
        );
    };

    return (
        <div className="cr-deposit-fiat">
            <p className="cr-deposit-fiat__title">{title}</p>
            <p className="cr-deposit-fiat__description">{description}</p>
            {currency ? <p className="cr-deposit-fiat__description"><b>{minimal(currency)}</b></p> : null}
            <div className="cr-deposit-fiat-credentials">{bankData(uid, currency).map(renderDetails)}</div>
            <p className="cr-deposit-fiat__description">{details}</p>
        </div>
    );
};

export {
    DepositFiat,
    DepositFiatProps,
};
