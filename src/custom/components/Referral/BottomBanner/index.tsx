import * as React from 'react';
import { injectIntl } from 'react-intl';
import { ListItem } from './ListItem';
import { styles } from './styles';

export const BottomBanner = injectIntl(({ intl }) => {
    const format = intl.formatMessage;

    return (
        <section id="bottom_banner" style={styles.mainWrapper}>
            {/* <img style={styles.backgroundImg} src={require('./background-lines-white.svg')} /> */}
            <div style={styles.content}>
                <div style={styles.headerWrapper}>
                    <h2 style={{ ...styles.headerMainText, textAlign: 'center' }}>
                        {format({ id: 'page.referal.bottombanner.ieo' })}
                    </h2>
                    {/* <h4>{format({id: 'page.referal.bottombanner.dont_miss_chance'})}</h4> */}
                </div>
                <div style={styles.list}>
                    <ListItem
                        img={require('./icons/investment.svg')}
                        header={format({ id: 'page.referal.bottombanner.accepted_cur' })}
                    >
                        <p style={styles.currency}>{format({ id: 'page.referal.bottombanner.accepted_cur_value' })}</p>
                    </ListItem>
                    <ListItem
                        img={require('./icons/hand.svg')}
                        header={format({ id: 'page.referal.bottombanner.IEO_token_price' })}
                    >
                        <div>{format({ id: 'page.referal.bottombanner.IEO_round1' })} $0.4</div>
                    </ListItem>
                    <ListItem
                        img={require('./icons/index.svg')}
                        header={format({ id: 'page.referal.bottombanner.IEO_max_supply' })}
                        header2={format({id: 'page.referal.bottombanner.hard_cap'})}
                        children2={(<div>$10 000 000</div>)}
                    >
                        <div>25 000 000 <span style={styles.currency}>EMRX</span></div>
                    </ListItem>
                    <ListItem
                        img={require('./icons/stock-price.svg')}
                        header={format({ id: 'page.referal.bottombanner.token_distrib_date' })}
                    >
                        {format({ id: 'page.referal.bottombanner.2_weeks_after_IEO' })}
                    </ListItem>
                </div>
                <a href="https://connect.emirex.com/ieo" target="_blank" rel="nofollow noopener">
                    <button className="button-get" style={styles.btn}>
                        {format({ id: 'page.referal.bottombanner.learn_more' })}
                    </button>
                </a>
            </div>
        </section>
    );
});
