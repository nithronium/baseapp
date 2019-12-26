/*tslint:disable */
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { SepaFragment } from './SepaFragment';
import { WireFragment } from './WireFragment';
import { TypeTabs } from '../TypeTabs';

interface Styles {
    card: React.CSSProperties
}

const styles: Styles = {
    card: {
        fontSize: '18px',
        paddingTop: '20px',
        textAlign: 'center',
    }
}

export const FiatFragment = injectIntl((props) => {
    const {
        intl,
        card,
        sepa,
        wire,
        currency,
        action
    } = props;
    const translate = (id) => intl.formatMessage({id});

    return (
        <React.Fragment>
            { <TypeTabs wire={wire} sepa={sepa} card={card} action={action} currency={currency.toLowerCase()}/>}
            {card && <div style={styles.card}>{translate('comingsoon')}</div>}
            {sepa && <SepaFragment {...props}/>}
            {wire && <WireFragment {...props} />}        
        </React.Fragment>
    );
});