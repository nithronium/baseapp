declare var google;

import { langNames } from './googleTranslateLangs';

export const isSameLocale = pageLanguage => {
    return false;
    const langs = navigator.languages;
    return !!langs.filter(item => {
        return item.toLowerCase() === pageLanguage.toLowerCase();
    }).length;
};

export const googleTranslateElementInit = pageLanguage => {
    if ('google' in window) {

        const init = () => {
            // const langs = navigator.languages;
            const sameLocale = false;
            try {
                if (!sameLocale) {
                    const e = document.getElementById('google_translate_element');
                    if (!e || e.hasAttribute('google-init')) {
                        return;
                    }
                    // tslint:disable-next-line
                    new google.translate.TranslateElement({
                        pageLanguage: 'auto',
                        includedLanguages: langNames.join(','),
                    }, 'google_translate_element');
                    e.setAttribute('google-init', 'true');
                }
            } catch (e) {
                console.log('translation fail', navigator.languages, pageLanguage);
                console.log('translation fail error', e);
            }
        };

        init();
    }
};

export const triggerLanguageChange = (value: string) => {
    const node = document.getElementById('google_translate_element');
    if (node) {
        const select = node.querySelector('select');
        if (!select) {
            return;
        }
        select.setAttribute('cancel-next-change', 'true');
        select.value = value;
        select.dispatchEvent(new Event('change'));
    }
};


export const getCurrentLang = () => {
    const select: HTMLSelectElement | null =
        document.querySelector('#google_translate_element select');
    if (select) {
        return select.value;
    }
    return '';
};

export const initLanguageChangeEvent = () => {
    let select;
    let interval;
    let prevLang;

    const listener = e => {
        if (select) {
            if (select.hasAttribute('cancel-next-change')) {
                select.removeAttribute('cancel-next-change');
                return;
            }
            window.dispatchEvent(
                new CustomEvent(
                    'google-translate-lang-change',
                    { detail: e.target.value},
                ),
            );
            // tslint:disable-next-line
            window['googleTranslateCurrentLang'] = e.target.value;
        }
    };

    const createListner = () => {
        select = document.querySelector('#google_translate_element select');
        if (select) {
            select.addEventListener('change', listener);
        }

        interval = setInterval(() => {
            // tslint:disable-next-line
            const currentLang = getCurrentLang();
            if (!prevLang || prevLang !== currentLang) {
                window.dispatchEvent(
                    new CustomEvent(
                        'google-translate-lang-change',
                        { detail: currentLang},
                    ),
                );
                prevLang = currentLang;
            }
        }, 1000);
    };

    createListner();

    if ('googleTranslateLoaded' in window) {
        createListner();
    } else {
        window.addEventListener('google-translate-loaded', () => {
            createListner();
        });
    }

    return () => {
        if (select) {
            select.removeEventListener(listener);
        }
        clearTimeout(interval);
    };
};

