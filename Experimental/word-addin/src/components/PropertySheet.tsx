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

export interface IPropertySheetState {
	isTextFieldMultiline: any;
}

export interface IPropertySheetProps {
	formDefinition: any;
	defaultRecordTitle?: string;
	onChange?: (newValue?: any) => void;
}

export class PropertySheet extends React.Component<
	IPropertySheetProps,
	IPropertySheetState
> {
	constructor(props: IPropertySheetProps) {
		super(props);
		this.state = { isTextFieldMultiline: {} };
	}

	private formValues: any = {};

	setMultiLine(propName: string, multiline: boolean) {
		const newState = this.state;
		newState.isTextFieldMultiline[propName] = multiline;

		this.setState(newState);
	}

	private _onSelectObject = (propName: string) => (
		trimObject: ITrimMainObject
	) => {
		const { onChange } = this.props;
		if (onChange) {
			this.formValues[propName] = trimObject.Uri;
			onChange(this.formValues);
		}
	};

	private _onSelectLookupItem = (propName: string) => (
		trimObject: ITrimMainObject
	) => {
		const { onChange } = this.props;
		if (onChange) {
			this.formValues[propName] = trimObject.NameString;
			onChange(this.formValues);
		}
	};

	private _onSelectDate = (propName: string) => (date: Date) => {
		const { onChange } = this.props;
		if (onChange) {
			this.formValues[propName] = date.toISOString();
			onChange(this.formValues);
		}
	};

	private _onTextChange = (propName: string) => (
		event: any,
		newText: string
	) => {
		const newMultiline = newText.length > 40;
		const { isTextFieldMultiline } = this.state;
		if (newMultiline !== isTextFieldMultiline[propName]) {
			this.setMultiLine(propName, newMultiline);
		}
		const { onChange } = this.props;
		if (onChange) {
			this.formValues[propName] = newText;
			onChange(this.formValues);
		}
	};

	private makePageItems = (formItems: any) => {
		const { isTextFieldMultiline } = this.state;
		return formItems.map((pageItem: any) => {
			const commonProps = { key: pageItem.Name, label: pageItem.Caption };

			if (pageItem.Format === "String" || pageItem.Format === "Text") {
				if (pageItem.LookupSetUri > 0) {
					if (pageItem.Value) {
						this._onSelectLookupItem(pageItem.Name)(pageItem.Value);
					}
					return (
						<TrimObjectPicker
							{...commonProps}
							trimType={BaseObjectTypes.LookupItem}
							propertyName={pageItem.Name}
							filter={"lkiSet:" + pageItem.LookupSetUri}
							onTrimObjectSelected={this._onSelectLookupItem(pageItem.Name)}
							value={
								pageItem.Value ? [{ Uri: 0, NameString: pageItem.Value }] : []
							}
						/>
					);
				} else {
					if (pageItem.Value) {
						this._onTextChange(pageItem.Name)(null, pageItem.Value);
					}

					return (
						<TextField
							{...commonProps}
							multiline={
								pageItem.MultiLine || isTextFieldMultiline[pageItem.Name]
							}
							defaultValue={
								pageItem.Name === "RecordTypedTitle"
									? this.props.defaultRecordTitle || pageItem.Value
									: pageItem.Value
							}
							onChange={this._onTextChange(pageItem.Name)}
						/>
					);
				}
			} else if (TrimNumberFieldHelpers.IsNumberField(pageItem.Format)) {
				return (
					<TrimNumberField
						format={pageItem.Format}
						{...commonProps}
						defaultValue={pageItem.Value}
					/>
				);
			} else if (pageItem.Format === "Boolean") {
				return <Checkbox {...commonProps} defaultChecked={pageItem.Value} />;
			} else if (pageItem.Format === "Datetime") {
				if (pageItem.Value && !pageItem.Value.IsClear) {
					this._onSelectDate(pageItem.Name)(new Date(pageItem.Value.DateTime));
				}
				return (
					<DatePicker
						{...commonProps}
						showMonthPickerAsOverlay={true}
						value={
							pageItem.Value.IsClear
								? undefined
								: new Date(pageItem.Value.DateTime)
						}
						onSelectDate={this._onSelectDate(pageItem.Name)}
					/>
				);
			} else if (pageItem.Format === "Object") {
				if (pageItem.Value) {
					this._onSelectObject(pageItem.Name)(pageItem.Value);
				}
				return (
					<TrimObjectPicker
						{...commonProps}
						trimType={pageItem.ObjectType}
						propertyName={pageItem.Name}
						purpose={pageItem.EditPurpose}
						purposeExtra={pageItem.EditPurposeExtra}
						value={
							pageItem.Value && (pageItem.Value as ITrimMainObject).Uri > 0
								? [pageItem.Value as ITrimMainObject]
								: []
						}
						onTrimObjectSelected={this._onSelectObject(pageItem.Name)}
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
