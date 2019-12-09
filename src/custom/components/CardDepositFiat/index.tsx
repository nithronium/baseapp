import * as React from 'react';
//tslint:disable
const rootStyles = {
    wrapper: {
        maxWidth: '500px',
    },
    h2: {
        padding: '15px',
        color: 'white',
    },
    rowWrapper: {
       padding: '0 20px', 
    },
    row: {
        display: 'flex',
        alignItems: 'center',
        paddingBottom: '40px',
        borderBottom: '1px solid #64828022',
    },
     label :{
        position: 'absolute' as 'absolute',
        top:'-8px',
        left: '7px',
        fontSize: '14px',
        letterSpacing: '0.5',
        background: '#222627',
        color:'#7D9794',
        padding: '0 4px',
        zIndex: 1,
      },
};


interface CardDepositFiatProps {
    currency: string;
    translate: (data: string) => string;
}

const CardDepositFiat = (props: CardDepositFiatProps) => {
    const {
        currency,
        translate,
    } = props;

    const [amount, setAmount] = React.useState('');

    const handleChange = (e) => {
        const oldAmount = amount;
        const newAmount = e.target.value;
        // console.log(newAmount);
        if (newAmount.match(/^[1-9]\d*$/)) {
            setAmount(newAmount);
        } else if(newAmount.length !== 0){
            setAmount(oldAmount);
        } else {
            setAmount('');
        }
    }
    
    const handleClick = (e) => {
        const labels = document.querySelectorAll('label');
        labels.forEach(label => {
            if (label.id.includes(e.target.id)) {
                label.style.color = '#FFD567';
            } else {
                label.style.color = '#7D9794';
            }
        })

    }

    const clearInput = (e) => {
        e.preventDefault();
        setAmount('');
    }

    return (
        <div style={rootStyles.wrapper} className="depositCard">
            <h2 style={rootStyles.h2}>{translate('cardDepositFiat.detail')}</h2>
            <div style={rootStyles.rowWrapper}>
                <div style={rootStyles.row}>
                    <div style={{position: 'relative', flex: '2 1 auto'}}><label style={rootStyles.label} id="label_amount">{translate('cardDepositFiat.amount')}</label> <input id="amount" onClick={handleClick} className="depositCard__input"  onInput={handleChange} type="text" value={amount} placeholder="0"/></div>
                    <div style={{ position: 'relative', width: '150px', marginLeft: '15px' }}><label style={rootStyles.label} id="label_currency">{translate('cardDepositFiat.currency')}</label> <input id="currency" onClick={handleClick} className="depositCard__input depositCard__input2" type="text" value={currency} /></div>
                </div>
                <div className="depositCard__buttons">
                    <a href="" onClick={clearInput}>{translate('cardDepositFiat.button.cancel')}</a>
                    <input type="submit" className="button" value={translate('cardDepositFiat.button.payment')}/>
                    
                </div>
            </div>
        </div>
    );
};

export {
    CardDepositFiat,
    CardDepositFiatProps,
};
