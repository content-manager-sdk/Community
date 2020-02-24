import * as React from "react";
import { inject, observer } from "mobx-react";
import DetailsView from "../DetailsView";
import {
	ITrimConnector,
	IObjectDetails,
	ITrimBooleanField,
} from "../../trim-coms/trim-connector";
import { MessageBar } from "office-ui-fabric-react/lib/MessageBar";
import { IOfficeConnector } from "../../office-coms/office-connector";
import {
	Pivot,
	PivotItem,
	PivotLinkFormat,
	PivotLinkSize,
} from "office-ui-fabric-react/lib/Pivot";
import ContextList from "../ContextList/ContextList";
import ObjectContextMenu from "../ObjectContextMenu/ObjectContextMenu";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";

interface ViewTrimObjectProps {
	appStore?: any;
	trimConnector?: ITrimConnector;
	wordConnector?: IOfficeConnector;
	className?: string;
	recordUri: number;
	onEdit?: (uri: number) => void;
	onClose?: () => void;
	trimType: BaseObjectTypes;
}

export class ViewTrimObject extends React.Component<
	ViewTrimObjectProps,
	{ menuMessage: string; recordDetails: IObjectDetails }
> {
	constructor(props: ViewTrimObjectProps) {
		super(props);

		this.state = {
			menuMessage: "",
			recordDetails: { results: [], propertiesAndFields: [] },
		};
	}

	private mounted: Boolean;

	private loadRecordDetails = (): any => {
		const { trimConnector, recordUri, trimType } = this.props;

		return trimConnector!
			.getObjectDetails(trimType, recordUri)
			.then((response: IObjectDetails) => {
				if (this.mounted) {
					this.setState({ recordDetails: response });
				}
			});
	};

	componentDidMount() {
		this.mounted = true;
		return this.loadRecordDetails();
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	componentDidUpdate(prevProps: ViewTrimObjectProps) {
		const { recordUri } = this.props;
		if (recordUri !== prevProps.recordUri) {
			return this.loadRecordDetails();
		}
	}

	private _dismissMessage = () => {
		this.setState({ menuMessage: "" });
	};

	public render() {
		const {
			className,
			appStore,
			onEdit,
			trimType,
			recordUri,
			onClose,
		} = this.props;

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
								trimType={trimType}
								showCloseIcon={onClose !== undefined}
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
									} else if (commandKey === "close") {
										if (onClose) {
											onClose();
										}
									} else if (commandKey === "edit" && onEdit) {
										onEdit(recordUri);
									}
								}}
							/>
							{menuMessage && (
								<MessageBar onDismiss={this._dismissMessage}>
									{menuMessage}
								</MessageBar>
							)}
							<DetailsView recordDetails={recordDetails} trimType={trimType} />
						</div>
					</PivotItem>
					{trimType === BaseObjectTypes.Record ? (
						<PivotItem headerText={appStore.messages.web_Context} key={2}>
							<hr />
							<ContextList trimType={BaseObjectTypes.Record} />
						</PivotItem>
					) : (
						<React.Fragment />
					)}
				</Pivot>
			</div>
		);
	}
}

export default inject(
	"appStore",
	"trimConnector",
	"wordConnector"
)(observer(ViewTrimObject));
