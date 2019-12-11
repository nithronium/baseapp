import * as React from 'react';
import { Link } from 'react-scroll';
//tslint:disable
import { injectIntl } from 'react-intl';

const Button = props => {
    const animateButton = e => {
        const el = e.target;
        el!.classList.remove('animate');
        el!.classList.add('animate');
        setTimeout(() => {
            el!.classList.remove('animate');
        }, 700);
    };
    
    const { intl } = props;
   
    const getStyle = theme => {
        return theme ? { background: '#000000', color: '#FFFFFF' } : { background: '#FFD542', color: '#000000' };
    };

    const { theme } = props;
    return (
        <Link to="get-code" smooth={true} duration={500} delay={500}>
            <div className="button-get " onClick={animateButton} style={getStyle(theme)}>
                {intl.formatMessage({id: 'page.referral.get_a_code'})}
            </div>
        </Link>
    );
};
export  default injectIntl(Button);
