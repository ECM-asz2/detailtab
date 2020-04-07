import * as Actions from "../actions/PendingActions";


const initialState = {
    totalPending: 0,
    pending: {
    }
}

export default function (state = initialState, action) {
    switch (action.type) {
        case Actions.ADD_PENDING_ACTION:
            let pendingForType = state.pending[action.payload.type] != undefined ? state.pending[action.payload.type] : 0;
            return {
                ...state,
                totalPending: (state.totalPending + 1),
                pending: {
                    ...state.pending,
                    [action.payload.type]: pendingForType + 1
                }
            }
        case Actions.REMOVE_PENDING_ACTION:
            return {
                ...state,
                totalPending: (state.totalPending - 1),
                pending: {
                    ...state.pending,
                    [action.payload.type]: state.pending[action.payload.type] - 1
                }
            }
        default:
            return state;
    };
}
