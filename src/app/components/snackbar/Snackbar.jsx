import React from 'react';
import {SnackbarQueue} from '@rmwc/snackbar';
import {queue} from './SnackbarQueue';

export class Snackbar extends React.Component {
    render(){
        return (
                <div>
                    {this.props.children}
                    <SnackbarQueue messages={queue.messages} stacked />
                </div>
        );
    }
}