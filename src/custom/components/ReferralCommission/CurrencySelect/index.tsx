/* tslint:disable */
import * as React from 'react';

import './styles.css';

const style = {
    position: 'absolute',
}

const itemStyle = {
    listStyleType: 'none',

}

const Select = ({currencies, style, handler, currencyId}) => {

    return (
        <div style={style}>
            {currencies.map(
                (currency, index) => (
                    <div
                        key={currency+index}
                        data-name={currency}
                        className={`select-hover cr-card-option ${currencyId === currency ? 'active': ''}`}
                        style={itemStyle}
                        onClick={handler}
                    >
                        {currency.toUpperCase()}
                    </div>
                )
            )}
        </div>
    )
}

export const CurrencySelect = ({currencyId, currencies, changeCurrentCurrency}) => {

    const [display, setDisplay] = React.useState('none');
    const [currentCurrency, setCurrentCurrency]=React.useState('');

    const selectToggle = () => {
        const disp = display === 'none' ? 'block' : 'none'; 
        setDisplay(disp); 
    }
    const handler = (e) => {
        setCurrentCurrency(e.target.innerText);
        changeCurrentCurrency(e.target.innerText);
        selectToggle();
    }

    const handleClickOutside = () => {
        setDisplay('none');
    };

    React.useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });

    const openDropdown = e => {
        e.nativeEvent.stopImmediatePropagation();
        e.stopPropagation();
        selectToggle();
    };

    console.log('currencyId', currencyId);

    return (
        <div className="cr-card-select">
            <span  className="round-button default arrow" style={{cursor:'pointer'}} onClick={openDropdown}>
                {currentCurrency ? currentCurrency.toUpperCase() : currencyId.toUpperCase()}            
            </span>
            <Select currencies={currencies} style={{display:display, ...style}} handler={handler} currencyId={currencyId} />
        </div>
    )
}


