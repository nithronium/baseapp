/* tslint:disable */
import * as React from 'react';

import './styles.css';

const style = {
    position: 'absolute',
    top: '-40px',
    right: '-5px',    
    background: 'white',
    boxShadow: '2px 1px 15px rgb(202, 198, 198), -1px -2px 15px rgb(202, 198, 198)',
    borderRadius: '10px',
    zIndex: 100,
    border: '1px orange',
}

const itemStyle = {
    listStyleType: 'none',
    padding: '10px 15px 10px 15px',
    cursor: 'pointer',

}

const Select = ({currencies, style, handler}) => {

    return (
        <div style={style}>
            {currencies.map(
                (currency, index) => (
                <div key={currency+index}  data-name={currency} className="select-hover" style={itemStyle} onClick={handler}> {currency.toUpperCase()} </div>
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

    return (
        <div style={{position: 'relative', maxWidth: '170px'}}>
        <span  className="round-button default arrow" style={{cursor:'pointer'}} onClick={selectToggle}>
            {currentCurrency ? currentCurrency.toUpperCase() : currencyId.toUpperCase()}            
        </span>
        <Select currencies={currencies} style={{display:display, ...style}} handler={handler}/>
        </div>
    )
}


