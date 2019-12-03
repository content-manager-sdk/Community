import * as React from "react";
import { Provider /* inject, observer  */ } from "mobx-react";
import TrimConnector from "../../trim-coms/trim-connector";
import WordConnector from "../../office-coms/word-connector";
import BootStrap from "./BootStrap";

//import { getQueryStringValue } from "../../utils/getQueryStringValue";
import AppStoreWord from "src/stores/AppStoreWord";

export class BootStrapWord extends React.Component<{}, {}> {
	public render() {
		const wordConnector = new WordConnector();
		const trimConnector = new TrimConnector();
		const appStore = new AppStoreWord(trimConnector, wordConnector);

		// let getAccessToken: Promise<string>;

		// trimConnector.credentialsResolver = (callback) => {
		// 	const accessToken = getQueryStringValue("accessToken");

		// 	if (!getAccessToken) {
		// 		getAccessToken = wordConnector.getAccessToken();
		// 	}

		// 	if (accessToken) {
		// 		callback(accessToken, "");
		// 	} else {
		// 		getAccessToken
		// 			.then((token) => callback(token, ""))
		// 			.catch(function(error) {
		// 				callback("", error.message);
		// 			});
		// 	}
		// };

		return (
			<Provider
				appStore={appStore}
				trimConnector={trimConnector}
				wordConnector={wordConnector}
			>
				<BootStrap />
			</Provider>
		);
	}
}

export default BootStrapWord;
