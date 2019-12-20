import * as React from 'react';
import { injectIntl } from 'react-intl';
import { ListItem } from './ListItem';
import { styles } from './styles';

export const BottomBanner = injectIntl(({intl}) => {
    const format = intl.formatMessage;

    return (
        <section id="bottom_banner" style={styles.mainWrapper}>
            <img style={styles.backgroundImg} src={require('./background-lines-white.svg')} />
            <div style={styles.content}>
                <div style={styles.headerWrapper}>
                    <h2 style={styles.headerMainText}>{format({id: 'page.referal.bottombanner.ieo'})}</h2>
                    <h4>{format({id: 'page.referal.bottombanner.dont_miss_chance'})}</h4>
                </div>
                <div style={styles.list}>
                    <ListItem
                        img={require('./icons/wallet.svg')}
                        header={format({id: 'page.referal.bottombanner.accepted_cur'})}
                    >
                        <span style={styles.currency}>
                            BTC, ETH, EUR, USD, USDT, Euro
                        </span>
                    </ListItem>
                    <ListItem
                        img={require('./icons/hand.svg')}
                        header={format({id: 'page.referal.bottombanner.IEO_token_price'})}
                    >
                        $0.4
                    </ListItem>
                    <ListItem
                        img={require('./icons/index.svg')}
                        header={format({id: 'page.referal.bottombanner.IEO_max_supply'})}
                    >
                        30 000 000 <span style={styles.currency}>EMRX*</span>
                    </ListItem>
                    <ListItem
                        img={require('./icons/money.svg')}
                        header={format({id: 'page.referal.bottombanner.IEO_start_date'})}
                    >
                        December 11, 2019
                    </ListItem>
                    <ListItem
                        img={require('./icons/investment.svg')}
                        header={format({id: 'page.referal.bottombanner.hard_cap'})}
                    >
                        $10 000 000**
                    </ListItem>
                    <ListItem
                        img={require('./icons/stock-price.svg')}
                        header={format({id: 'page.referal.bottombanner.token_distrib_date'})}
                    >
                        {format({id: 'page.referal.bottombanner.2_weeks_after_IEO'})}
                    </ListItem>
                </div>
                <a href="connext.emirex.com/ieo">
                    <button className="button-get" style={styles.btn}>
                        {format({id: 'page.referal.learn_more'})}
                    </button>
                </a>
            </div>
        </section>
    );
});
