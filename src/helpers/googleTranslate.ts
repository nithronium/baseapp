declare var google;

export const googleTranslateElementInit = pageLanguage => {
    if ('google' in window) {
        const langs = navigator.languages;
        const sameLocale = langs.filter(item => {
            return item.toLowerCase() === pageLanguage.toLowerCase();
        }).length;
        console.log('translate', langs, pageLanguage, sameLocale);
        // tslint:disable-next-line
        console.log('translate TranslateElement', {...google.translate});
        try {
            if (!sameLocale) {
                // tslint:disable-next-line
                new google.translate.TranslateElement({
                    pageLanguage: 'auto',
                    includedLanguages: 'ar,en,es,jv,ko,pa,pt,ru,zh-CN',
                }, 'google_translate_element');
            }
        } catch (e) {
            console.log('translation fail', navigator.languages, pageLanguage);
            console.log('translation fail error', e);
        }
    }
};
