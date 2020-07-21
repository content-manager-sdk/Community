import * as React from "react";
import * as ReactDOM from "react-dom";
import BootStrapWord from "./components/BootStrap/BootStrapWord";
import BootStrapExcel from "./components/BootStrap/BootStrapExcel";
import "./index.css";
import { initializeIcons } from "@uifabric/icons";
import BootStrapOutlook from "./components/BootStrap/BootStrapOutlook";
import BootStrapCheckinStyles from "./components/BootStrap/BootStrapCheckinStyles";
import BootStrapWebDrawer from "./components/BootStrap/BootStrapWebDrawer";
import BootStrapPowerPoint from "./components/BootStrap/BootStrapPowerPoint";
import BootStrapNotebook from "./components/BootStrap/BootStrapNotebook";

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
	} else if (
		["Excel"].some(function (a) {
			return window.location.href.indexOf(a) > -1;
		})
	) {
		return <BootStrapExcel />;
	} else if (
		["PowerPoint"].some(function (a) {
			return window.location.href.indexOf(a) > -1;
		})
	) {
		return <BootStrapPowerPoint />;
	} else if (
		["Notebook"].some(function (a) {
			return window.location.href.indexOf(a) > -1;
		})
	) {
		return <BootStrapNotebook />;
	} else {
		return <BootStrapWebDrawer />;
	}
};

ReactDOM.render(root(), document.getElementById("root") as HTMLElement);

//registerServiceWorker();

if (module.hot) {
	module.hot.accept();
}
