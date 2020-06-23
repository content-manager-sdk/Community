import * as React from "react";
import * as ReactDOM from "react-dom";
import BootStrapWord from "./components/BootStrap/BootStrapWord";
import "./index.css";
//import registerServiceWorker from "./registerServiceWorker";
import { initializeIcons } from "@uifabric/icons";

//import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
//import FunctionFile from "./components/FunctionFile/FunctionFile";
import BootStrapOutlook from "./components/BootStrap/BootStrapOutlook";
import BootStrapCheckinStyles from "./components/BootStrap/BootStrapCheckinStyles";
import BootStrapWebDrawer from "./components/BootStrap/BootStrapWebDrawer";
//import BootStrapAttachments from "./components/BootStrap/BootStrapAttachments";

initializeIcons();

const root = () => {
	if (window.location.href.indexOf("CheckinStyles") > -1) {
		return <BootStrapCheckinStyles forServerProcessing={false} />;
	} else if (window.location.href.indexOf("LinkedFolders") > -1) {
		return <BootStrapCheckinStyles forServerProcessing={true} />;
	} else if (
		["Outlook", "UserOptions"].some(function (a) {
			return window.location.href.indexOf(a) > -1;
		})
	) {
		return <BootStrapOutlook />;
	} else if (
		["Word", "searchdialog"].some(function (a) {
			return window.location.href.indexOf(a) > -1;
		})
	) {
		return <BootStrapWord />;
	} else {
		return <BootStrapWebDrawer />;
	}
};

ReactDOM.render(root(), document.getElementById("root") as HTMLElement);

//registerServiceWorker();

if (module.hot) {
	module.hot.accept();
}
