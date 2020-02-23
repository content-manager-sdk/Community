import * as React from "react";
import { inject, observer } from "mobx-react";

import {
	ITrimConnector,
	ITrimMainObject,
} from "../../trim-coms/trim-connector";

import { IOfficeConnector } from "../../office-coms/office-connector";
import { Text } from "office-ui-fabric-react/lib/Text";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";
import ViewTrimObject from "../ViewTrimObject/ViewTrimObject";
import { IAppStore } from "src/stores/AppStoreBase";
import { Link, PrimaryButton } from "office-ui-fabric-react";

interface ViewTrimObjectsProps {
	appStore?: IAppStore;
	trimConnector?: ITrimConnector;
	wordConnector?: IOfficeConnector;
	onEdit?: (uri: number) => void;
	trimType: BaseObjectTypes;
	className?: string;
}

interface ViewTrimObjectsState {
	records: ITrimMainObject[];
	selectedUri: number;
	spinning: Boolean;
}

export class ViewTrimObjects extends React.Component<
	ViewTrimObjectsProps,
	ViewTrimObjectsState
> {
	constructor(props: ViewTrimObjectsProps) {
		super(props);

		this.state = {
			records: [],
			selectedUri: 0,
			spinning: false,
		};
	}

	async componentDidMount() {
		const { appStore } = this.props;
		appStore!.PreservedUris = [];
		const records = await appStore!.fetchFiledRecords();
		this.setState({
			records: records,
		});
	}

	public render() {
		const { trimType, appStore, className, onEdit } = this.props;
		const { records, selectedUri } = this.state;

		const selUri =
			selectedUri > 0
				? selectedUri
				: appStore!.documentInfo.Uris.length === 1
				? appStore!.documentInfo.Uris[0]
				: 0;

		return selUri > 0 || appStore!.documentInfo.Uris.length === 1 ? (
			<ViewTrimObject
				trimType={trimType}
				recordUri={selUri}
				className={className}
				onEdit={onEdit}
			/>
		) : (
			<React.Fragment>
				<Text variant="large">{appStore!.messages.web_attachmentsList}</Text>
				<ul>
					{records.map((record) => (
						<li key={record.Uri}>
							<Link
								onClick={(ev) => {
									this.setState({ selectedUri: record.Uri });
								}}
							>
								{record.ToolTip}
							</Link>
						</li>
					))}
				</ul>
				{appStore!.moreToFile() && (
					<PrimaryButton
						className="trim-register"
						onClick={() => {
							const { appStore } = this.props;
							appStore!.clearUris();
						}}
					>
						{appStore!.messages.web_fileMore}
					</PrimaryButton>
				)}
			</React.Fragment>
		);
	}
}

export default inject(
	"appStore",
	"trimConnector",
	"wordConnector"
)(observer(ViewTrimObjects));
