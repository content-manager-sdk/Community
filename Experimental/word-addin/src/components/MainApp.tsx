import * as React from "react";
import { inject, observer } from "mobx-react";
import NewRecord from "./NewRecord";
import ViewTrimObject from "./ViewTrimObject/ViewTrimObject";
import BaseObjectTypes from "../trim-coms/trim-baseobjecttypes";
import EditTrimObject from "./EditTrimObject/EditTrimObject";

export class MainApp extends React.Component<
	{ appStore?: any; className?: string },
	{ editMode: boolean }
> {
	constructor(props: { appStore?: any; className?: string }) {
		super(props);

		this.state = { editMode: false };
	}

	public render() {
		const { appStore, className } = this.props;
		const { editMode } = this.state;

		if (appStore.status === "STARTING") {
			return null;
		}
		if (appStore!.RecordUri > 0) {
			return editMode === true ? (
				<EditTrimObject
					trimType={BaseObjectTypes.Record}
					className={className}
					recordUri={appStore!.RecordUri}
					onSave={() => {
						this.setState({ editMode: false });
					}}
				/>
			) : (
				<ViewTrimObject
					className={className}
					recordUri={appStore!.RecordUri}
					onEdit={() => {
						this.setState({ editMode: true });
					}}
				/>
			);
		} else if (appStore!.DriveId !== "") {
			return (
				<NewRecord className={className} trimType={BaseObjectTypes.Record} />
			);
		} else {
			return null;
		}
	}
}

export default inject("appStore")(observer(MainApp));
