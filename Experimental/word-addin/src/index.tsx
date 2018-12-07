import * as React from "react";
import * as ReactDOM from "react-dom";
import BootStrap from "./components/BootStrap";
import { Provider /* inject, observer  */ } from "mobx-react";
import { AppStore } from "./stores/AppStore";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import WordConnector from "./office-coms/word-connector";
import TrimConnector from "./trim-coms/trim-connector";


const wordConnector = new WordConnector();
const trimConnector = new TrimConnector();
trimConnector.CredentialsResolver = new Promise((resolve) =>{
	wordConnector.getAccessToken().then(token => resolve(token));
});
const appStore = new AppStore(wordConnector, trimConnector);

const Root = (
	<Provider
		appStore={appStore}
		trimConnector={trimConnector}
		wordConnector={wordConnector}
	>
		<BootStrap />
	</Provider>
);

ReactDOM.render(Root, document.getElementById("root") as HTMLElement);
//ReactDOM.render(<BootStrap />, document.getElementById("root") as HTMLElement);
registerServiceWorker();

(function() {
	Office.initialize = function(reason) {
		// If you need to initialize something you can do so here.


				appStore.fetchBaseSettingFromTrim();

	};
})();

if (module.hot) {
	module.hot.accept();
}
