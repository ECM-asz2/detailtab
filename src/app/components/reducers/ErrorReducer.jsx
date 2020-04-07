import * as Actions from "../actions/ErrorActions";

const initialState = {
    default: {
        isError: false,
        errorMsg: "",
        retryCallback: undefined,
        retryCallbackParams: undefined,
        errorType: undefined,
        isDialog: false
    }
}

export default function (state = initialState, action) {
    switch (action.type) {
        case Actions.SET_ERROR:
            if (action.payload.context != undefined) {
                return { ...state, [action.payload.context]: action.payload };
            } else {
                return { ...state, default: { ...state.default, ...action.payload } };
            }
        case Actions.REMOVE_ERROR:
            if (action.payload.context != undefined) {
                return { ...state, [action.payload.context]: undefined };
            }
            return {
                ...state, default: {
                    isError: false,
                    errorMsg: "",
                    retryCallback: undefined,
                    retryCallbackParams: undefined,
                    errorType: undefined,
                    isDialog: false
                }
            };
        default:
            return state;
    }
};
