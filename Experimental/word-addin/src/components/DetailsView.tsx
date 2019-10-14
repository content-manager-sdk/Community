import * as React from "react";
import { inject, observer } from "mobx-react";

import {
	ITrimConnector,
	IObjectDetails,
	IPropertyOrFieldDef,
	ITrimDetailsObject,
} from "../trim-coms/trim-connector";
import { Label } from "office-ui-fabric-react/lib/Label";
import { IWordConnector } from "../office-coms/word-connector";

interface IDetailsViewProps {
	appStore?: any;
	trimConnector?: ITrimConnector;
	wordConnector?: IWordConnector;
	recordDetails: IObjectDetails;
}
import {
	mergeStyles,
	ComboBox,
	Spinner,
	DefaultButton,
	Stack,
	IComboBox,
	IComboBoxOption,
} from "office-ui-fabric-react";
import BaseObjectTypes from "../trim-coms/trim-baseobjecttypes";

export class DetailsView extends React.Component<
	IDetailsViewProps,
	{
		propertiesAndFields: IPropertyOrFieldDef[];
		propertyAndFieldDefinitions: IPropertyOrFieldDef[];
		keysToAdd: string[];
		recordProperties: ITrimDetailsObject;
	}
> {
	constructor(props: IDetailsViewProps) {
		super(props);

		this.state = {
			propertiesAndFields: [],
			propertyAndFieldDefinitions: [],
			keysToAdd: [],
			recordProperties: { Uri: 0 },
		};
	}

	componentDidUpdate(newProps: IDetailsViewProps) {
		const { recordDetails } = this.props;
		const { recordProperties } = this.state;
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

		if (recordProperties.Uri === 0) {
			this.setState({ recordProperties: recordDetails.results[0] });
		}
	}

	private getStyles(): string {
		return mergeStyles({
			selectors: {
				"& .ms-Icon": {
					cursor: "pointer",
				},
				"& .ms-ComboBox-container": {
					marginRight: "6px",
					width: "calc(100% - 60px)",
				},
			},
		});
	}

	private getText(propId: string): any {
		const { recordProperties } = this.state;
		if (recordProperties.Uri > 0) {
			const prop = recordProperties[propId];
			if (prop) {
				return prop.StringValue;
			} else {
				const fld = recordProperties.Fields![propId];
				if (fld) {
					return fld.StringValue;
				}
			}
		}
		return "";
	}

	private addToViewPane = () => {
		const { trimConnector } = this.props;
		const {
			propertyAndFieldDefinitions,
			propertiesAndFields,
			keysToAdd,
			recordProperties,
		} = this.state;

		const propItems = propertyAndFieldDefinitions.filter((pdef) => {
			return keysToAdd.includes(pdef.Id);
		});

		if (propItems) {
			propertiesAndFields.push(...propItems);

			trimConnector!
				.setViewPaneProperties(
					recordProperties,
					propertiesAndFields.map((prop) => {
						return prop.Id;
					})
				)
				.then((newProps: IPropertyOrFieldDef[]) => {
					trimConnector!
						.getObjectDetails(BaseObjectTypes.Record, recordProperties.Uri)

						.then((recordDetails) => {
							this.setState({
								propertiesAndFields: newProps,
								recordProperties: recordDetails.results[0],
							});
						});
					//	return newProps;
					//this.setState({ propertiesAndFields: newProps });
				});
		}
	};

	private _onRemoveFromViewPane = (propertyId: string) => {
		const { trimConnector } = this.props;
		const { propertiesAndFields, recordProperties } = this.state;

		const propItem = propertiesAndFields.find((p) => {
			return p.Id === propertyId;
		});

		if (propItem) {
			const pos = propertiesAndFields.indexOf(propItem);
			let newProps = propertiesAndFields;
			newProps.splice(pos, 1);

			trimConnector!
				.setViewPaneProperties(
					recordProperties,
					newProps.map((prop) => {
						return prop.Id;
					})
				)
				.then((newProps: IPropertyOrFieldDef[]) => {
					this.setState({ propertiesAndFields: newProps });
				});
		}
	};
	private _gettingPropDefs: boolean = false;

	private onMenuOpen = () => {
		const { recordProperties } = this.state;

		if (!this._gettingPropDefs) {
			this._gettingPropDefs = true;
			const { propertyAndFieldDefinitions } = this.state;
			const { trimConnector } = this.props;

			if (propertyAndFieldDefinitions.length < 1) {
				trimConnector!
					.getViewPanePropertyDefs(BaseObjectTypes.Record, recordProperties.Uri)
					.then((data) => {
						this.setState({
							propertyAndFieldDefinitions: data,
						});
					});
			}
		}
	};

	private _comboChangePropertyDef = (
		event: React.FormEvent<IComboBox>,
		option?: IComboBoxOption,
		index?: number,
		value?: string
	): void => {
		const currentSelectedKeys = this.state.keysToAdd || [];

		if (option) {
			this.setState({
				keysToAdd: this._updateSelectedOptionKeys(currentSelectedKeys, option),
			});
		}
	};

	private _updateSelectedOptionKeys = (
		selectedKeys: string[],
		option: IComboBoxOption
	): string[] => {
		selectedKeys = [...selectedKeys]; // modify a copy
		const index = selectedKeys.indexOf(option.key as string);
		if (option.selected && index < 0) {
			selectedKeys.push(option.key as string);
		} else {
			selectedKeys.splice(index, 1);
		}
		return selectedKeys;
	};

	public render() {
		const {
			propertiesAndFields,
			propertyAndFieldDefinitions,
			keysToAdd,
		} = this.state;
		const { appStore } = this.props;
		return (
			<React.Fragment>
				<h3>Record Properties</h3>
				<div className={"new-record-body " + this.getStyles()}>
					<div className="details-view ms-Grid">
						{propertiesAndFields.map((propDef) => {
							return (
								<div key={propDef.Id} className="details-item ms-Grid-row ">
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
					<Stack horizontal={true}>
						<ComboBox
							useComboBoxAsMenuWidth={true}
							multiSelect={true}
							selectedKey={keysToAdd}
							onChange={this._comboChangePropertyDef}
							autoComplete="on"
							allowFreeform={true}
							options={propertyAndFieldDefinitions
								.filter((pdef) => {
									return !propertiesAndFields.find(
										(displayedProp) => displayedProp.Id === pdef.Id
									);
								})
								.sort(
									(pdefA: IPropertyOrFieldDef, pdefB: IPropertyOrFieldDef) => {
										if (pdefA.Caption < pdefB.Caption) return -1;
										if (pdefA.Caption > pdefB.Caption) return 1;
										return 0;
									}
								)
								.map((pdef: IPropertyOrFieldDef) => {
									return { key: pdef.Id, text: pdef.Caption };
								})}
							onMenuOpen={this.onMenuOpen}
							onFocus={this.onMenuOpen}
							onRenderLowerContent={() => {
								return propertyAndFieldDefinitions.length < 1 ? (
									<Spinner />
								) : null;
							}}
						/>
						<DefaultButton
							text={appStore.messages.web_Add}
							onClick={this.addToViewPane}
						/>
					</Stack>
				</div>
			</React.Fragment>
		);
	}
}

export default inject("appStore", "trimConnector", "wordConnector")(
	observer(DetailsView)
);
