import * as React from 'react';

import { getCurrentLang, triggerLanguageChange } from '../../helpers/googleTranslate';

import { languagesArray } from '../../helpers/googleTranslateLangs';

interface State {
    lang: string;
}

export class GoogleTranslate extends React.Component<{}, State> {
    public unsubscribe?: () => void;

    constructor(props) {
        super(props);
        this.state = {
            lang: '',
        };
    }

    public onChange = event => {
        triggerLanguageChange(event.target.value);
    };

    public componentDidMount() {
        window.addEventListener(
            'google-translate-lang-change',
            this.onGoogleLangChange,
        );
        // tslint:disable-next-line
        const lang = getCurrentLang();
        this.setState({
            lang: lang ? lang : '',
        });
    }

    public onGoogleLangChange = data => {
        const { detail } = data;
        const { lang } = this.state;
        if (detail !== lang) {
            this.setState({
                lang: detail,
            });
        }
    };

    public componentWillUnmount() {
        window.removeEventListener(
            'google-translate-lang-change',
            this.onGoogleLangChange,
        );
        this.unsubscribe && this.unsubscribe();
    }

    public render() {
        const { lang } = this.state;
        return (
            <div className="google-translate-widget">
                <select onChange={this.onChange} value={lang}>
                    {languagesArray.map(({ key, name }) => {
                        return <option value={key} key={key}>{name}</option>;
                    })}
                </select>
                <div className="google-translate-widget__bottom">
                    Powered by
                    {' '}
                    <span>
                        <img src="https://www.gstatic.com/images/branding/googlelogo/1x/googlelogo_color_42x16dp.png" />
                    </span>
                    {' '}
                    Translate
                </div>
            </div>
        );
    }
}
