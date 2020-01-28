import * as React from 'react';

import { initPayin } from '../../../api';


// import Iframe from 'react-iframe';
//tslint:disable



// interface CardDepositFiatProps {
//     currency: string;
//     translate: (data: string) => string;
// }

const CardDepositFiat = (props) => {
    const {
        currency,
        translate,
        colorTheme,
    } = props;
    const defaultAmount = currency.toLowerCase() === 'aed' ? '30' : '';
    const [amount, setAmount] = React.useState(defaultAmount);
    const [initForm, setInitForm] = React.useState(true);
    const [iFrame, setIFrame] = React.useState(false);
    const [initURL, setInitURL] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

    const getFee = (amount) => {
        const fee = +amount * 4.5 / 100;

        return fee ? (fee + 0.1).toFixed(3) : '0';
    }

    const [fee, setFee] = React.useState(getFee(amount));

    const handleChange = (e) => {
        // const oldAmount = currency.toLowerCase() === 'aed' ? '30' : '';
        const newAmount = e.target.value;
        const reg =   /^[1-9]\d*$/;
        if (newAmount.match(reg)) {
            setAmount(newAmount);
            const fee = currency.toLowerCase() === 'aed' && parseInt(newAmount) < 30 ? '0' : getFee(newAmount);
            setFee(fee);
        }  else if(newAmount.length === 0 ){
            setAmount('');
            setFee(getFee(0));
        }
       
    }

    const handleClick = (e) => {
        const activeColor = colorTheme === 'basic' ? '#FFD567' : '#000000';
        const labels = document.querySelectorAll('label');
        labels.forEach(label => {
            if (e.target.id && label.id.includes(e.target.id)) {
                label.style.color = `${activeColor}`;
                document.getElementById(label.id.split('_')[1])!.style.border = `1px solid ${activeColor}`;
            } else {
                document.getElementById(label.id.split('_')[1])!.style.border = '1px solid #7D9794';
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
        }).catch(error => {
            setInitURL('');
            setIFrame(!iFrame);
            setInitForm(!initForm);
            setErrorMessage(error.response.data.errors[0]);
        });
        
    }

    const rootStyles = {  
        
        root: {
            position: 'relative' as 'relative',
            maxWidth: '500px',
            display: initForm ? 'block' : 'none',
            background: colorTheme === 'basic' ? '#222627' : '#FFFFFF',
            borderRadius: '10px'
        },

        h2: {
            padding: '15px',
            color: colorTheme === 'basic' ? '#FFFFFF' : '#2E4C80',
        },
        rowWrapper: {
           padding: '0 20px', 
        },
        row: {
            display: 'flex',
            alignItems: 'center',
            paddingBottom: '40px',
        },
        topRow: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
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
            background: colorTheme === 'basic' ? '#222627' : '#FFFFFF',
            color: colorTheme === 'basic' ? '#7D9794' : '#2E4C80',
            padding: '0 4px',
            zIndex: 1,
        },
         info: {
             padding: '15px',
             color: colorTheme === 'basic' ? '#FFFFFF' : '#2E4C80',
             fontSize: '16px',
              
         },
         buttons: {
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '20px 0',
         },
         input: {
            border: '1px solid #7D9794',
            outline: 'none',
           background: colorTheme === 'basic' ? '#222627' : '#FFFFFF',
           color: colorTheme === 'basic' ? '#FFFFFF' : '#222627',
           borderRadius: '5px',
           height: '50px',
           fontSize: '16px',
           padding: '10px',
           width: '100%',
         },
         input2: {
            border: '1px solid #7D9794',
            outline: 'none',
            background: colorTheme === 'basic' ? '#222627' : '#FFFFFF',
            color: colorTheme === 'basic' ? '#FFFFFF' : '#222627',
           borderRadius: '5px',
           height: '50px',
           fontSize: '16px',
           padding: '10px',
           width: '100%',
           disabled: 'disabled',
        },
        cancel: {
            textDecoration: 'none',
            color: colorTheme === 'basic' ? '#FFFFFF67' : '#2E4C80',
            fontSize: '18px',
            cursor: 'pointer',
        },
        button: {
            padding: '10px 20px',
            background: colorTheme === 'basic' ? '#11B382' : '#2E4C80',
            border: 'none',
            borderRadius: '4px', 
            fontSize: '16px',
            color: '#FFFFFF',
            cursor: 'pointer',
            marginLeft: '30px',
            width: '200px',
        },
        buttonDisabled: {
            padding: '10px 20px',
            background:'gray',
            border: 'none',
            borderRadius: '4px', 
            fontSize: '16px',
            color: '#FFFFFF',
            cursor: 'pointer',
            marginLeft: '30px',
            width: '200px',
        },
    };


    return (
        <React.Fragment>
            <div onClick={handleClick} style={rootStyles.root} >
                <div style={rootStyles.info}>
                    <span>{translate('cardDepositFiat.mastercard.message1')}</span>
                    <span style={{color: '#E85E59', fontWeight: 'bold'}}>{translate('cardDepositFiat.mastercard.message2')}</span>
                    <span>{translate('cardDepositFiat.mastercard.message3')}</span>                    
                </div>                
                <div style={rootStyles.rowWrapper}>
                <div style={rootStyles.topRow}>
                <h2 style={rootStyles.h2}>{translate('cardDepositFiat.detail')}</h2>
                <div
                    style={{
                        width: '100px',
                        height: '65px',
                        borderRadius: '5px',
                        background: `url(${require('../../assets/images/mastercard.svg')}) center center `,
                        backgroundSize: '90% auto',
                        backgroundRepeat: 'no-repeat'
                    }}                
                    />
                    </div>
                <div style={rootStyles.row}>
                    <div style={{position: 'relative', flex: '2 1 auto'}}><label style={rootStyles.label} id="label_amount">{translate('cardDepositFiat.amount')}</label> <input id="amount" onClick={handleClick} style={rootStyles.input} onInput={handleChange} type="text" value={amount} placeholder="0"/></div>
                    <div style={{ position: 'relative', width: '150px', marginLeft: '15px' }}><label style={rootStyles.label} id="label_currency">{translate('cardDepositFiat.currency')}</label> <input id="currency" onClick={handleClick} style={rootStyles.input2} type="text" value={currency} /></div>
                </div>
                <div style={rootStyles.bottomRow}>
                    <div style={{ position: 'relative', width: '150px' }}>
                            <label style={rootStyles.label} id="label_fee">{translate('cardDepositFiat.fee')}</label>
                            <input id="fee" onClick={handleClick} style={rootStyles.input2} type="text" value={`${fee} ${currency.toUpperCase()}`} />
                    </div> 
                </div>
                <div style={rootStyles.buttons}>
                    <a  style={rootStyles.cancel} onClick={clearInput}>{translate('cardDepositFiat.button.cancel')}</a>
                    <input 
                    disabled={(currency.toLowerCase() === 'aed' && parseInt(amount) < 30) || amount === '' ? true : false} 
                    onClick={getPaytoolsForm} 
                    type="submit" 
                    style={(currency.toLowerCase() === 'aed' && parseInt(amount) < 30) || amount === '' ? rootStyles.buttonDisabled : rootStyles.button} 
                    value={translate('cardDepositFiat.button.payment')}
                    />
                    
                </div>
            </div>
            </div>
            <div style={{display: iFrame ? 'block' : 'none'}}>
                {initURL ?
                    <iframe  src={initURL} width="100%" height="500px" frameBorder="0"></iframe>
                    :
                    <h3>{translate(`cardDeposit.errorMessage.${errorMessage}`)}</h3>}
            </div>
        </React.Fragment>
    );
};

export {
    CardDepositFiat,
};
