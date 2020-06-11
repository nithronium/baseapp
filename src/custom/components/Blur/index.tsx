import * as React from 'react';
// import {FormattedMessage} from 'react-intl';

export const BlurComponent = props => {
    return (
        <React.Fragment>
            {props.isBlur
            ? <div className="blur-block">
                    {props.children}
                    <div className="blur-block__body">
                        <div className="blur-block__text">Block text</div>
                    </div>
            </div>
            : props.children}
        </React.Fragment>
    );
};
