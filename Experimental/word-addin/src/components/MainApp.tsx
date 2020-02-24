import * as React from "react";
import { inject, observer } from "mobx-react";
import ViewTrimObjects from "./ViewTrimObjects/ViewTrimObjects";
import BaseObjectTypes from "../trim-coms/trim-baseobjecttypes";
import { IAppStore } from "src/stores/AppStoreBase";
import OutlookAttachments from "./OutlookAttachments/OutlookAttachments";
import NewRecord from "./NewRecord";

export class MainApp extends React.Component<
	{ appStore?: any; className?: string },
	{ editUri: number }
> {
	constructor(props: { appStore?: any; className?: string }) {
		super(props);
	}

	public render() {
		const { appStore, className } = this.props;

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
				<NewRecord className={className} trimType={BaseObjectTypes.Record} />
			);
		} else {
			return null;
		}
	}
}

export default inject("appStore")(observer(MainApp));
