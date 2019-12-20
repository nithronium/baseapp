import * as React from 'react';
import { injectIntl } from 'react-intl';
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
                <a href="connect.emirex.com/ieo">
                    <button className="button-get" style={styles.btn}>
                        {intl.formatMessage({id: 'page.referal.learn_more'})}
                    </button>
                </a>
            </div>
        </div>
    );
});
