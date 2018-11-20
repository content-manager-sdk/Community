import * as React from "react";
//import * as ReactDOM from "react-dom";
import { inject, observer } from "mobx-react";

import { /* appStore,  */ IAppStore } from "../stores/AppStore";

@inject("appStore")
@observer
export class MainApp extends React.Component<{ appStore?: IAppStore }> {
  render() {
    //const { appStore } = this.props;
    return <div />;
  }
}
