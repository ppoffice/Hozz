import locales from '../i18n/locales';

let __locale__;
// Fallback locale for outdated translations
let __safe_locale__ = 'en-US';

/**
 * Load locale files
 */
for (let key in locales) {
    locales[key]['content'] = require('../i18n/' + locales[key].file);
}

/**
 * Check if the translations contain a certain locale
 * @param  {String}  locale Language name
 * @return {Boolean}
 */
const checkLocale = locale => {
    return Object.keys(locales).indexOf(locale) > -1;
}

/**
 * Get user's system default locale
 * @return {String} Locale name
 */
const getDefaultLocale = () => {
    const locales = [ navigator.language, ...navigator.languages ];
    const locale = locales.find(checkLocale);
    return locale ? locale : __safe_locale__;
}

__locale__ = getDefaultLocale();

/**
 * Set current global locale
 * @param  {String} name Locale name
 */
const setLocale = name => {
    if (checkLocale(name))
        __locale__ = name;
}

/**
 * Get current global locale
 * @return {String} Locale name
 */
const getLocale = () => {
    return __locale__;
}

/**
 * Get a translation
 * @param  {String}    key          Desired translation name
 * @param  {...String} replacements Replacements for placeholders
 * @return {String}                 Desired translation value
 */
const get = (key, ...replacements) => {
    let namespace;
    const namespaces = [...key.split('.')];
    if (!namespaces.length) return key;
    let value = locales[__locale__]['content'];
    const fallback = locales[__safe_locale__]['content'];
    while (namespace = namespaces.shift()) {
        if (value[namespace]) {
            value = value[namespace];
        } else if (fallback[namespace]) {
            value = fallback[namespace];
        } else {
            value = namespace;
            break;
        }
    }
    const repl = [...replacements];
    return value.replace(/\$\$[\d]+/g, match => {
        repl.length ? repl.shift() : match;
    });
}

export default { get, getLocale, setLocale }