import * as React from "react";
import * as ReactDOM from "react-dom";
import BootStrapWord from "./components/BootStrap/BootStrapWord";
import "./index.css";
//import registerServiceWorker from "./registerServiceWorker";
import { initializeIcons } from "@uifabric/icons";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import FunctionFile from "./components/FunctionFile/FunctionFile";
import BootStrapOutlook from "./components/BootStrap/BootStrapOutlook";
import BootStrapCheckinStyles from "./components/BootStrap/BootStrapCheckinStyles";

initializeIcons();

const root = (
	<Router>
		<Switch>
			<Route path="/functions">
				<FunctionFile />
			</Route>
			<Route path="/OutlookLinks">
				<BootStrapOutlook />
			</Route>
			<Route path="/Outlook">
				<BootStrapOutlook />
			</Route>
			<Route path="/CheckinStyles">
				<BootStrapCheckinStyles forServerProcessing={false} />
			</Route>
			<Route path="/LinkedFolders">
				<BootStrapCheckinStyles forServerProcessing={true} />
			</Route>
			<Route path="/">
				<BootStrapWord />
			</Route>
		</Switch>
	</Router>
);

ReactDOM.render(root, document.getElementById("root") as HTMLElement);

//registerServiceWorker();

if (module.hot) {
	module.hot.accept();
}
