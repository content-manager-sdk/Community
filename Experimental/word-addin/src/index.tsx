import * as React from "react";
import * as ReactDOM from "react-dom";
import BootStrap from "./components/BootStrap";
import { Provider /* inject, observer  */ } from "mobx-react";
import { AppStore } from "./stores/AppStore";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import WordConnector from "./office-coms/word-connector";

let appStore = new AppStore(new WordConnector());

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
