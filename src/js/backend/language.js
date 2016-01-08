import enUS from '../lang/en-US.js';
import zhCN from '../lang/zh-CN.js';

let locale = navigator.language;
let lang = {
    'en-US': { name: 'English(US)', content: enUS },
    'zh-CN': { name: '简体中文',    content: zhCN },
};

export default {
    setLocale (__locale) {
        locale = __locale;
    },

    getCurrentLocale () {
        for (let key in lang) {
            if (key === locale) {
                return { value: key, label: lang[key]['name'] };
            }
        }
        return { value: 'en-US', label: 'English(US)' };
    },

    getLocales () {
        const locales = [];
        for (let key in lang) {
            locales.push({ value: key, label: lang[key]['name'] });
        }
        return locales;
    },

    get (key, ...fills) {
        const domains = key.split('.');
        let value = lang[locale]['content'] || lang['en-US']['content'];
        if (domains.length > 1) {
            for (let i = 0; i < domains.length; i++) {
                if (!value[domains[i]]) {
                    value = domains[i];
                    break;
                }
                value = value[domains[i]];
            }
        }
        const __fills = [].concat(fills);
        return value.replace(/\$\$[\d]+/g, (match) => {
            if (__fills.length) {
                return __fills.shift();
            }
            return match;
        });
    },
}