/*tslint:disable */
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { SepaFragment } from './SepaFragment';
import { WireFragment } from './WireFragment';
import { TypeTabs } from '../TypeTabs';
import { CardDepositFiat } from '../../../custom/components/CardDepositFiat';
import { WalletHistory } from '../../../containers/Wallets/History';

// interface Styles {
//     card: React.CSSProperties
// }

// const styles: Styles = {
//     card: {
//         fontSize: '18px',
//         paddingTop: '20px',
//         textAlign: 'center',
//     }
// }

export const FiatFragment = injectIntl((props) => {
    const {
        intl,
        card,
        sepa,
        wire,
        currency,
        action,
        user,
    } = props;
    const translate = (id) => intl.formatMessage({ id });
    const levelMessage = translate('page.body.wallets.tabs.deposit.fiat.levelMessage');
    const levelLink = translate('page.body.wallets.tabs.deposit.fiat.levelLink');

    return (
        <React.Fragment>
            { <TypeTabs wire={wire} sepa={sepa} card={card} action={action} currency={currency.toLowerCase()}/>}
            {/* {card && <div style={styles.card}>{translate('comingsoon')}</div>}   */}
            {card && (user.level > 1 ?
                <div>
                    <CardDepositFiat currency={currency.toUpperCase()} translate={translate} />
                    <div className="fiat-alert">
                        {translate('page.wallets.withdraw.fiat')}
                    </div>
                    {currency && <WalletHistory label="deposit" type="deposits" currency={currency} />}
                </div> :
                <div style={{padding: '10px 20px', color: 'red', fontSize: '20px'}}>  
                    <p>{levelMessage}</p>                            
                    <p><a href="/confirm">{levelLink}</a></p>
                </div>
            )}
            {sepa && <SepaFragment {...props}/>}
            {wire && <WireFragment {...props} />}
        </React.Fragment>
    );
});