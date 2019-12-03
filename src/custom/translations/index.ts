import { en } from '../../translations/en';
import { ru } from './ru';

import { zh } from './zh';

const localeRu = require('react-intl/locale-data/ru');
const localeCn = require('react-intl/locale-data/zh');

export const customLocaleData = ([...localeRu, ...localeCn]);

export type LangType = typeof en;

export const customLanguageMap = {
    ru,
    zh,
};
