import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { I18nextProvider } from "react-i18next";
import UserI18n from "../i18n/UserI18n";
import { SimpleLoading } from "./loading/SimpleLoading";
import ErrorReducer from "./reducers/ErrorReducer";
import {Snackbar} from "./snackbar/Snackbar";
import PendingActionsReducer from "./reducers/PendingActionsReducer";

export default class AppInitializer {

    static init = (app, ns, rootReducer, customMiddleWareItems) => {
        //store
        var store = undefined;
        if (rootReducer != undefined) {
            const logger = ({ getState }) => (next) => (action) => {
                return next(action);
            }
            let middleWareItems = [logger];
            if (customMiddleWareItems != undefined) {
                middleWareItems = [logger, ...customMiddleWareItems];
            }
            const middleWare = applyMiddleware(...middleWareItems);
            store = createStore(combineReducers({
                ...rootReducer,
                errorReducer: ErrorReducer, 
                pendingActionsReducer: PendingActionsReducer,
            }), middleWare);
            window.cmReduxStore = store;
        }

        //i18n
        const userI18n = new UserI18n(ns);
        const i18n = userI18n.getI18n();
        window.cmI18n = i18n;

        const domAppNode = document.getElementById("app");
        ReactDOM.render(<SimpleLoading />, domAppNode);

        // render site content
        var CONTENT = undefined;
        if (rootReducer != undefined) {
            CONTENT = (
                <I18nextProvider i18n={i18n}>
                    <Provider store={store}>
                        <Snackbar>
                            {app}
                        </Snackbar>
                    </Provider>
                </I18nextProvider>
            );
        } else {
            CONTENT = (
                <I18nextProvider i18n={i18n}>
                    {app}
                </I18nextProvider>
            );
        }

        const renderSiteContent = (err, t) => {
            if (err) {
                console.log("Errors during initialisation of i18n", err);
            }
            ReactDOM.unmountComponentAtNode(domAppNode)
            ReactDOM.render(CONTENT, domAppNode);
        }
        userI18n.initI18n(renderSiteContent);

    }
}
