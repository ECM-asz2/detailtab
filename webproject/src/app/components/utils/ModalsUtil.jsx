import {queue} from '../snackbar/SnackbarQueue';

export const ModalsUtil = {
    showSnackbarSuccessMessage: (message) => {
        queue.notify({body: message});
    },
    showSnackbarErrorMessage: (message) => {
        queue.notify({body: message});
    },
    errorToastWithAction: (message, actionTitle, action) => {
        queue.notify({title: '', body: message, actions:[{title: actionTitle, onClick: action}]});
    }
}
