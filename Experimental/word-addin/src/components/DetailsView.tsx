import * as React from "react";
import { inject, observer } from "mobx-react";

import { ITrimConnector, IObjectDetails } from "src/trim-coms/trim-connector";
import { BaseObjectTypes } from "../trim-coms/trim-baseobjecttypes";
import { Label } from "office-ui-fabric-react/lib/Label";
import { IWordConnector } from "src/office-coms/word-connector";

export class DetailsView extends React.Component<
	{
		appStore?: any;
		trimConnector?: ITrimConnector;
		wordConnector?: IWordConnector;
	},
	IObjectDetails
> {
	constructor(props: any) {
		super(props);
		this.state = {
			results: [],
			propertiesAndFields: [],
		};
	}

	componentDidMount() {
		const { trimConnector, appStore } = this.props;

		return trimConnector!
			.getObjectDetails(BaseObjectTypes.Record, appStore.RecordUri)
			.then((response: IObjectDetails) => {
				this.setState(response);
			});
	}

	private getText(propId: string): any {
		return this.state.results[0][propId].StringValue;
	}

	private _onTxtInsertClick = (textToInsert: string) => {
		const { wordConnector } = this.props;
		wordConnector!.insertText(textToInsert);
	};

	public render() {
		return (
			<div className="details-view ms-Grid">
				{this.state.propertiesAndFields.map((propDef) => {
					return (
						<div key={propDef.Id} className="details-item ms-Grid-row">
							<Label className="ms-Grid-col ms-sm4 ms-md4 ms-lg2">
								{propDef.Caption}
							</Label>
							<span className="ms-Grid-col ms-sm7 ms-md7 ms-lg9 ms-fontWeight-semibold">
								{this.getText(propDef.Id)}
							</span>
							<i
								onClick={() => {
									this._onTxtInsertClick(this.getText(propDef.Id));
								}}
								className="ms-Icon ms-Icon--PasteAsText ms-Grid-col ms-sm1 ms-md1 ms-lg1"
								aria-hidden="true"
							/>
						</div>
					);
				})}
			</div>
		);
	}
}

export default inject("appStore", "trimConnector", "wordConnector")(
	observer(DetailsView)
);
