import * as React from 'react';
import { Link } from 'react-scroll';
//tslint:disable

const Button = props => {
    const animateButton = e => {
        console.log(e.target);
        const el = e.target;
        el!.classList.remove('animate');
        el!.classList.add('animate');
        setTimeout(() => {
            el!.classList.remove('animate');
        }, 700);
    };

    const getStyle = theme => {
        return theme ? { background: '#000000', color: '#FFFFFF' } : { background: '#FFD542', color: '#000000' };
    };

    const { theme } = props;
    return (
        <Link to="get-code" smooth={true} duration={500} delay={500}>
            <div className="button yellow-button " onClick={animateButton} style={getStyle(theme)}>
                Get a Code
            </div>
        </Link>
    );
};
export { Button };
