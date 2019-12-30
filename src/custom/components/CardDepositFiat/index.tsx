import * as React from 'react';

import { initPayin } from '../../../api';

// import Iframe from 'react-iframe';
//tslint:disable
const rootStyles = {

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
    },
    bottomRow: {
        display: 'flex',
        justifyContent: 'flex-start',
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


// interface CardDepositFiatProps {
//     currency: string;
//     translate: (data: string) => string;
// }

const CardDepositFiat = (props) => {
    const {
        currency,
        translate,
    } = props;

    const [amount, setAmount] = React.useState('50');
    const [initForm, setInitForm] = React.useState(true);
    const [iFrame, setIFrame] = React.useState(false);
    const [initURL, setInitURL] = React.useState('');

    const getFee = (amount) => {
        return +amount * 4.5 / 100;
    }

    const [fee, setFee] = React.useState(getFee(amount));

    const handleChange = (e) => {
        const oldAmount = amount;
        const newAmount = e.target.value;
        // console.log(newAmount);
        if (newAmount.match(/^[1-9]\d*$/)) {
            setAmount(newAmount);
            setFee(getFee(newAmount));
        } else if(newAmount.length !== 0){
            setAmount(oldAmount);
            setFee(getFee(oldAmount));
        } else {
            setAmount('');
            setFee(getFee(0));
        }
       
    }
    
    const handleClick = (e) => {
        const labels = document.querySelectorAll('label');
        labels.forEach(label => {
            if (e.target.id && label.id.includes(e.target.id)) {
                label.style.color = '#FFD567';
            } else {
                label.style.color = '#7D9794';
            }
        })

    }

    const clearInput = (e) => {
        e.preventDefault();
        setAmount('50');
    }

    const getPaytoolsForm = () => {
        // setInitURL('http://127.0.0.1:5500/ptform.html');
        const body = {
            currency: currency,
            amount: amount
        };
        // console.log(body);
        initPayin(body).then(data => {
            setInitURL(data.url);
            setIFrame(!iFrame);
            setInitForm(!initForm);
        }).catch(err => {
            setInitURL('');
            setIFrame(!iFrame);
            setInitForm(!initForm);
        });
        
    }

    return (
        <React.Fragment>
        <div onClick={handleClick} style={{maxWidth: '500px', display: initForm ? 'block' : 'none' }} className="depositCard">
            <h2 style={rootStyles.h2}>{translate('cardDepositFiat.detail')}</h2>
            <div style={rootStyles.rowWrapper}>
                <div style={rootStyles.row}>
                    <div style={{position: 'relative', flex: '2 1 auto'}}><label style={rootStyles.label} id="label_amount">{translate('cardDepositFiat.amount')}</label> <input id="amount" onClick={handleClick} className="depositCard__input"  onInput={handleChange} type="text" value={amount} placeholder="0"/></div>
                    <div style={{ position: 'relative', width: '150px', marginLeft: '15px' }}><label style={rootStyles.label} id="label_currency">{translate('cardDepositFiat.currency')}</label> <input id="currency" onClick={handleClick} className="depositCard__input depositCard__input2" type="text" value={currency} /></div>
                </div>
                <div style={rootStyles.bottomRow}>
                    <div style={{ position: 'relative', width: '150px' }}>
                            <label style={rootStyles.label} id="label_fee">{translate('cardDepositFiat.fee')}</label>
                            <input id="fee" onClick={handleClick} className="depositCard__input depositCard__input2" type="text" value={fee} />
                    </div> 
                </div>
                <div className="depositCard__buttons">
                    <a  onClick={clearInput}>{translate('cardDepositFiat.button.cancel')}</a>
                    <input disabled={parseInt(amount) < 50 ? true : false} onClick={getPaytoolsForm} type="submit" className="button" value={translate('cardDepositFiat.button.payment')}/>
                    
                </div>
            </div>
            </div>
            <div style={{display: iFrame ? 'block' : 'none'}}>
                {initURL ?
                //     <Iframe
                //     url={initURL}
                //     position='relative'
                //     width='100%'
                //     height='500px'
                //     styles={{ frameBorder: 'no' }}
             
                // />
                    <iframe  src={initURL} width="100%" height="500px" frameBorder="0"></iframe>
                    :
                    <h3>Server error</h3>}
            </div>
        </React.Fragment>
    );
};

export {
    CardDepositFiat,
};
