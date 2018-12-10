import * as React from "react";
import { inject, observer } from "mobx-react";
import NewRecord from "./NewRecord";
import ExistingRecord from "./ExistingRecord";

export class MainApp extends React.Component<{ appStore?: any }, any> {
	public render() {
		const { appStore } = this.props;

		if (appStore!.RecordUri > 0) {
			return <ExistingRecord />;
		} else if (appStore!.DriveId !== "") {
			return <NewRecord />;
		} else {
			return null;
		}
	}
}

export default inject("appStore")(observer(MainApp));
