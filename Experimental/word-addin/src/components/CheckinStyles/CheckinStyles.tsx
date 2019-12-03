import * as React from "react";
import { inject, observer } from "mobx-react";

import ErrorDisplay from "../ErrorDisplay";
import { IAppStore } from "src/stores/AppStoreBase";
import ContextList from "../ContextList/ContextList";
import BaseObjectTypes from "src/trim-coms/trim-baseobjecttypes";
import { ITrimConnector } from "src/trim-coms/trim-connector";
import { IOfficeConnector } from "src/office-coms/office-connector";

interface ICheckinStylesProps {
	appStore?: IAppStore;
	trimConnector?: ITrimConnector;
	wordConnector?: IOfficeConnector;
	forServerProcessing: boolean;
}

export class CheckinStyles extends React.Component<ICheckinStylesProps, {}> {
	public render() {
		const { appStore, forServerProcessing } = this.props;

		return (
			<div>
				{appStore!.status === "ERROR" && <ErrorDisplay />}
				<ContextList
					trimType={BaseObjectTypes.CheckinPlace}
					hideSearchBar={true}
					searchString={
						forServerProcessing
							? "cipType:MailForServerProcessing"
							: "cipType:MailForClientProcessing "
					}
				/>
			</div>
		);
	}
}

export default inject(
	"appStore",
	"trimConnector",
	"wordConnector"
)(observer(CheckinStyles));
