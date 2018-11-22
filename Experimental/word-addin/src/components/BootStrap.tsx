import * as React from "react";
//import IAppStore from "../stores/AppStore";
import { inject, observer } from "mobx-react";
import { ErrorDisplay } from "./ErrorDisplay";
import MainApp from "./MainApp";

@inject("appStore")
@observer
export class BootStrap extends React.Component<{ appStore?: any }, any> {
  public render() {
    const { appStore } = this.props;

    if (appStore.status === "ERROR") {
      return <ErrorDisplay />;
    } else {
      return <MainApp />;
    }
  }
}

export default BootStrap;
