import { Provider /* inject, observer  */ } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import BootStrap from "./components/BootStrap";
import "./index.css";
import WordConnector from "./office-coms/word-connector";
//import registerServiceWorker from "./registerServiceWorker";
import { AppStore } from "./stores/AppStore";
import TrimConnector from "./trim-coms/trim-connector";
import { initializeIcons } from "@uifabric/icons";

import { getQueryStringValue } from "../src/utils/getQueryStringValue";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import FunctionFile from "./components/FunctionFile/FunctionFile";

initializeIcons();

const wordConnector = new WordConnector();
const trimConnector = new TrimConnector();
trimConnector.credentialsResolver = (callback) => {
	const accessToken = getQueryStringValue("accessToken");

	if (accessToken) {
		callback(accessToken, "");
	} else {
		wordConnector
			.getAccessToken()
			.then((token) => callback(token, ""))
			.catch(function(error) {
				callback("", error.message);
			});
	}
};
const appStore = new AppStore(wordConnector, trimConnector);

const root = (
	<Router>
		<Switch>
			<Route path="/functions">
				<FunctionFile />
			</Route>
			<Route path="/">
				<Provider
					appStore={appStore}
					trimConnector={trimConnector}
					wordConnector={wordConnector}
				>
					<BootStrap />
				</Provider>
			</Route>
		</Switch>
	</Router>
);

ReactDOM.render(root, document.getElementById("root") as HTMLElement);

//registerServiceWorker();

if (module.hot) {
	module.hot.accept();
}
