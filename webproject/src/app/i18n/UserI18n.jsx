import GlobalI18n from './GlobalI18n';

export default class UserI18n extends GlobalI18n {
    
    constructor(ns){
        super(ns, {
            loadPath: process.env.BASE_URL_I18N + "app/i18n/user/{{ns}}/{{ns}}_{{lng}}.json"
        });
    }
}
