import * as React from "react";
import { observer } from "mobx-react";
import { DatePicker } from "office-ui-fabric-react/lib/DatePicker";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { Checkbox } from "office-ui-fabric-react/lib/Checkbox";
import TrimObjectPicker from "./TrimObjectPicker/TrimObjectPicker";
import { ITrimMainObject } from "../trim-coms/trim-connector";
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

enum FieldPickerType {
	Any = 1,
	LookupSet,
	Object,
	Text,
	Date,
}

interface IPageItem {
	Name: string;
	Value: any;
	Type: string;
	Format: string;
	LookupSetUri: number;
	Caption: string;
	ObjectType: BaseObjectTypes;
	EditPurpose: number;
	EditPurposeExtra: number;
	MultiLine?: Boolean;
}

export interface IPropertySheetState {
	isTextFieldMultiline: any;
	fieldValues: any;
}

export interface IPropertySheetProps {
	formDefinition: any;
	defaultRecordTitle?: string;
	onChange?: (newValue?: any, newFields?: any) => void;
}

export class PropertySheet extends React.Component<
	IPropertySheetProps,
	IPropertySheetState
> {
	constructor(props: IPropertySheetProps) {
		super(props);
		this.state = { isTextFieldMultiline: {}, fieldValues: {} };
	}

	private formValues: any = {};
	private formFields: any = {};
	setMultiLine(propName: string, multiline: boolean) {
		const newState = this.state;
		newState.isTextFieldMultiline[propName] = multiline;

		this.setState(newState);
	}

	private doPropOrFieldChange = (prop: IPageItem, newValue: any) => {
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

	private textChange = (prop: IPageItem, newText: string) => {
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

	private makePageItems = (formItems: any) => {
		const { isTextFieldMultiline } = this.state;
		return formItems.map((pageItem: IPageItem) => {
			const getFieldValue = (
				getValue: () => any,
				fieldType: FieldPickerType = FieldPickerType.Any,
				asArray: boolean = false
			) => {
				const { fieldValues } = this.state;
				if (pageItem.Value) {
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

			const commonProps = { key: pageItem.Name, label: pageItem.Caption };

			if (pageItem.Format === "String" || pageItem.Format === "Text") {
				if (pageItem.LookupSetUri > 0) {
					const val = getFieldValue(
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
					const val = getFieldValue(() => {
						return pageItem.Name === "RecordTypedTitle"
							? this.props.defaultRecordTitle || pageItem.Value
							: pageItem.Value;
					}, FieldPickerType.Text);

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
				const val = getFieldValue(() => {
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
			} else if (pageItem.Format === "Boolean") {
				const val = getFieldValue(() => {
					return pageItem.Value;
				});

				return (
					<Checkbox
						{...commonProps}
						defaultChecked={val}
						onChange={this._onBooleanChange(pageItem)}
					/>
				);
			} else if (pageItem.Format === "Datetime" || pageItem.Format === "Date") {
				const val = getFieldValue(() => {
					return !pageItem.Value || pageItem.Value.IsClear
						? undefined
						: new Date(pageItem.Value.DateTime);
				}, FieldPickerType.Date);

				return (
					<DatePicker
						{...commonProps}
						showMonthPickerAsOverlay={true}
						value={val}
						onSelectDate={this._onSelectDate(pageItem)}
					/>
				);
			} else if (pageItem.Format === "Object") {
				const val = getFieldValue(
					() => {
						return pageItem.Value && (pageItem.Value as ITrimMainObject).Uri > 0
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
				<div className="trim-properties">
					<Pivot
						linkFormat={PivotLinkFormat.tabs}
						linkSize={PivotLinkSize.normal}
						onLinkClick={() => {
							this.forceUpdate();
						}}
					>
						<hr />
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

export default observer(PropertySheet);
