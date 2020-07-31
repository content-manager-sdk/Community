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
import BaseObjectTypes from "../trim-coms/trim-baseobjecttypes";
import TrimNumberField, {
	TrimNumberFieldHelpers,
} from "./TrimNumberField/TrimNumberField";
import {
	ComboBox,
	IComboBoxOption,
	OverflowSet,
	IOverflowSetItemProps,
	IButtonStyles,
	IconButton,
	CommandButton,
	IStyle,
	ITooltipHostStyles,
	TooltipHost,
} from "office-ui-fabric-react";

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
	selectedPage: number;
}

export interface IPropertySheetProps {
	formDefinition: any;
	onChange?: (newValue?: any, newFields?: any) => void;
	trimConnector?: ITrimConnector;
	computedProperties?: IPageItemValue[];
	showStyleProperties?: Boolean;
}

interface IGetItemDef {
	pageItem: IPageItemValue;
	getValue: () => any;
	fieldType: FieldPickerType;
	asArray?: boolean;
}

export class PropertySheet extends React.Component<
	IPropertySheetProps,
	IPropertySheetState
> {
	constructor(props: IPropertySheetProps) {
		super(props);
		this.state = {
			isTextFieldMultiline: {},
			fieldValues: {},
			selectedPage: 1,
		};
	}

	private fieldInit: IGetItemDef[] = [];

	tabClick(item: number) {
		this.setState({ selectedPage: item });
	}

	doValues() {
		const { onChange } = this.props;
		const newValues = {};

		this.fieldInit.forEach((initData) => {
			let v = this.getFieldValue(
				initData.pageItem,
				initData.getValue,
				initData.fieldType,
				initData.asArray
			);

			if (v && (!Array.isArray(v) || v.length > 0)) {
				newValues[initData.pageItem.Name] = v;

				if (Array.isArray(v) && v.length === 1 && v[0].Uri > 0) {
					v = v[0].Uri;
				}

				if (typeof v.toISOString === "function") {
					v = v.toISOString();
				}

				if (initData.pageItem.Type === "Field") {
					this.formFields[initData.pageItem.Name] = v;
				} else {
					this.formValues[initData.pageItem.Name] = v;
				}
			}
		});

		if (
			onChange &&
			(Object.keys(this.formValues).length > 0 ||
				Object.keys(this.formFields).length > 0)
		) {
			onChange(this.formValues, this.formFields);
		}

		this.setState({ fieldValues: newValues });
		this.preservedValues = newValues;
	}
	componentDidMount() {
		this.doValues();
	}
	componentDidUpdate(prevProps: IPropertySheetProps) {
		const { formDefinition } = this.props;

		if (
			JSON.stringify(formDefinition) !==
			JSON.stringify(prevProps.formDefinition)
		) {
			this.formValues = {};
			this.formFields = {};

			this.fieldInit = [];
			this.setState({ fieldValues: [] }, () => {
				this.doValues();
			});

			//	this.setState({});
		}
	}

	private formValues: any = {};
	private formFields: any = {};
	private preservedValues: any = {};
	setMultiLine(propName: string, multiline: boolean) {
		const newState = this.state;
		newState.isTextFieldMultiline[propName] = multiline;

		this.setState(newState);
	}

	private doPropOrFieldChange = (prop: IPageItemValue, newValue: any) => {
		const { onChange } = this.props;

		if (onChange) {
			let v = newValue;

			if (prop.Type === "Field") {
				this.formFields[prop.Name] = v;
			} else {
				this.formValues[prop.Name] = v;
			}
			onChange(this.formValues, this.formFields);
		}
	};

	private _onSelectObject = (prop: IPageItem) => (
		trimObject: ITrimMainObject
	) => {
		this.preservedValues[prop.Name] = Array.isArray(trimObject)
			? trimObject
			: [trimObject];
		this.doPropOrFieldChange(prop, trimObject.Uri);
	};

	private _onSelectLookupItem = (prop: IPageItem) => (
		trimObject: ITrimMainObject
	) => {
		this.preservedValues[prop.Name] = Array.isArray(trimObject)
			? trimObject
			: [trimObject];
		this.doPropOrFieldChange(prop, trimObject.NameString);
	};

	private _onSelectDate = (prop: IPageItem) => (date: Date) => {
		this.preservedValues[prop.Name] = date;
		this.doPropOrFieldChange(prop, date.toISOString());
	};

	private _onTextChange = (prop: IPageItem) => (
		event: any,
		newText: string
	) => {
		this.preservedValues[prop.Name] = newText;
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
		this.preservedValues[prop.Name] = newNumber;
		this.doPropOrFieldChange(prop, newNumber);
	};

	private _onBooleanChange = (prop: IPageItem) => (
		event: any,
		checked: boolean
	) => {
		this.preservedValues[prop.Name] = checked;
		this.doPropOrFieldChange(prop, checked);
	};

	private _onComboChange = (prop: IPageItem) => (
		event: any,
		item: IComboBoxOption
	) => {
		this.preservedValues[prop.Name] = item.key;
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
				return [fieldValues[pageItem.Name]];
			} else {
				return fieldValues[pageItem.Name];
			}
		} else {
			return getValue();
		}
	};
	private truncate = (label: string, length: number) => {
		if (label.length <= length) {
			return label;
		}
		return label.slice(0, length) + "...";
	};
	private makePageItems = (formItems: any) => {
		const { isTextFieldMultiline, fieldValues } = this.state;
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
						this.fieldInit.push({
							pageItem: pageItem,
							getValue: () => {
								return pageItem.Value
									? [{ Uri: 0, NameString: pageItem.Value }]
									: [];
							},
							fieldType: FieldPickerType.LookupSet,
							asArray: true,
						});

						return (
							<TrimObjectPicker
								{...commonProps}
								trimType={BaseObjectTypes.LookupItem}
								propertyName={pageItem.Name}
								filter={"lkiSet:" + pageItem.LookupSetUri}
								onTrimObjectSelected={this._onSelectLookupItem(pageItem)}
								value={fieldValues[pageItem.Name]}
							/>
						);
					} else {
						this.fieldInit.push({
							pageItem: pageItem,
							getValue: () => {
								return pageItem.Value;
							},
							fieldType: FieldPickerType.Text,
						});

						return (
							<TextField
								{...commonProps}
								multiline={
									pageItem.MultiLine || isTextFieldMultiline[pageItem.Name]
								}
								defaultValue={fieldValues[pageItem.Name]}
								onChange={this._onTextChange(pageItem)}
							/>
						);
					}
				} else if (TrimNumberFieldHelpers.IsNumberField(pageItem.Format)) {
					this.fieldInit.push({
						pageItem: pageItem,
						getValue: () => {
							return pageItem.Value;
						},
						fieldType: FieldPickerType.Any,
					});

					return (
						<TrimNumberField
							format={pageItem.Format}
							{...commonProps}
							defaultValue={fieldValues[pageItem.Name]}
							onChange={this._onNumberChange(pageItem)}
						/>
					);
				} else if (pageItem.Format === "Enum") {
					this.fieldInit.push({
						pageItem: pageItem,
						getValue: () => {
							return pageItem.Value;
						},
						fieldType: FieldPickerType.Any,
					});

					return (
						<ComboBox
							{...commonProps}
							options={pageItem.EnumItems.map((item) => {
								return { key: item.Name, text: item.Caption };
							})}
							onChange={this._onComboChange(pageItem)}
							selectedKey={fieldValues[pageItem.Name]}
						/>
					);
				} else if (pageItem.Format === "Boolean") {
					this.fieldInit.push({
						pageItem: pageItem,
						getValue: () => {
							return pageItem.Value;
						},
						fieldType: FieldPickerType.Any,
					});

					return (
						<Checkbox
							{...commonProps}
							defaultChecked={fieldValues[pageItem.Name]}
							onChange={this._onBooleanChange(pageItem)}
						/>
					);
				} else if (
					pageItem.Format === "Datetime" ||
					pageItem.Format === "Date"
				) {
					this.fieldInit.push({
						pageItem: pageItem,
						getValue: () => {
							return !pageItem.Value || pageItem.Value.IsClear
								? undefined
								: new Date(pageItem.Value.DateTime);
						},
						fieldType: FieldPickerType.Date,
					});

					return (
						<DatePicker
							{...commonProps}
							showMonthPickerAsOverlay={true}
							value={fieldValues[pageItem.Name]}
							onSelectDate={this._onSelectDate(pageItem)}
						/>
					);
				} else if (pageItem.Format === "Object") {
					this.fieldInit.push({
						pageItem: pageItem,
						getValue: () => {
							return pageItem.Value &&
								(pageItem.Value as ITrimMainObject).Uri > 0
								? [pageItem.Value as ITrimMainObject]
								: [];
						},
						fieldType: FieldPickerType.Object,
						asArray: true,
					});

					return (
						<TrimObjectPicker
							{...commonProps}
							trimType={pageItem.ObjectType}
							propertyName={pageItem.Name}
							purpose={pageItem.EditPurpose}
							purposeExtra={pageItem.EditPurposeExtra}
							value={fieldValues[pageItem.Name]}
							onTrimObjectSelected={this._onSelectObject(pageItem)}
						/>
					);
				} else {
					return null;
				}
			});
	};

	public render() {
		const { formDefinition, showStyleProperties } = this.props;
		const { selectedPage } = this.state;

		let pageID = 1;
		let tabId = 0;

		const selectedStyle: IStyle = {
			position: "relative",
			fontSize: "14px",
			backgroundColor: "rgb(0, 120, 212)",
			color: "rgb(255,255,255)",
		};
		const hostStyles: Partial<ITooltipHostStyles> = {
			root: { display: "inline-block" },
		};
		const onRenderItem = (item: IOverflowSetItemProps): JSX.Element => {
			const buttonStyle: IButtonStyles = {
				labelHovered:
					selectedPage === Number(item.key)
						? selectedStyle
						: { backgroundColor: "rgb(244,244,244)" },
				root:
					selectedPage === Number(item.key)
						? selectedStyle
						: { backgroundColor: "rgb(244,244,244)" },
			};
			return (
				<TooltipHost
					content={item.name}
					id={`tab-tip-${item.key}`}
					styles={hostStyles}
				>
					<CommandButton
						role="tab"
						id={`tab-${item.key}`}
						selected={selectedPage === Number(item.key)}
						styles={buttonStyle}
						onClick={item.onClick}
						className={`ms-Pivot-link${
							selectedPage === Number(item.key) ? " is-selected" : ""
						}`}
					>
						{this.truncate(item.name, 33)}
					</CommandButton>
				</TooltipHost>
			);
		};

		const onRenderOverflowButton = (
			overflowItems: any[] | undefined
		): JSX.Element => {
			const buttonStyles: Partial<IButtonStyles> = {
				root: {
					minWidth: 0,
					padding: "0 4px",
					alignSelf: "stretch",
					height: "auto",
				},
			};
			return (
				<IconButton
					role="menuitem"
					title="More options"
					styles={buttonStyles}
					menuIconProps={{ iconName: "More" }}
					menuProps={{ items: overflowItems! }}
				/>
			);
		};
		const mapItem = (page: any) => {
			const itemId = pageID++;
			return {
				key: itemId,
				name: page.Caption,
				onClick: () => {
					this.tabClick(itemId);
				},
			};
		};

		const allItems: IOverflowSetItemProps[] = (
			(formDefinition || {}).Pages || []
		)
			.filter((p: any) => {
				return (
					(p.Type === "Normal" &&
						!p.PageItems.find(function (pg: any) {
							return pg.Name === "CheckinStyleUseForServerMailCapture";
						})) ||
					showStyleProperties
				);
			})
			.map(mapItem);

		let items = allItems.slice(0, 3);
		let visibleTabNames = items.map((i) => {
			return i.name.length;
		});

		while (
			items.length > 1 &&
			visibleTabNames.length > 0 &&
			visibleTabNames.reduce((total, item) => {
				return total + item;
			}) > 34
		) {
			items = allItems.slice(0, items.length - 1);
			visibleTabNames = items.map((i) => {
				return i.name.length;
			});
		}

		if (
			!items.find((anItem) => {
				return Number(anItem.key) === selectedPage;
			})
		) {
			items = allItems.slice(0, items.length - 1);
			items.push(allItems[selectedPage - 1]);
		}

		const overflowItems = allItems.filter((itm) => {
			return !items.find((mainItem) => {
				return itm.key === mainItem.key;
			});
		});

		if (
			formDefinition &&
			formDefinition.Pages &&
			formDefinition.Pages.length > 0
		) {
			return (
				<div className={"trim-properties"}>
					<OverflowSet
						role="menubar"
						items={items}
						overflowItems={overflowItems}
						onRenderOverflowButton={onRenderOverflowButton}
						onRenderItem={onRenderItem}
					></OverflowSet>

					{formDefinition.Pages.filter((p: any) => {
						return (
							(p.Type === "Normal" &&
								!p.PageItems.find(function (pg: any) {
									return pg.Name === "CheckinStyleUseForServerMailCapture";
								})) ||
							showStyleProperties
						);
					}).map((page: any) => {
						return (
							<div
								className="trim-tab"
								key={tabId++}
								style={
									tabId === selectedPage
										? { display: "block" }
										: { display: "none" }
								}
							>
								{this.makePageItems(page.PageItems)}
							</div>
						);
					})}

					{/* <Pivot
						linkFormat={PivotLinkFormat.tabs}
						linkSize={PivotLinkSize.normal}
						onLinkClick={() => {
							this.setState({
								fieldValues: this.preservedValues,
							});
						}}
					>
						{formDefinition.Pages.filter((p: any) => {
							return (
								(p.Type === "Normal" &&
									!p.PageItems.find(function (pg: any) {
										return pg.Name === "CheckinStyleUseForServerMailCapture";
									})) ||
								showStyleProperties
							);
						}).map((page: any) => {
							return (
								<PivotItem headerText={page.Caption} key={pageID++}>
									{this.makePageItems(page.PageItems)}
								</PivotItem>
							);
						})}
					</Pivot> */}
				</div>
			);
		} else {
			return null;
		}
	}
}

export default inject("trimConnector")(observer(PropertySheet));
