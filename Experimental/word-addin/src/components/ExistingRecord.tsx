import * as React from "react";
import { inject, observer } from "mobx-react";
import DetailsView from "./DetailsView";
import {
	ITrimConnector,
	IObjectDetails,
	ITrimBooleanField,
} from "../trim-coms/trim-connector";
import { MessageBar } from "office-ui-fabric-react/lib/MessageBar";
import { IWordConnector } from "../office-coms/word-connector";
import {
	Pivot,
	PivotItem,
	PivotLinkFormat,
	PivotLinkSize,
} from "office-ui-fabric-react/lib/Pivot";
import ContextList from "./ContextList/ContextList";
import ObjectContextMenu from "./ObjectContextMenu/ObjectContextMenu";
import BaseObjectTypes from "../trim-coms/trim-baseobjecttypes";

export class ExistingRecord extends React.Component<
	{
		appStore?: any;
		trimConnector?: ITrimConnector;
		wordConnector?: IWordConnector;
		className?: string;
	},
	{ menuMessage: string; recordDetails: IObjectDetails }
> {
	constructor(props: {
		appStore?: any;
		trimConnector?: ITrimConnector;
		wordConnector?: IWordConnector;
	}) {
		super(props);

		this.state = {
			menuMessage: "",
			recordDetails: { results: [], propertiesAndFields: [] },
		};
	}

	private loadRecordDetails = (): any => {
		const { trimConnector, appStore } = this.props;

		return trimConnector!
			.getObjectDetails(BaseObjectTypes.Record, appStore.RecordUri)
			.then((response: IObjectDetails) => {
				this.setState({ recordDetails: response });
			});
	};

	componentDidMount() {
		return this.loadRecordDetails();
	}

	private _dismissMessage = () => {
		this.setState({ menuMessage: "" });
	};

	public render() {
		const { className, appStore } = this.props;

		const { menuMessage, recordDetails } = this.state;

		if (
			recordDetails.results.length > 0 &&
			recordDetails.results[0].Fields!.DeleteNow
		) {
			recordDetails.results[0].DeleteNow = (recordDetails.results[0].Fields!
				.DeleteNow as ITrimBooleanField).Value;
		}

		return (
			<div className={className}>
				<Pivot
					linkFormat={PivotLinkFormat.tabs}
					linkSize={PivotLinkSize.normal}
				>
					<PivotItem headerText={appStore.messages.web_Properties} key={1}>
						<hr className="trim-menu-sep" />
						<div>
							<ObjectContextMenu
								record={recordDetails.results[0]}
								isInList={false}
								onCommandComplete={(commandKey: string) => {
									if (
										commandKey === "getGlobalProperties" ||
										commandKey === "RecCheckInDelete"
									) {
										const { appStore } = this.props;
										appStore.setStatus("STARTING");
										this.loadRecordDetails().then(() => {
											appStore.setStatus("WAITING");
										});
									}
								}}
							/>
							{menuMessage && (
								<MessageBar onDismiss={this._dismissMessage}>
									{menuMessage}
								</MessageBar>
							)}
							<DetailsView recordDetails={recordDetails} />
						</div>
					</PivotItem>
					<PivotItem headerText={appStore.messages.web_Context} key={2}>
						<hr />
						<ContextList />
					</PivotItem>
				</Pivot>
			</div>
		);
	}
}

export default inject("appStore", "trimConnector", "wordConnector")(
	observer(ExistingRecord)
);
