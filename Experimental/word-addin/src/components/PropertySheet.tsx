import * as React from "react";
import { observer, inject } from "mobx-react";
import { DatePicker } from "office-ui-fabric-react/lib/DatePicker";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { Checkbox } from "office-ui-fabric-react/lib/Checkbox";
import TrimObjectPicker from "./TrimObjectPicker/TrimObjectPicker";
import {
	ITrimMainObject,
	ITrimConnector,
	IEnumDetails,
} from "../trim-coms/trim-connector";
import {
	Pivot,
	PivotItem,
	PivotLinkFormat,
	PivotLinkSize,
} from "office-ui-fabric-react/lib/Pivot";
import BaseObjectTypes from "../trim-coms/trim-baseobjecttypes";
import TrimNumberField, {
	TrimNumberFieldHelpers,
} from "./TrimNumberField/TrimNumberField";
import { ComboBox, IComboBoxOption } from "office-ui-fabric-react";

enum FieldPickerType {
	Any = 1,
	LookupSet,
	Object,
	Text,
	Date,
}

interface IPageItemValue {
	Name: string;
	Value: any;
	Type: string;
}
interface IPageItem extends IPageItemValue {
	Format: string;
	LookupSetUri: number;
	Caption: string;
	ObjectType: BaseObjectTypes;
	EditPurpose: number;
	EditPurposeExtra: number;
	MultiLine?: Boolean;
	EnumName: string;
	EnumItems: IEnumDetails[];
}

export interface IPropertySheetState {
	isTextFieldMultiline: any;
	fieldValues: any;
}

export interface IPropertySheetProps {
	formDefinition: any;
	defaultRecordTitle?: string;
	onChange?: (newValue?: any, newFields?: any) => void;
	trimConnector?: ITrimConnector;
	computedProperties?: IPageItemValue[];
}

export class PropertySheet extends React.Component<
	IPropertySheetProps,
	IPropertySheetState
> {
	constructor(props: IPropertySheetProps) {
		super(props);
		this.state = { isTextFieldMultiline: {}, fieldValues: {} };
	}

	componentDidUpdate(prevProps: IPropertySheetProps) {
		const { formDefinition, onChange } = this.props;

		if (
			JSON.stringify(formDefinition) !==
			JSON.stringify(prevProps.formDefinition)
		) {
			this.formValues = {};
			this.formFields = {};

			this.setState({});
			if (onChange) {
				onChange(this.formValues, this.formFields);
			}
		}
	}

	private formValues: any = {};
	private formFields: any = {};
	setMultiLine(propName: string, multiline: boolean) {
		const newState = this.state;
		newState.isTextFieldMultiline[propName] = multiline;

		this.setState(newState);
	}

	private doPropOrFieldChange = (prop: IPageItemValue, newValue: any) => {
		const { onChange } = this.props;
		if (onChange) {
			if (prop.Type === "Field") {
				this.formFields[prop.Name] = newValue;
			} else {
				this.formValues[prop.Name] = newValue;
			}
			onChange(this.formValues, this.formFields);
		}
	};

	private _onSelectObject = (prop: IPageItem) => (
		trimObject: ITrimMainObject
	) => {
		const { fieldValues } = this.state;

		this.setState({ fieldValues: { ...fieldValues, [prop.Name]: trimObject } });
		this.doPropOrFieldChange(prop, trimObject.Uri);
	};

	private _onSelectLookupItem = (prop: IPageItem) => (
		trimObject: ITrimMainObject
	) => {
		const { fieldValues } = this.state;
		this.setState({ fieldValues: { ...fieldValues, [prop.Name]: trimObject } });

		this.doPropOrFieldChange(prop, trimObject.NameString);
	};

	private _onSelectDate = (prop: IPageItem) => (date: Date) => {
		const { fieldValues } = this.state;
		this.setState({ fieldValues: { ...fieldValues, [prop.Name]: date } });
		this.doPropOrFieldChange(prop, date.toISOString());
	};

	private _onTextChange = (prop: IPageItem) => (
		event: any,
		newText: string
	) => {
		const { fieldValues } = this.state;

		this.setState({ fieldValues: { ...fieldValues, [prop.Name]: newText } });

		this.textChange(prop, newText);
	};

	private textChange = (prop: IPageItemValue, newText: string) => {
		const newMultiline = newText.length > 40;
		const { isTextFieldMultiline } = this.state;
		if (newMultiline !== isTextFieldMultiline[prop.Name]) {
			this.setMultiLine(prop.Name, newMultiline);
		}
		this.doPropOrFieldChange(prop, newText);
	};

	private _onNumberChange = (prop: IPageItem) => (newNumber: number) => {
		const { fieldValues } = this.state;

		this.setState({ fieldValues: { ...fieldValues, [prop.Name]: newNumber } });
		this.doPropOrFieldChange(prop, newNumber);
	};

	private _onBooleanChange = (prop: IPageItem) => (
		event: any,
		checked: boolean
	) => {
		const { fieldValues } = this.state;

		this.setState({ fieldValues: { ...fieldValues, [prop.Name]: checked } });
		this.doPropOrFieldChange(prop, checked);
	};

	private _onComboChange = (prop: IPageItem) => (
		event: any,
		item: IComboBoxOption
	) => {
		const { fieldValues } = this.state;

		this.setState({ fieldValues: { ...fieldValues, [prop.Name]: item.key } });
		this.doPropOrFieldChange(prop, item.key);
	};

	private getFieldValue = (
		pageItem: IPageItemValue,
		getValue: () => any,
		fieldType: FieldPickerType = FieldPickerType.Any,
		asArray: boolean = false
	) => {
		const { fieldValues } = this.state;

		if (!(pageItem.Name in fieldValues) && pageItem.Value !== undefined) {
			if (fieldType == FieldPickerType.Date) {
				if (!pageItem.Value.IsClear) {
					this.doPropOrFieldChange(
						pageItem,
						new Date(pageItem.Value.DateTime).toISOString()
					);
				}
			} else if (fieldType === FieldPickerType.Text) {
				this.textChange(pageItem, pageItem.Value);
			} else {
				let val = pageItem.Value;

				if (fieldType === FieldPickerType.Object) {
					val = pageItem.Value.Uri;
				} else if (fieldType === FieldPickerType.LookupSet) {
					val = pageItem.Value.NameString;
				}
				this.doPropOrFieldChange(pageItem, val);
			}
		}

		if (pageItem.Name in fieldValues) {
			if (asArray) {
				return [this.state.fieldValues[pageItem.Name]];
			} else {
				return this.state.fieldValues[pageItem.Name];
			}
		} else {
			return getValue();
		}
	};

	private makePageItems = (formItems: any) => {
		const { isTextFieldMultiline } = this.state;
		const { computedProperties } = this.props;

		(computedProperties || []).forEach((pageItem: IPageItemValue) => {
			this.getFieldValue(pageItem, () => {
				return null;
			});
		});

		return formItems
			.filter((pageItem: IPageItemValue) => {
				return (
					(computedProperties || []).find((item) => {
						return item.Name === pageItem.Name;
					}) === undefined
				);
			})
			.map((pageItem: IPageItem) => {
				const commonProps = { key: pageItem.Name, label: pageItem.Caption };

				if (
					(computedProperties || []).find((item) => {
						return item.Name === pageItem.Name;
					}) !== undefined
				) {
					return null;
				}

				if (
					pageItem.Format === "String" ||
					pageItem.Format === "Text" ||
					pageItem.Format === "Geography"
				) {
					if (pageItem.LookupSetUri > 0) {
						const val = this.getFieldValue(
							pageItem,
							() => {
								return pageItem.Value
									? [{ Uri: 0, NameString: pageItem.Value }]
									: [];
							},
							FieldPickerType.LookupSet,
							true
						);

						return (
							<TrimObjectPicker
								{...commonProps}
								trimType={BaseObjectTypes.LookupItem}
								propertyName={pageItem.Name}
								filter={"lkiSet:" + pageItem.LookupSetUri}
								onTrimObjectSelected={this._onSelectLookupItem(pageItem)}
								value={val}
							/>
						);
					} else {
						const val = this.getFieldValue(
							pageItem,
							() => {
								return pageItem.Name === "RecordTypedTitle"
									? this.props.defaultRecordTitle || pageItem.Value
									: pageItem.Value;
							},
							FieldPickerType.Text
						);

						return (
							<TextField
								{...commonProps}
								multiline={
									pageItem.MultiLine || isTextFieldMultiline[pageItem.Name]
								}
								defaultValue={val}
								onChange={this._onTextChange(pageItem)}
							/>
						);
					}
				} else if (TrimNumberFieldHelpers.IsNumberField(pageItem.Format)) {
					const val = this.getFieldValue(pageItem, () => {
						return pageItem.Value;
					});

					return (
						<TrimNumberField
							format={pageItem.Format}
							{...commonProps}
							defaultValue={val}
							onChange={this._onNumberChange(pageItem)}
						/>
					);
				} else if (pageItem.Format === "Enum") {
					const val = this.getFieldValue(pageItem, () => {
						return pageItem.Value;
					});

					return (
						<ComboBox
							{...commonProps}
							options={pageItem.EnumItems.map((item) => {
								return { key: item.Name, text: item.Caption };
							})}
							onChange={this._onComboChange(pageItem)}
							selectedKey={val}
						/>
					);
				} else if (pageItem.Format === "Boolean") {
					const val = this.getFieldValue(pageItem, () => {
						return pageItem.Value;
					});

					return (
						<Checkbox
							{...commonProps}
							defaultChecked={val}
							onChange={this._onBooleanChange(pageItem)}
						/>
					);
				} else if (
					pageItem.Format === "Datetime" ||
					pageItem.Format === "Date"
				) {
					const val = this.getFieldValue(
						pageItem,
						() => {
							return !pageItem.Value || pageItem.Value.IsClear
								? undefined
								: new Date(pageItem.Value.DateTime);
						},
						FieldPickerType.Date
					);

					return (
						<DatePicker
							{...commonProps}
							showMonthPickerAsOverlay={true}
							value={val}
							onSelectDate={this._onSelectDate(pageItem)}
						/>
					);
				} else if (pageItem.Format === "Object") {
					const val = this.getFieldValue(
						pageItem,
						() => {
							return pageItem.Value &&
								(pageItem.Value as ITrimMainObject).Uri > 0
								? [pageItem.Value as ITrimMainObject]
								: [];
						},
						FieldPickerType.Object,
						true
					);

					return (
						<TrimObjectPicker
							{...commonProps}
							trimType={pageItem.ObjectType}
							propertyName={pageItem.Name}
							purpose={pageItem.EditPurpose}
							purposeExtra={pageItem.EditPurposeExtra}
							value={val}
							onTrimObjectSelected={this._onSelectObject(pageItem)}
						/>
					);
				} else {
					return null;
				}
			});
	};

	public render() {
		const { formDefinition } = this.props;

		if (
			formDefinition &&
			formDefinition.Pages &&
			formDefinition.Pages.length > 0
		) {
			let pageID = 1;
			return (
				<div className={"trim-properties"}>
					<Pivot
						linkFormat={PivotLinkFormat.tabs}
						linkSize={PivotLinkSize.normal}
						onLinkClick={() => {
							this.forceUpdate();
						}}
					>
						{formDefinition.Pages.map((page: any) => {
							if (page.Type === "Normal") {
								return (
									<PivotItem headerText={page.Caption} key={pageID++}>
										{this.makePageItems(page.PageItems)}
									</PivotItem>
								);
							} else {
								return null;
							}
						})}
					</Pivot>
				</div>
			);
		} else {
			return null;
		}
	}
}

export default inject("trimConnector")(observer(PropertySheet));
