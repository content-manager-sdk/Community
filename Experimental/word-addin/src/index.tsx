import { Provider /* inject, observer  */ } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import BootStrap from "./components/BootStrap";
import "./index.css";
import WordConnector from "./office-coms/word-connector";
import registerServiceWorker from "./registerServiceWorker";
import { AppStore } from "./stores/AppStore";
import TrimConnector from "./trim-coms/trim-connector";

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
