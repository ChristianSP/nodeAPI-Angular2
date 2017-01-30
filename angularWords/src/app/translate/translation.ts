// app/translate/translation.ts

import { OpaqueToken } from '@angular/core';

// import translations
import { LANG_EN_NAME, LANG_EN_TRANS } from './lang-en';
import { LANG_ES_NAME, LANG_ES_TRANS } from './lang-es';

export class TranslationClass{
    static TRANSLATIONS = new OpaqueToken('translation');
    static dictionary = {
        en: LANG_EN_TRANS,
        es: LANG_ES_TRANS,
    };
}
/*// translation token
export const TRANSLATIONS = new OpaqueToken('translation');

// all translations
export const dictionary = {
    [LANG_EN_NAME]: LANG_EN_TRANS,
    [LANG_ES_NAME]: LANG_ES_TRANS,
};

// providers
export const TRANSLATION_PROVIDERS = [
    { provide: TRANSLATIONS, useValue: dictionary },
];*/