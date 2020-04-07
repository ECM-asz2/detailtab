export const SET_ERROR = "SET_ERROR";
export const REMOVE_ERROR = "REMOVE_ERROR";

export const setError = (isError, errorMsg, retryCallback, retryCallbackParams, isDialog, actionText) => {
    return {
        type: SET_ERROR,
        payload: { isError, errorMsg, retryCallback, retryCallbackParams, isDialog, actionText}
    }
};

export const setErrorForContext = (context, isError, errorMsg, retryCallback, retryCallbackParams, isDialog, actionText) => {
    return {
        type: SET_ERROR,
        payload: { context, isError, errorMsg, retryCallback, retryCallbackParams, isDialog, actionText }
    }
};

export const removeError = (context) => {
    return {
        type: REMOVE_ERROR,
        payload: { context }
    }
};
