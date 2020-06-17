/* tslint:disable */
import * as React from 'react';

import './styles.css';

const style = {
    position: 'absolute',
}

const itemStyle = {
    listStyleType: 'none',

}

// const hasParent = (node, predicate) => {
//     while (node) {
//         if (predicate(node)) {
//             return true;
//         }
//         node = node.parentNode;
//     }
//     return false;
// };

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
    const [currentCurrency, setCurrentCurrency] = React.useState('');
    const refContainer = React.useRef(null);

    const selectToggle = () => {
        const disp = display === 'none' ? 'block' : 'none'; 
        setDisplay(disp); 
    }
    const handler = (e) => {
        setCurrentCurrency(e.target.innerText);
        changeCurrentCurrency(e.target.innerText);
        selectToggle();
    }

    const handleClickOutside = (e) => {
        setDisplay('none');
        // if (refContainer.current) {
        //     // setTimeout(() => setDisplay('none'));
        //     setDisplay('none');
        // }
    };

    React.useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });

    React.useEffect(() => {
        if (currentCurrency !== currencyId) {
            setCurrentCurrency(currencyId);
        }
    }, [currencyId]);

    const openDropdown = e => {
        // e.nativeEvent.stopImmediatePropagation();
        // e.stopPropagation();
        selectToggle();
    };

    return (
        <div className={`cr-card-select`} ref={refContainer} onClick={openDropdown}>
            <span  className="round-button default arrow" style={{cursor:'pointer'}}>
                {currentCurrency ? currentCurrency.toUpperCase() : currencyId.toUpperCase()}            
            </span>
            <Select currencies={currencies} style={{display:display, ...style}} handler={handler} currencyId={currencyId} />
        </div>
    )
}


