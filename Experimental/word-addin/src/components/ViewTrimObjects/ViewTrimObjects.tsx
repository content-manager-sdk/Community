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
import { Link, Spinner, SpinnerSize } from "office-ui-fabric-react";

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

		this.state = { records: [], selectedUri: 0, spinning: false };
	}

	componentDidMount() {
		const { trimConnector, trimType, appStore } = this.props;
		if (appStore!.documentInfo.Uris.length > 1) {
			this.setState({ spinning: true });
			trimConnector!
				.search<ITrimMainObject>({
					q: "unkUri:" + appStore!.documentInfo.Uris.join(","),
					trimType,
					purpose: 0,
					properties: "ToolTip",
				})
				.then((data) => {
					this.setState({ records: data.results });
					this.setState({ spinning: false });
				})
				.catch((e) => {
					appStore!.setError(e);
					this.setState({ spinning: false });
				});
		}
	}

	public render() {
		const { trimType, appStore, className, onEdit } = this.props;
		const { records, selectedUri, spinning } = this.state;

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
				{spinning && <Spinner size={SpinnerSize.large} />}
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
			</React.Fragment>
		);
	}
}

export default inject(
	"appStore",
	"trimConnector",
	"wordConnector"
)(observer(ViewTrimObjects));
