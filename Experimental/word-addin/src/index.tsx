import { Provider /* inject, observer  */ } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import BootStrap from "./components/BootStrap";
import "./index.css";
import WordConnector from "./office-coms/word-connector";
import registerServiceWorker from "./registerServiceWorker";
import { AppStore } from "./stores/AppStore";
import TrimConnector from "./trim-coms/trim-connector";
import { initializeIcons } from "@uifabric/icons";

initializeIcons();

const wordConnector = new WordConnector();
const trimConnector = new TrimConnector();
trimConnector.credentialsResolver = (callback) => {
	wordConnector.getAccessToken().then((token) => callback(token));
};
const appStore = new AppStore(wordConnector, trimConnector);

const root = (
	<Provider
		appStore={appStore}
		trimConnector={trimConnector}
		wordConnector={wordConnector}
	>
		<BootStrap />
	</Provider>
);

ReactDOM.render(root, document.getElementById("root") as HTMLElement);

registerServiceWorker();

if (module.hot) {
	module.hot.accept();
}
