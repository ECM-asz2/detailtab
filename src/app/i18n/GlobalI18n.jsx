import i18n from "i18next";
import XHR from "i18next-xhr-backend";
// import Cache from 'i18next-localstorage-cache';
import LanguageDetector from "i18next-browser-languagedetector";
import "whatwg-fetch";

export default class GlobalI18n {
    
    constructor(ns, backend){
        ns.push("common");
        ns.push("error");
        ns.push("network");
        this.i18nextOptions = {
          backend: backend,
          fallbackLng: "en",
          debug: false,
          ns: ns,
          defaultNS: "common",
          // debug: true,
          // keySeparator: false, // we use content as keys
          interpolation: {
            escapeValue: false, // not needed for react!!
            formatSeparator: ","
          },
          react: {
            wait: false
          },
          detection: {
            order: ["navigator", "querystring", "cookie", "localStorage", "htmlTag"]
          }
          // interpolation: {
          //     "escapeValue": true,
          //     "prefix": "{{",
          //     "suffix": "}}",
          //     "formatSeparator": ",",
          //     "unescapePrefix": "-",
          //     "nestingPrefix": "$t(",
          //     "nestingSuffix": ")"
          // },
        };
    }
    getI18n = () => {
        i18n
            .use( XHR )
            // .use(Cache)
            .use( LanguageDetector );
        return i18n;
    };
    initI18n = (callback) => {
        i18n.init( this.i18nextOptions, callback );
    }
}
