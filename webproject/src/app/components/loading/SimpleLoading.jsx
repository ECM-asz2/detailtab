import * as React from "react";
import style from './loading.css';

import { LinearProgress } from '@rmwc/linear-progress';

export class SimpleLoading extends React.Component {
    render(){
        return ( <div className={style.loadingIconWrapper}><div className={style.loadingIconCenter}><LinearProgress /></div></div> );
    }
}
