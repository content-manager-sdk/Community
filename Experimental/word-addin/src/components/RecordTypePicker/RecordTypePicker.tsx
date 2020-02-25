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
	onRecordTypeSelected: (uri: number, isCheckinStyle: boolean) => void;
	folderId?: string;
	isLinkedFolder?: Boolean;
	computedCheckinStyleName?: string;
	includeCheckinStyles: boolean;
	defaultRecordType?: ITrimMainObject;
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

	setRecordTypes(recTypes: IDropdownOption[]) {
		const { defaultRecordType, appStore } = this.props;

		const newRecTypes = [...recTypes];
		let defaultUri = appStore.documentInfo.Options.DefaultDocumentRecordType;

		if (
			defaultRecordType &&
			defaultRecordType.TrimType === BaseObjectTypes.RecordType
		) {
			defaultUri = defaultRecordType.Uri;
		}

		newRecTypes.forEach((rt) => {
			if (rt.key === defaultUri) {
				rt.selected = true;
			}
		});

		this.setState({ recordTypes: newRecTypes });
		this.recordTypeUri = 0;
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
			appStore,
			onRecordTypeSelected,
			includeCheckinStyles,
			defaultRecordType,
		} = this.props;

		this._mounted = true;

		if (trimConnector) {
			appStore.setSpinning(true);
			this.setState({
				checkinUsingStyle: trimConnector.getUseCheckinStyles(),
			});
			let me = this;

			const promisesToRun = [
				trimConnector.search<IRecordType>({
					trimType: BaseObjectTypes.RecordType,
					q: "unkAll",
					filter: "unkUsable rtyBehaviour:1 hasElecDocSupport unkActive",
					purpose: 3,
				}),
			];

			if (includeCheckinStyles) {
				promisesToRun.push(
					trimConnector.search<ITrimMainObject>({
						trimType: BaseObjectTypes.CheckinPlace,
						q: "cipType:MailForClientProcessing",
						properties: "CheckinPlaceCheckinAs,NameString",
						purpose: 0,
					})
				);
			}

			return Promise.all(promisesToRun)
				.then((values) => {
					const response = values[0] as ISearchResults<IRecordType>;

					if (this._mounted) {
						me.setRecordTypes(
							response.results.map(function(o: IRecordType) {
								return { key: o.Uri, text: o.NameString } as IDropdownOption;
							})
						);
						if (values.length > 1) {
							const placesResponse = values[1] as ISearchResults<ICheckinPlace>;
							this.setState({
								checkinStyles: placesResponse.results.map(function(
									o: ICheckinPlace
								) {
									let selected = false;
									if (
										defaultRecordType &&
										defaultRecordType.TrimType ==
											BaseObjectTypes.CheckinStyle &&
										defaultRecordType.Uri === o.CheckinAs.Uri
									) {
										selected = true;
									}
									return {
										key: o.CheckinAs.Uri,
										text: o.NameString,
										selected,
									} as IDropdownOption;
								}),
							});
						}
						if (
							defaultRecordType ||
							appStore.documentInfo.Options.DefaultDocumentRecordType > 0
						) {
							me.recordTypeUri =
								defaultRecordType!.Uri ||
								appStore.documentInfo.Options.DefaultDocumentRecordType;
							if (onRecordTypeSelected) {
								onRecordTypeSelected(
									me.recordTypeUri,
									defaultRecordType
										? defaultRecordType.TrimType ===
												BaseObjectTypes.CheckinStyle
										: false
								);
							}
						}
						appStore!.setSpinning(false);
					}
				})
				.catch((e) => {
					appStore!.setError(e);
				});
		} else {
			return null;
		}
	}

	private _onChange = (
		event: React.FormEvent<IComboBox>,
		option?: IComboBoxOption,
		index?: number,
		value?: string
	) => {
		const { onRecordTypeSelected } = this.props;
		const { checkinUsingStyle, checkinStyles, recordTypes } = this.state;

		if (onRecordTypeSelected) {
			if (checkinUsingStyle && checkinStyles.length > 0) {
				this.recordTypeUri = Number(checkinStyles[index!].key);
				onRecordTypeSelected(this.recordTypeUri, true);
			} else if (recordTypes.length > 0) {
				const recordTypeUri = Number(recordTypes[index!].key);
				onRecordTypeSelected(recordTypeUri, false);
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
				{checkinUsingStyle && checkinStyles ? (
					<ComboBox
						{...comboProps}
						options={checkinStyles}
						placeholder={appStore.messages.web_SelectCheckinStyle}
						onRenderLowerContent={() => {
							return checkinStyles.length > 0 ? (
								<DefaultButton
									style={{
										width: "100%",
									}}
									text={appStore.messages.web_UseRecordTypes}
									onClick={() => {
										this.setState({ checkinUsingStyle: false });
										trimConnector!.setUseCheckinStyles(false);
									}}
								/>
							) : null;
						}}
					/>
				) : recordTypes && recordTypes.length > 0 ? (
					<ComboBox
						{...comboProps}
						disabled={
							trimType === BaseObjectTypes.CheckinStyle &&
							!folderId &&
							isLinkedFolder === true
						}
						options={recordTypes}
						placeholder={appStore.messages.web_SelectRecordType}
						onRenderLowerContent={() => {
							return checkinStyles.length > 0 ? (
								<DefaultButton
									style={{
										width: "100%",
									}}
									text={appStore.messages.web_UseCheckinStyles}
									onClick={() => {
										this.setState({ checkinUsingStyle: true });
										trimConnector!.setUseCheckinStyles(true);
									}}
								/>
							) : null;
						}}
					/>
				) : null}
			</React.Fragment>
		);
	}
}

export default inject(
	"appStore",
	"trimConnector",
	"wordConnector"
)(observer(RecordTypePicker));
