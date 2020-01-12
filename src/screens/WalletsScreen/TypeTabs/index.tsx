/* tslint:disable */
import * as React from 'react';
import { injectIntl } from 'react-intl';

const setTabStyleDark = (isActive) => ({
    padding: '10px 0',
    flex: '1 1 auto',
    cursor: 'pointer',
    background: isActive ? '#11B382' : '#222627',
    border: isActive?  'none' : '1px solid #FFFFFF33',
    color: isActive ?  '#FFFFFF' : '#FFFFFF88',
})

const setTabStyleLight = (isActive) => ({
    padding: '10px 0',
    flex: '1 1 auto',
    cursor: 'pointer',
    background: isActive ? '#2E4C80' : '#FFFFFF',
    border: isActive?  'none' : '1px solid #222627',
    color: isActive ?  '#FFFFFF' : '#222627',
})

export const TypeTabs = injectIntl(({intl, currency, action, wire, sepa, card, colorTheme}) => {
    const translate = (id) => intl.formatMessage({id});
    const onWireClick = () => action({ card: false, sepa: false, wire: true });
    const onSepaClick = () => action({ card: false, sepa: true, wire: false });
    const onCardClick = () => action({ card: true, sepa: false, wire: false });

    const nothingSelected = (currency !== 'eur') && sepa;

    if (nothingSelected) {
        onWireClick();
    }

    return  (
        <div style={{                       //Tabs pannel (Wire/ Sepa/ Card)
            display: 'flex',
            textAlign: 'center',
            padding: '0 20px',
            fontSize: '18px',
            color: 'white',
            marginBottom: '15px',
            
        }}>
            <div 
                style={colorTheme==='basic' ? {borderRadius: '5px 0 0 5px',...setTabStyleDark(wire)} : {borderRadius: '5px 0 0 5px',...setTabStyleLight(wire)}}
                onClick={onWireClick}
            >
                {translate('page.body.wallets.tabs.deposit.fiat.button.wire')}
            </div>
            { currency === 'eur' && 
            <div 
                style={colorTheme==='basic' ? {...setTabStyleDark(sepa)} : {...setTabStyleLight(sepa)}}
                onClick={onSepaClick}>
                {translate('page.body.wallets.tabs.deposit.fiat.button.sepa')}
            </div>
            }
            <div 
                style={colorTheme==='basic' ? {borderRadius: '0 5px 5px 0',...setTabStyleDark(card)} : {borderRadius: '0 5px 5px 0',...setTabStyleLight(card)}}
                onClick={onCardClick}
            >
                {translate('page.body.wallets.tabs.deposit.fiat.button.card')}
            </div>
        </div>)
});
