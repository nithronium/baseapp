import * as React from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-scroll';
import { styles } from './styles';

export const TopBanner = injectIntl(({intl}) => {
    return (
        <div style={styles.mainWrapper}>
            <img style={styles.backGroundImg} src={require('./background.png')}/>
            <div style={styles.textWrapper}>
                <span>
                    <span style={styles.highlightedText}>{intl.formatMessage({id: 'page.referal.topbanner.ieo_started'})} </span>
                    {intl.formatMessage({id: 'page.referal.topbanner.dont_miss_chance'})}
                </span>
                <Link to="bottom_banner" smooth={true} duration={500} delay={500}>
                    <button className="button-get" style={styles.btn}>
                        {intl.formatMessage({id: 'page.referal.topBanner.learn_more'})}
                    </button>
                </Link>
            </div>
        </div>
    );
});
