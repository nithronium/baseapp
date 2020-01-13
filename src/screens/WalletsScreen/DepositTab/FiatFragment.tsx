/*tslint:disable */
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { SepaFragment } from './SepaFragment';
import { WireFragment } from './WireFragment';
import { TypeTabs } from '../TypeTabs';
import { CardDepositFiat } from '../../../custom/components/CardDepositFiat';
import { WalletHistory } from '../../../containers/Wallets/History';
import { MINIMAL_BALANCE } from '../../../constants';

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
        balance,
        message,
        history,
    } = props;
    const translate = (id) => intl.formatMessage({ id });
    const levelMessage = translate('page.body.wallets.tabs.deposit.fiat.levelMessage');
    const levelLink = translate('page.body.wallets.tabs.deposit.fiat.levelLink');
    // console.log(user);

    const checkBalace = (e) => {
        e.preventDefault();
        if (balance < MINIMAL_BALANCE && user.level < 6 && user.level > 1) {
            message({ message: ['page.profile.update.balance'], type: 'error' });
        } else {
            history.push('/confirm');
        }
    };

    return (
        <React.Fragment >
             
                {<TypeTabs wire={wire} sepa={sepa} card={card} action={action} currency={currency.toLowerCase()} />}
    
            {/* {card && <div style={styles.card}>{translate('comingsoon')}</div>}   */}
             
            {card && (user.level > 3 ?
                <div>
                    <CardDepositFiat currency={currency.toUpperCase()} translate={translate} />
                    <div className="fiat-alert">
                        {translate('page.wallets.withdraw.fiat')}
                    </div>
                    {currency && <WalletHistory label="deposit" type="deposits" currency={currency} />}
                </div> :
                <div style={{padding: '10px 20px', color: '#648280', fontSize: '20px'}}>  
                    <p>{levelMessage}</p>                            
                    <p><a style={{color: '#FFD567', cursor: 'pointer', textDecoration: 'underline'}} onClick={checkBalace}>{levelLink}</a></p>
                </div>
                )}

            {sepa && <SepaFragment {...props}/>}
            {wire && <WireFragment {...props} />}
 
                
        </React.Fragment>
    );
});