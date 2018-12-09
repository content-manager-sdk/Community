import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppStore } from "./stores/AppStore";
import BootStrap from "./components/BootStrap";
import { Provider /* inject, observer  */ } from "mobx-react";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import TrimConnector from "./trim-coms/trim-connector";
import WordConnector from "./office-coms/word-connector";

const wordConnector = new WordConnector();
const trimConnector = new TrimConnector();
trimConnector.credentialsResolver = new Promise((resolve) => {
	wordConnector.getAccessToken().then((token) => resolve(token));
});
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

(() => {
	Office.initialize = (reason) => {
		// If you need to initialize something you can do so here.

		appStore.fetchBaseSettingFromTrim();
	};
})();

if (module.hot) {
	module.hot.accept();
}
