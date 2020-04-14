import * as React from "react"
import rootReducer from "./reducer/RootReducer";
import DetailTab from "./DetailTab";
import AppInitializer from '../components/AppInitializer';

const ns = ['common'];
AppInitializer.init(<DetailTab id="DetailTab" />, ns, rootReducer);