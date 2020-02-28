import * as React from "react";
import { inject, observer } from "mobx-react";
import ViewTrimObjects from "./ViewTrimObjects/ViewTrimObjects";
import BaseObjectTypes from "../trim-coms/trim-baseobjecttypes";
import { IAppStore } from "src/stores/AppStoreBase";
import OutlookAttachments from "./OutlookAttachments/OutlookAttachments";
import NewRecord from "./NewRecord";
import { ITrimConnector, IRecordType } from "src/trim-coms/trim-connector";

interface IMainAppProps {
	appStore?: any;
	trimConnector?: ITrimConnector;
	className?: string;
}

interface IMainAppState {
	defaultRecordType?: IRecordType;
}

export class MainApp extends React.Component<IMainAppProps, IMainAppState> {
	constructor(props: IMainAppProps) {
		super(props);
		this.state = { defaultRecordType: undefined };
	}

	async componentDidMount() {
		const { appStore, trimConnector } = this.props;

		if (!appStore.isEmail()) {
			const defaultRecordType = await trimConnector!.getDefaultRecordType();

			if (defaultRecordType) {
				this.setState({ defaultRecordType });
			}
		}
	}

	public render() {
		const { appStore, className } = this.props;
		const { defaultRecordType } = this.state;

		if (appStore.status === "STARTING") {
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
		} else if (appStore!.status === "WAITING") {
			return appStore!.isEmail() ? (
				<OutlookAttachments />
			) : (
				<NewRecord
					className={className}
					trimType={BaseObjectTypes.Record}
					defaultRecordType={defaultRecordType}
				/>
			);
		} else {
			return null;
		}
	}
}

export default inject("appStore", "trimConnector")(observer(MainApp));
