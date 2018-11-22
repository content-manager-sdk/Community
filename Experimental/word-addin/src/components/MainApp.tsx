import * as React from "react";
import { inject, observer } from "mobx-react";

@inject("appStore")
@observer
export class MainApp extends React.Component<{ appStore?: any }, any> {
  public render() {
    const { appStore } = this.props;
    return (
      <div className="ms-font-l ms-fontColor-themePrimary">
        {appStore.ApplicationDisplayName}
      </div>
    );
  }
}

export default MainApp;
//export default inject("appStore")(observer(MainApp));
//export const MainAppUndecorated = MainApp;
//export { MainApp };
