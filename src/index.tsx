// tslint:disable:no-submodule-imports
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import { Provider } from 'react-redux';
import { App } from './App';
import { customLocaleData } from './custom/translations';
import './index.css';
import { rootSaga } from './modules';
import { rangerSagas } from './modules/public/ranger';
import { rangerMiddleware, sagaMiddleware, store } from './store';

const chrome = require('./assets/images/browsers/chrome.svg');
const mozilla = require('./assets/images/browsers/mozilla.svg');
const safari = require('./assets/images/browsers/safari.svg');
const background = require('./assets/images/ie.jpg');

addLocaleData([...en, ...customLocaleData]);
sagaMiddleware.run(rootSaga);
rangerMiddleware.run(rangerSagas);
//tslint:disable
const IEStub = () => {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(180deg, rgba(43, 41, 39, 0) 36.63%, #262423 119.35%), url(${background}) center center`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div
                style={{
                    maxWidth: '720px',
                    margin: '-40px auto 0',
                    padding: '40% 0 50px',
                    fontFamily: 'Roboto',
                    color: '#FFFFFF',
                }}
            >
                <h2>Temporally we do not support Internet Explorer browser.</h2>
                <h2>Please use Safari, Mozilla Firefox or Google Chrome instead.</h2>
                <div>
                    <a href="https://www.google.com/chrome/">
                        <img src={chrome} alt="chrome" style={{ paddingRight: '20px', width: '60px' }} />
                    </a>
                    <a href="https://www.mozilla.org/">
                        <img src={mozilla} alt="firefox" style={{ paddingRight: '20px', width: '60px' }} />
                    </a>
                    <a href="https://www.apple.com/safari/">
                        <img src={safari} alt="safari" style={{ paddingRight: '20px', width: '60px' }} />
                    </a>
                </div>
            </div>
        </div>
    );
};

const renderStub = () => {
    ReactDOM.render(<IEStub />, document.getElementById('root') as HTMLElement);
};

const render = () =>
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('root') as HTMLElement
    );

const ua = navigator.userAgent.toLowerCase();
const isIe = /trident/gi.test(ua) || /msie/gi.test(ua);

if (isIe) {
    renderStub();
} else {
    render();
}
