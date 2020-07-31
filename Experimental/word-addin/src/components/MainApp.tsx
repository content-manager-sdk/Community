import * as React from "react";
import { inject, observer } from "mobx-react";
import ViewTrimObjects from "./ViewTrimObjects/ViewTrimObjects";
import BaseObjectTypes from "../trim-coms/trim-baseobjecttypes";
import { IAppStore } from "../stores/AppStoreBase";
import OutlookAttachments from "./OutlookAttachments/OutlookAttachments";
import NewRecord from "./NewRecord";
import { ITrimConnector, IRecordType } from "src/trim-coms/trim-connector";
import { IWordUrl } from "src/office-coms/office-connector";
import ErrorDisplay from "./ErrorDisplay";

interface IMainAppProps {
	appStore?: any;
	trimConnector?: ITrimConnector;
	wordConnector?: IWordUrl;
	className?: string;
}

interface IMainAppState {
	defaultRecordType?: IRecordType;
	webUrl: string;
}

export class MainApp extends React.Component<IMainAppProps, IMainAppState> {
	constructor(props: IMainAppProps) {
		super(props);
		this.state = { defaultRecordType: undefined, webUrl: "_" };
	}

	async componentDidMount() {
		const { appStore, trimConnector, wordConnector } = this.props;
		let defaultRecordType;
		let webUrl = "";
		if (!appStore.isEmail()) {
			try {
				defaultRecordType = await trimConnector!.getDefaultRecordType();
				webUrl = await wordConnector!.getWebUrl();
			} catch {}

			this.setState({ defaultRecordType, webUrl });
		}
	}

	public render() {
		const { appStore, className } = this.props;
		const { defaultRecordType, webUrl } = this.state;
console.log(webUrl);
		if (appStore.status === "STARTING" || appStore.status === "PAUSE") {
			return null;
		}

		if (
			(appStore as IAppStore)!.documentInfo.Uris &&
			(appStore as IAppStore)!.documentInfo.Uris.length > 0
		) {
			return (
				<ViewTrimObjects
					className={className}
					trimType={BaseObjectTypes.Record}
				/>
			);
		} else {
			return appStore!.isEmail() ? (
				<OutlookAttachments />
			) : webUrl.indexOf("http") === 0 ? (
				<NewRecord
					className={className}
					trimType={BaseObjectTypes.Record}
					defaultRecordType={defaultRecordType}
				/>
			) : (
				<ErrorDisplay
					errorMessage={appStore!.messages.web_oneDrive}
					onClose={() => {
						(Office as any).addin.hide();
					}}
				/>
			);
		}
	}
}

export default inject(
	"appStore",
	"trimConnector",
	"wordConnector"
)(observer(MainApp));
