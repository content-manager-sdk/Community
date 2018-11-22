import * as React from "react";
import * as ReactDOM from "react-dom";
import BootStrap from "./components/BootStrap";
import { Provider /* inject, observer  */ } from "mobx-react";
import { appStore } from "./stores/AppStore";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

const Root = (
  <Provider appStore={appStore}>
    <BootStrap />
  </Provider>
);

ReactDOM.render(Root, document.getElementById("root") as HTMLElement);
//ReactDOM.render(<BootStrap />, document.getElementById("root") as HTMLElement);
registerServiceWorker();

appStore.fetchBaseSettingFromTrim();

if (module.hot) {
  module.hot.accept();
}
