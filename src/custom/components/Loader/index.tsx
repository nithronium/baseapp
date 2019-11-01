import * as React from 'react';
const Loader = ({ display }) => {
    return (
        <div
            // tslint:disable-next-line: jsx-no-multiline-js
            style={{
                display: display ? 'block' : 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 99,
                background: 'rgba(0,0,0,0.4)',
            }}
        >
            <img src={require('../../../assets/images/loader.svg')} alt="loader" className="loader" />
        </div>
    );
};

export {Loader};
