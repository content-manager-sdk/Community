import * as React from "react";
import { inject, observer } from "mobx-react";
import NewRecord from "./NewRecord";
import ExistingRecord from "./ExistingRecord";

@inject("appStore")
@observer
export class MainApp extends React.Component<{ appStore?: any }, any> {
  public render() {
    const { appStore } = this.props;

    if (appStore!.RecordUri > 0) {
      return <ExistingRecord />;
    } else {
      return <NewRecord />;
    }
  }
}

export default MainApp;
