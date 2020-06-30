import * as React from 'react';
import {FormattedMessage} from 'react-intl';

export const BlurComponent = props => {
    return (
        <React.Fragment>
            {props.isBlur
            ? <div className="blur-block">
                    {props.children}
                    <div className="blur-block__body">
                        <div className="blur-block__text"><FormattedMessage id="page.body.wallet.blur" /></div>
                    </div>
            </div>
            : props.children}
        </React.Fragment>
    );
};
