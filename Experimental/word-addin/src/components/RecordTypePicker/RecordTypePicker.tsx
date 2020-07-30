import * as React from "react";
import { inject, observer } from "mobx-react";
import { DefaultButton } from "office-ui-fabric-react/lib/Button";
import { IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
import {
	ITrimConnector,
	IRecordType,
	ISearchResults,
	ITrimMainObject,
	ICheckinPlace,
} from "../../trim-coms/trim-connector";
import { BaseObjectTypes } from "../../trim-coms/trim-baseobjecttypes";

import { IOfficeConnector } from "src/office-coms/office-connector";

import {
	ComboBox,
	IComboBoxOption,
	IComboBox,
	mergeStyles,
} from "office-ui-fabric-react";

interface IRecordTypePickerState {
	checkinStyles: IDropdownOption[];
	recordTypes: IDropdownOption[];
	checkinUsingStyle: Boolean;
}

interface IRecordTypePickerProps {
	appStore?: any;
	trimConnector?: ITrimConnector;
	wordConnector?: IOfficeConnector;
	trimType?: BaseObjectTypes;
	onRecordTypeSelected: (recordType: ITrimMainObject) => void;
	folderId?: string;
	isLinkedFolder?: Boolean;
	computedCheckinStyleName?: string;
	includeCheckinStyles: boolean;
	defaultRecordType?: ITrimMainObject;
	selectedRecordType?: ITrimMainObject;
	disabled?: boolean;
}

export class RecordTypePicker extends React.Component<
	IRecordTypePickerProps,
	IRecordTypePickerState
> {
	constructor(props: IRecordTypePickerProps) {
		super(props);

		this.state = {
			checkinStyles: [],
			recordTypes: [],
			checkinUsingStyle: false,
		};
	}

	recordTypeUri: number = 0;
	recordProps: any = {};
	recordFields: any = {};
	_mounted: Boolean;

	setRecordTypes(recTypes: IDropdownOption[]): IDropdownOption[] {
		const newRecTypes = [...recTypes];

		this.recordTypeUri = 0;
		return newRecTypes;
	}

	private getStyles(): string {
		return mergeStyles({
			selectors: {
				"& .ms-ComboBox-optionsContainerWrapper": {
					maxHeight: `${window.innerHeight - 100}px`,
					overflowY: "auto",
				},
			},
		});
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	componentDidMount() {
		const {
			trimConnector,
			defaultRecordType,
			onRecordTypeSelected,
			selectedRecordType,
			appStore,
			includeCheckinStyles,
		} = this.props;

		this._mounted = true;

		if (trimConnector) {
			const newStyle: any = {};
			let checkinUsingStyle = false;

			if (!selectedRecordType) {
				checkinUsingStyle =
					trimConnector.getUseCheckinStyles() &&
					appStore!.isEmail() &&
					includeCheckinStyles;

				newStyle.checkinUsingStyle = checkinUsingStyle;
			}
			const startingRecordType = selectedRecordType || defaultRecordType;

			if (!checkinUsingStyle && startingRecordType) {
				newStyle.recordTypes = [
					{
						key: startingRecordType.Uri,
						text: startingRecordType.NameString,
						selected: true,
					} as IDropdownOption,
				];
			}

			this.setState(newStyle, () => {
				if (!checkinUsingStyle && startingRecordType) {
					this.recordTypeUri = startingRecordType!.Uri;
					if (onRecordTypeSelected) {
						onRecordTypeSelected(startingRecordType);
					}
				}
			});
		}
	}

	private getOptions = (): void => {
		const { trimConnector, appStore } = this.props;
		const { checkinUsingStyle } = this.state;

		appStore!.setSpinning(true);
		if (checkinUsingStyle) {
			trimConnector!
				.search<ITrimMainObject>({
					trimType: BaseObjectTypes.CheckinPlace,
					q: "cipType:MailForClientProcessing",
					properties: "CheckinPlaceCheckinAs,NameString",
					purpose: 0,
				})
				.then((placesResponse: ISearchResults<ICheckinPlace>) => {
					this.setState(
						{
							checkinStyles: placesResponse.results.map(function (
								o: ICheckinPlace
							) {
								return {
									key: o.CheckinAs.Uri,
									text: o.NameString,
								} as IDropdownOption;
							}),
						},
						function () {
							appStore!.setSpinning(false);
						}
					);
				});
		} else {
			trimConnector!
				.search<IRecordType>({
					trimType: BaseObjectTypes.RecordType,
					q: "unkAll",
					filter: "unkUsable rtyBehaviour:1 hasElecDocSupport unkActive",
					purpose: 3,
				})
				.then((response: ISearchResults<IRecordType>) => {
					this.setState(
						{
							recordTypes: this.setRecordTypes(
								response.results.map(function (o: IRecordType) {
									return { key: o.Uri, text: o.NameString } as IDropdownOption;
								})
							),
						},
						function () {
							appStore!.setSpinning(false);
						}
					);
				});
		}
	};

	private _onChange = (
		event: React.FormEvent<IComboBox>,
		option?: IComboBoxOption,
		index?: number,
		value?: string
	) => {
		const { onRecordTypeSelected } = this.props;
		const { checkinUsingStyle, checkinStyles, recordTypes } = this.state;

		if (onRecordTypeSelected && option) {
			if (checkinUsingStyle && checkinStyles.length > 0) {
				this.recordTypeUri = Number(option.key);
				onRecordTypeSelected({
					Uri: Number(option.key),
					NameString: option.text,
					TrimType: BaseObjectTypes.CheckinStyle,
				});
			} else if (recordTypes.length > 0) {
				onRecordTypeSelected({
					Uri: Number(option.key),
					NameString: option.text,
					TrimType: BaseObjectTypes.RecordType,
				});
			}
		}
	};

	public render() {
		const {
			trimConnector,
			appStore,
			trimType,
			folderId,
			computedCheckinStyleName,
			isLinkedFolder,
			disabled,
			defaultRecordType,
		} = this.props;

		const { checkinStyles, checkinUsingStyle, recordTypes } = this.state;

		const computedProps = [];
		if (trimType === BaseObjectTypes.CheckinStyle) {
			computedProps.push(
				{
					Name: "CheckinStyleUseForServerMailCapture",
					Value: !folderId,
					Type: "Property",
				},
				{
					Name: "CheckinStyleUseForServerMailFolderType",
					Value: "NormalFolder",
					Type: "Property",
				},
				{ Name: "CheckinStyleRecordType", Value: undefined, Type: "Property" }
			);
			if (folderId && folderId !== "cm_auto" && computedCheckinStyleName) {
				computedProps.push({
					Name: "CheckinStyleName",
					Value: computedCheckinStyleName,
					Type: "Property",
				});
			}
		}

		const comboProps = {
			calloutProps: {
				hideOverflow: true,
				className: this.getStyles(),
			},
			useComboBoxAsMenuWidth: true,
			onChange: this._onChange,
			disabled,
		};

		return (
			<React.Fragment>
				{checkinUsingStyle ? (
					<ComboBox
						{...comboProps}
						options={checkinStyles}
						onMenuOpen={this.getOptions}
						defaultSelectedKey={
							defaultRecordType &&
							defaultRecordType!.TrimType === BaseObjectTypes.CheckinStyle
								? defaultRecordType!.Uri
								: 0
						}
						placeholder={appStore.messages.web_SelectCheckinStyle}
						onRenderLowerContent={() => {
							return (
								<DefaultButton
									style={{
										width: "100%",
									}}
									text={appStore.messages.web_UseRecordTypes}
									onClick={() => {
										this.setState({ checkinUsingStyle: false }, () => {
											this.getOptions();
										});
										trimConnector!.setUseCheckinStyles(false);
									}}
								/>
							);
						}}
					/>
				) : (
					<ComboBox
						{...comboProps}
						disabled={
							trimType === BaseObjectTypes.CheckinStyle &&
							!folderId &&
							isLinkedFolder === true
						}
						placeholder={
							defaultRecordType && defaultRecordType.NameString
								? defaultRecordType.NameString
								: appStore.messages.web_SelectRecordType
						}
						options={recordTypes}
						onMenuOpen={this.getOptions}
						defaultSelectedKey={
							defaultRecordType &&
							defaultRecordType!.TrimType === BaseObjectTypes.RecordType
								? defaultRecordType!.Uri
								: 0
						}
						onRenderLowerContent={() => {
							return !appStore!.isEmail() ||
								trimType === BaseObjectTypes.CheckinStyle ? null : (
								<DefaultButton
									style={{
										width: "100%",
									}}
									text={appStore.messages.web_UseCheckinStyles}
									onClick={() => {
										this.setState({ checkinUsingStyle: true }, () => {
											this.getOptions();
										});
										trimConnector!.setUseCheckinStyles(true);
									}}
								/>
							);
						}}
					/>
				)}
			</React.Fragment>
		);
	}
}

export default inject(
	"appStore",
	"trimConnector",
	"wordConnector"
)(observer(RecordTypePicker));
