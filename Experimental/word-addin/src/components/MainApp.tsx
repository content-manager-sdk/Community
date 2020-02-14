import * as React from "react";
import { inject, observer } from "mobx-react";
import NewRecord from "./NewRecord";
import ViewTrimObjects from "./ViewTrimObjects/ViewTrimObjects";
import BaseObjectTypes from "../trim-coms/trim-baseobjecttypes";
import EditTrimObject from "./EditTrimObject/EditTrimObject";
import { IAppStore } from "src/stores/AppStoreBase";

export class MainApp extends React.Component<
	{ appStore?: any; className?: string },
	{ editUri: number }
> {
	constructor(props: { appStore?: any; className?: string }) {
		super(props);

		this.state = { editUri: 0 };
	}

	public render() {
		const { appStore, className } = this.props;
		const { editUri } = this.state;

		if (appStore.status === "STARTING") {
			return null;
		}

		if (
			(appStore as IAppStore)!.documentInfo.Uris &&
			(appStore as IAppStore)!.documentInfo.Uris.length > 0
		) {
			return editUri > 0 ? (
				<EditTrimObject
					trimType={BaseObjectTypes.Record}
					className={className}
					recordUri={editUri}
					onSave={() => {
						this.setState({ editUri: 0 });
					}}
				/>
			) : (
				<ViewTrimObjects
					className={className}
					trimType={BaseObjectTypes.Record}
					onEdit={(uri: number) => {
						this.setState({ editUri: uri });
					}}
				/>
			);
		} else if (appStore!.status === "WAITING") {
			return (
				<NewRecord className={className} trimType={BaseObjectTypes.Record} />
			);
		} else {
			return null;
		}
	}
}

export default inject("appStore")(observer(MainApp));
