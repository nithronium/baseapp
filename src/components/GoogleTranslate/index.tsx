import { History } from 'history';
import * as React from 'react';
// import CookieConsent from 'react-cookie-consent';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import {
    getCurrentLang,
    isSameLocale,
    triggerLanguageChange,
} from '../../helpers/googleTranslate';
import { languagesArray } from '../../helpers/googleTranslateLangs';
import {
    RootState,
} from '../../modules';

interface Locale {
    lang: string;
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


export class GoogleTranslateComponent extends React.Component<Props, State> {
    public unsubscribe?: () => void;
    public changed = false;
    public wrap = React.createRef<HTMLDivElement>();

    constructor(props) {
        super(props);
        this.state = {
            lang: '',
        };
    }

    public onChange = e => {
        if (this.wrap.current) {
            this.wrap.current.click();
        }
        triggerLanguageChange(e.target.value);
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
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };

    public render() {
        const { lang } = this.state;
        const { locale } = this.props;
        let languages = languagesArray;
        if (lang === '') {
            languages = [{ key: '', name: 'Translate' }, ...languagesArray];
        }

        if (isSameLocale(locale.lang)) {
            return null;
        }

        return (
            <div
                className="google-translate-widget"
                ref={this.wrap}
            >
                <select
                    onChange={this.onChange}
                    value={lang}
                    onClick={this.onClick}
                >
                    {languages.map(({ key, name }) => {
                        return <option value={key} key={key}>{name}</option>;
                    })}
                </select>
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

