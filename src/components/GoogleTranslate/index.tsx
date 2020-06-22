
import * as React from 'react';

import {
    getCurrentLang,
    isSameLocale,
    triggerLanguageChange,
} from '../../helpers/googleTranslate';

import { languagesArray } from '../../helpers/googleTranslateLangs';

import { History } from 'history';
// import CookieConsent from 'react-cookie-consent';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import {
    RootState,
} from '../../modules';

interface Locale {
    lang: string;
    messages: object;
}

interface AppProps {
    history: History;
}

interface ReduxProps {
    locale: Locale;
}


type Props = AppProps & ReduxProps;


interface State {
    lang: string;
}


// export const LangSelect = ({ onChange, lang }) => {
//     let languages = languagesArray;
//     if (lang === '') {
//         languages = [{ key: '', name: 'Select language' }, ...languagesArray];
//     }
//     return (
//         <div>
//             {languages.map(({ key, name }) => {
//                 return (
//                     <div
//                         onClick={onChange({ target: { value: key } })}
//                         key={key}
//                     >
//                         {name}
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };

export class GoogleTranslateComponent extends React.Component<Props, State> {
    public unsubscribe?: () => void;
    public select = React.createRef<HTMLSelectElement>();

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

    public onClick = e => {
        // if (e.target.);
        console.log('onClick', e.target);
        // if (e.target.tagName === 'LABEL')
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        if (this.select.current) {
            const event = new Event('click');
            this.select.current.dispatchEvent(event);
        }
    };

    public render() {
        const { lang } = this.state;
        const { locale } = this.props;
        let languages = languagesArray;
        if (lang === '') {
            languages = [{ key: '', name: 'Select language' }, ...languagesArray];
        }

        if (isSameLocale(locale.lang)) {
            return null;
        }

        return (
            <div
                className="google-translate-widget"
            >
                <select
                    onChange={this.onChange}
                    value={lang}
                >
                    {languages.map(({ key, name }) => {
                        return <option value={key} key={key}>{name}</option>;
                    })}
                </select>
                {/* <LangSelect
                    onChange={this.onChange}
                    lang={lang}
                /> */}
                {/* <label
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                    }}
                    onClick={this.onClick}
                /> */}
                {/* <div className="google-translate-widget__bottom">
                    Powered by
                    {' '}
                    <span>
                        <img src="https://www.gstatic.com/images/branding/googlelogo/1x/googlelogo_color_42x16dp.png" />
                    </span>
                    {' '}
                    Translate
                </div> */}
            </div>
        );
    }
}


const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> =
    (state: RootState): ReduxProps => ({
        locale: state.public.i18n,
    });

const mapDispatchToProps: MapDispatchToPropsFunction<{}, {}> =
    () => ({
    });

// tslint:disable-next-line:no-any
const GoogleTranslate = connect(mapStateToProps, mapDispatchToProps)(GoogleTranslateComponent) as any;

export {
    GoogleTranslate,
};

