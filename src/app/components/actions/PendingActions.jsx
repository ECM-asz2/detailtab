export const ADD_PENDING_ACTION = "ADD_PENDING_ACTION";
export const REMOVE_PENDING_ACTION = "REMOVE_PENDING_ACTION";
export const TYPE_REST = "TYPE_REST";

export const addPendingAction = (type) => {
    return {
        type: ADD_PENDING_ACTION,
        payload: { type }
    }
};

export const removePendingAction = (type) => {
    return {
        type: REMOVE_PENDING_ACTION,
        payload: { type }
    }
};



