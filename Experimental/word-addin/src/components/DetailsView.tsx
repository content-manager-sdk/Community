import * as React from "react";
import { inject, observer } from "mobx-react";

import {
	ITrimConnector,
	IObjectDetails,
	IPropertyOrFieldDef,
} from "src/trim-coms/trim-connector";
import { Label } from "office-ui-fabric-react/lib/Label";
import { IWordConnector } from "src/office-coms/word-connector";

interface IDetailsViewProps {
	appStore?: any;
	trimConnector?: ITrimConnector;
	wordConnector?: IWordConnector;
	recordDetails: IObjectDetails;
}
import { mergeStyles } from "office-ui-fabric-react";
export class DetailsView extends React.Component<
	IDetailsViewProps,
	{ propertiesAndFields: IPropertyOrFieldDef[] }
> {
	constructor(props: {
		appStore?: any;
		trimConnector?: ITrimConnector;
		wordConnector?: IWordConnector;
		recordDetails: IObjectDetails;
	}) {
		super(props);

		this.state = { propertiesAndFields: [] };
	}

	componentDidUpdate(newProps: IDetailsViewProps) {
		const { recordDetails } = this.props;
		if (
			newProps.recordDetails.propertiesAndFields !==
			recordDetails.propertiesAndFields
		) {
			if (recordDetails.propertiesAndFields) {
				this.setState({
					propertiesAndFields: recordDetails.propertiesAndFields,
				});
			}
		}
	}

	private getStyles(): string {
		return mergeStyles({
			selectors: {
				"& .ms-Icon": {
					cursor: "pointer",
				},
			},
		});
	}

	private getText(propId: string): any {
		const { recordDetails } = this.props;
		const prop = recordDetails.results[0][propId];
		if (prop) {
			return prop.StringValue;
		} else {
			const fld = recordDetails.results[0].Fields![propId];
			if (fld) {
				return fld.StringValue;
			}
		}
		return "";
	}

	private _onRemoveFromViewPane = (propertyId: string) => {
		const { recordDetails, trimConnector } = this.props;
		const { propertiesAndFields } = this.state;

		const propItem = propertiesAndFields.find((p) => {
			return p.Id === propertyId;
		});

		if (propItem) {
			const pos = propertiesAndFields.indexOf(propItem);
			let newProps = propertiesAndFields;
			newProps.splice(pos, 1);

			trimConnector!
				.setViewPaneProperties(
					recordDetails.results[0],
					newProps.map((prop) => {
						return prop.Id;
					})
				)
				.then((newProps: IPropertyOrFieldDef[]) => {
					this.setState({ propertiesAndFields: newProps });
				});
		}
	};

	public render() {
		const { propertiesAndFields } = this.state;
		return (
			<React.Fragment>
				<h3>Record Properties</h3>
				<div className="details-view ms-Grid">
					{propertiesAndFields.map((propDef) => {
						return (
							<div
								key={propDef.Id}
								className={"details-item ms-Grid-row " + this.getStyles()}
							>
								<Label className="ms-Grid-col ms-sm4 ms-md4 ms-lg2">
									{propDef.Caption}
								</Label>
								<span className="ms-Grid-col ms-sm7 ms-md7 ms-lg9 ms-fontWeight-semibold">
									{this.getText(propDef.Id)}
								</span>
								<i
									onClick={() => {
										this._onRemoveFromViewPane(propDef.Id);
									}}
									className="ms-Icon ms-Icon--Cancel ms-Grid-col ms-sm1 ms-md1 ms-lg1"
									aria-hidden="true"
								/>
							</div>
						);
					})}
				</div>
			</React.Fragment>
		);
	}
}

export default inject("appStore", "trimConnector", "wordConnector")(
	observer(DetailsView)
);
