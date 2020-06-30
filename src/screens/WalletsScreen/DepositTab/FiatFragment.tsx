// tslint:disable:jsx-no-multiline-js
import * as React from 'react';
import { injectIntl } from 'react-intl';
// import { MINIMAL_BALANCE } from '../../../constants';
import { WalletHistory } from '../../../containers/Wallets/History';
import { BlurComponent, CardDepositFiat } from '../../../custom/components';
import { buildPath } from '../../../custom/helpers';
import { TypeTabs } from '../TypeTabs';
import { SepaFragment } from './SepaFragment';
import { WireFragment } from './WireFragment';

export const FiatFragment = injectIntl(props => {
    const {
        intl,
        card,
        colorTheme,
        sepa,
        wire,
        currency,
        action,
        user,
        // balance,
        // message,
        history,
        lang,
        onError,
    } = props;

    const translate =id => intl.formatMessage({ id });
    const levelMessage = translate('page.body.wallets.tabs.deposit.fiat.levelMessage');
    const levelLink = translate('page.body.wallets.tabs.deposit.fiat.levelLink');

    const checkBalace = e => {
        e.preventDefault();
        history.push(buildPath('/confirm', lang));
        // if (balance < MINIMAL_BALANCE && (user.level < 4 && user.level > 1)) {
        //     message({ message: ['page.profile.update.balance'], type: 'error' });
        // } else {
        //     history.push(buildPath('/confirm', lang));
        // }
    };

    return (
        <React.Fragment >

            {<TypeTabs wire={wire} sepa={sepa} card={card} action={action} currency={currency.toLowerCase()} colorTheme={colorTheme}/>}

            {/* {card && <div style={styles.card}>{translate('comingsoon')}</div>}   */}
            <BlurComponent isBlur={user.level < 4}>
                {card && (user.level > 4 ?
                    <div>
                        <CardDepositFiat
                            currency={currency.toUpperCase()}
                            translate={translate}
                            colorTheme={colorTheme}
                            user={user}
                            onError={onError}
                        />
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
            </BlurComponent>

        </React.Fragment>
    );
});
