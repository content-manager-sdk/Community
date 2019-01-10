import * as React from "react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { DatePicker } from "office-ui-fabric-react/lib/DatePicker";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import TrimObjectPicker from "./TrimObjectPicker/TrimObjectPicker";

export class PropertySheet extends React.Component<
	{
		formDefinition: any;
		defaultRecordTitle?: string;
		onChange?: (newValue?: any) => void;
	},
	any
> {
	private formValues: any = {};
	@observable isTextFieldMultiline: any = {};
	@action.bound
	setMultiLine(propName: string, multiline: boolean) {
		this.isTextFieldMultiline[propName] = multiline;
	}

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
		if (newMultiline !== this.isTextFieldMultiline[propName]) {
			this.setMultiLine(propName, newMultiline);
		}
		const { onChange } = this.props;
		if (onChange) {
			this.formValues[propName] = newText;
			onChange(this.formValues);
		}
	};

	public render() {
		const { formDefinition } = this.props;

		if (
			formDefinition &&
			formDefinition.Pages &&
			formDefinition.Pages.length > 0
		) {
			const form = formDefinition.Pages[0];
			const formItems = form.PageItems || [];

			const pageItems = formItems.map((pageItem: any) => {
				const commonProps = { key: pageItem.Name, label: pageItem.Caption };

				if (pageItem.Format === "String") {
					return (
						<TextField
							{...commonProps}
							multiline={this.isTextFieldMultiline[pageItem.Name]}
							defaultValue={
								pageItem.Name === "RecordTypedTitle"
									? this.props.defaultRecordTitle
									: ""
							}
							onChange={this._onTextChange(pageItem.Name)}
						/>
					);
				}
				if (pageItem.Format === "Datetime") {
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
					return (
						<TrimObjectPicker
							{...commonProps}
							trimType={pageItem.ObjectType}
							propertyName={pageItem.Name}
							purpose={pageItem.EditPurpose}
							purposeExtra={pageItem.EditPurposeExtra}
						/>
					);
				} else {
					return null;
				}
			});
			return (
				<div>
					<h1 className="ms-font-l">{form.Caption}</h1>
					{pageItems}
				</div>
			);
		} else {
			return null;
		}
	}
}

export default observer(PropertySheet);
