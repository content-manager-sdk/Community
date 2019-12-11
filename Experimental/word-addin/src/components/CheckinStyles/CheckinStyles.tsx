import * as React from "react";
import { inject, observer } from "mobx-react";

import ErrorDisplay from "../ErrorDisplay";
import { IAppStore } from "../../stores/AppStoreBase";
import ContextList from "../ContextList/ContextList";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";
import { ITrimConnector } from "../../trim-coms/trim-connector";
import NewRecord from "../NewRecord";
import OutlookFolderPicker from "../OutlookFolderPicker/OutlookFolderPicker";
import { mergeStyles } from "@uifabric/styling";

interface ICheckinStylesProps {
	appStore?: IAppStore;
	trimConnector?: ITrimConnector;
	forServerProcessing: boolean;
}

interface ICheckinStylesState {
	view: string;
}

export class CheckinStyles extends React.Component<
	ICheckinStylesProps,
	ICheckinStylesState
> {
	constructor(props: ICheckinStylesProps) {
		super(props);

		this.state = {
			view: "List",
		};
	}

	private getStyles(): string {
		return mergeStyles({
			selectors: {
				"& .ms-ComboBox": {
					marginBottom: "8px",
				},
			},
		});
	}

	public render() {
		const { appStore, forServerProcessing } = this.props;
		const { view } = this.state;

		return (
			<div>
				{appStore!.status === "ERROR" && <ErrorDisplay />}
				{view === "New" ? (
					<React.Fragment>
						{forServerProcessing && (
							<OutlookFolderPicker className={this.getStyles()} />
						)}
						<NewRecord
							trimType={BaseObjectTypes.CheckinStyle}
							onTrimObjectCreated={() => {
								this.setState({ view: "List" });
							}}
						/>
					</React.Fragment>
				) : (
					<ContextList
						trimType={BaseObjectTypes.CheckinPlace}
						hideSearchBar={true}
						searchString={
							forServerProcessing
								? "cipType:MailForServerProcessing"
								: "cipType:MailForClientProcessing"
						}
						onCommand={(key: string) => {
							this.setState({ view: key });
						}}
					/>
				)}
			</div>
		);
	}
}

export default inject("appStore", "trimConnector")(observer(CheckinStyles));
