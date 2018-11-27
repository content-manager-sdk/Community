import * as React from "react";
import * as ReactDOM from "react-dom";
import BootStrap from "./components/BootStrap";
import { Provider /* inject, observer  */ } from "mobx-react";
import { AppStore } from "./stores/AppStore";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import WordConnector from "./office-coms/word-connector";
import TrimConnector from "./trim-coms/trim-connector";

const trimConnector = new TrimConnector();
const appStore = new AppStore(new WordConnector(), trimConnector);

const Root = (
  <Provider appStore={appStore} trimConnector={trimConnector}>
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
