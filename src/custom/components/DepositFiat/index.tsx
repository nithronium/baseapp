import * as React from 'react';
import { FormattedMessage } from 'react-intl';


interface DepositFiatProps {
    description: string;
    details: string;
    title: string;
    uid: string;
}


const bankData = uid => [
    {
        key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.depositCurrency" />,
        value: 'USD',
    },
    {
        key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.iban" />,
        value: 'AE 240570000011101251020',
    },
    {
        key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.bankName" />,
        value: 'Ajman Bank PJSC',
    },
    {
        key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.bankAddress" />,
        value: 'Garhoud Branch, Dubai, UAE',
    },
    {
        key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.bankSwift" />,
        value: 'AJMNAEAJ',
    },
    {
        key: <FormattedMessage id="page.body.wallets.tabs.deposit.fiat.referenceCode" />,
        value: uid,
    },
];

/**
 * Component to display bank account details which can be used for a
 * deposit
 */
const DepositFiat: React.FunctionComponent<DepositFiatProps> = (props: DepositFiatProps) => {
    const {
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
            <div className="cr-deposit-fiat-credentials">{bankData(uid).map(renderDetails)}</div>
            <p className="cr-deposit-fiat__description">{details}</p>
        </div>
    );
};

export {
    DepositFiat,
    DepositFiatProps,
};
