import * as React from "react";
import { observable, action } from "mobx";
import { inject, observer } from "mobx-react";
import {
	DefaultButton,
	PrimaryButton,
} from "office-ui-fabric-react/lib/Button";
import { IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
import {
	ITrimConnector,
	IRecordType,
	ISearchResults,
	IDatabase,
	ITrimMainObject,
	ICheckinPlace,
} from "../trim-coms/trim-connector";
import { BaseObjectTypes } from "../trim-coms/trim-baseobjecttypes";
import PropertySheet from "./PropertySheet";
import { IOfficeConnector } from "src/office-coms/office-connector";
//import { ResponsiveMode } from "office-ui-fabric-react/lib/utilities/decorators/withResponsiveMode";
import { ComboBox, IComboBoxOption, IComboBox } from "office-ui-fabric-react";

interface INewRecordState {
	formDefinition: any;
	processing: Boolean;
	checkinStyles: IDropdownOption[];
	checkinUsingStyle: Boolean;
}

interface INewRecordProps {
	appStore?: any;
	trimConnector?: ITrimConnector;
	wordConnector?: IOfficeConnector;
	className?: string;
	trimType: BaseObjectTypes;
	onTrimObjectCreated?: (newObject?: ITrimMainObject) => void;
	folderId?: string;
	isLinkedFolder?: Boolean;
	validateRecordType?: (recordTypeUri: number) => Promise<Boolean>;
	computedCheckinStyleName?: string;
}

export class NewRecord extends React.Component<
	INewRecordProps,
	INewRecordState
> {
	constructor(props: INewRecordProps) {
		super(props);

		this.state = {
			formDefinition: {},
			processing: false,
			checkinStyles: [],
			checkinUsingStyle: false,
		};
	}

	@observable recordTypes: IDropdownOption[] = [];
	recordTypeUri: number = 0;
	recordProps: any = {};
	recordFields: any = {};

	@action.bound
	setRecordTypes(recTypes: IDropdownOption[]) {
		this.recordTypes = recTypes;
		this.recordTypeUri = 0;
	}

	setPropertySheet() {
		const { trimConnector, appStore, trimType } = this.props;
		const { checkinUsingStyle } = this.state;

		if (this.recordTypeUri > 0) {
			const getPropsSheet = checkinUsingStyle
				? trimConnector!.getPropertySheetFromStyle(
						this.recordTypeUri,
						appStore.documentInfo.EmailPath
				  )
				: trimConnector!.getPropertySheet(
						trimType || BaseObjectTypes.Record,
						this.recordTypeUri,
						appStore.documentInfo.EmailPath
				  );

			getPropsSheet.then((data) => {
				if (data && data.Pages && data.Pages.length > 0) {
					for (let counter = 0; counter < data.Pages.length; counter++) {
						const page = data.Pages[counter];
						for (
							let itemCounter = 0;
							itemCounter < page.PageItems.length;
							itemCounter++
						) {
							const pageItem = page.PageItems[itemCounter];
							if (pageItem.Name === "RecordTypedTitle") {
								pageItem.Value = pageItem.Value || appStore.FileName;
							}
						}
					}
				}
				this.setState({ formDefinition: data });
			});
		}
	}

	componentDidMount() {
		const { trimConnector, appStore } = this.props;

		if (trimConnector) {
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
				trimConnector.search<ITrimMainObject>({
					trimType: BaseObjectTypes.CheckinPlace,
					q: "cipType:MailForClientProcessing",
					properties: "CheckinPlaceCheckinAs,NameString",
					purpose: 0,
				}),
			];

			return Promise.all(promisesToRun).then((values) => {
				const response = values[0] as ISearchResults<IRecordType>;
				me.setRecordTypes(
					response.results.map(function(o: IRecordType) {
						return { key: o.Uri, text: o.NameString } as IDropdownOption;
					})
				);

				const placesResponse = values[1] as ISearchResults<ICheckinPlace>;
				this.setState({
					checkinStyles: placesResponse.results.map(function(o: ICheckinPlace) {
						return {
							key: o.CheckinAs.Uri,
							text: o.NameString,
						} as IDropdownOption;
					}),
				});

				if (appStore.documentInfo.Options.DefaultDocumentRecordType > 0) {
					me.recordTypeUri =
						appStore.documentInfo.Options.DefaultDocumentRecordType;
					me.setPropertySheet();
				}
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
		const { validateRecordType, appStore } = this.props;
		const { checkinUsingStyle, checkinStyles } = this.state;

		if (checkinUsingStyle) {
			this.recordTypeUri = Number(checkinStyles[index!].key);

			this.setPropertySheet();
		} else {
			const recordTypeUri = Number(this.recordTypes[index!].key);

			if (validateRecordType) {
				validateRecordType(recordTypeUri).then((isValid) => {
					if (isValid) {
						this.recordTypeUri = recordTypeUri;

						this.setPropertySheet();
					} else {
						appStore.setError(appStore.messages.web_RecordTypeRequiresForm);
					}
				});
			} else {
				this.recordTypeUri = recordTypeUri;
				this.setPropertySheet();
			}
		}
	};

	private _trimObjectCreated = () => {
		const { onTrimObjectCreated } = this.props;

		if (onTrimObjectCreated) {
			onTrimObjectCreated();
		}

		this.setState({ processing: false });
	};

	private _onClick = (event: React.MouseEvent<HTMLFormElement>) => {
		const {
			appStore,
			wordConnector,
			trimConnector,
			trimType,
			folderId,
		} = this.props;

		const { checkinUsingStyle } = this.state;

		this.setState({ processing: true });
		if (trimType === BaseObjectTypes.Record) {
			const createRec = checkinUsingStyle
				? appStore.createRecordFromStyle(
						this.recordTypeUri,
						this.recordProps,
						this.recordFields
				  )
				: appStore.createRecord(
						this.recordTypeUri,
						this.recordProps,
						this.recordFields
				  );

			createRec
				.then(() => {
					return trimConnector!.getDatabaseProperties();
				})
				.then((item: IDatabase) => {
					wordConnector!.setAutoOpen(
						true,
						appStore.documentInfo.URN,
						item.EmailSubjectPrefix
					);
					this._trimObjectCreated();
				})
				.catch(() => {
					this.setState({ processing: false });
				});
		} else {
			const props = {
				CheckinStyleRecordType: this.recordTypeUri,
				...this.recordProps,
			};

			trimConnector!
				.registerInTrim(trimType, props, this.recordFields)
				.then((trimObject: ITrimMainObject) => {
					const placeBody = folderId
						? {
								CheckinPlacePlaceId: folderId,
								CheckinPlaceCheckinAs: trimObject.Uri,
								CheckinPlacePlaceType: "MailForServerProcessing",
						  }
						: {
								CheckinPlaceCheckinAs: trimObject.Uri,
								CheckinPlacePlaceType: "MailForClientProcessing",
						  };

					trimConnector!
						.registerInTrim(BaseObjectTypes.CheckinPlace, placeBody, {})
						.then((trimObject) => {
							this._trimObjectCreated();
						})
						.catch((e) => {
							this.setState({ processing: false });
							appStore.setError(e);
						});
				})
				.catch((e) => {
					this.setState({ processing: false });
					appStore.setError(e);
				});
		}
		event.preventDefault();
	};

	private _onPropertySheetChange = (newProps: any, newFields: any) => {
		this.recordProps = { ...newProps };
		this.recordFields = { ...newFields };
	};

	public render() {
		const {
			trimConnector,
			appStore,
			className,
			trimType,
			folderId,
			computedCheckinStyleName,
			isLinkedFolder,
		} = this.props;

		const {
			formDefinition,
			processing,
			checkinStyles,
			checkinUsingStyle,
		} = this.state;

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

		return (
			<form
				className={className + (processing === true ? " disabled" : "")}
				onSubmit={this._onClick}
			>
				{checkinUsingStyle ? (
					<ComboBox
						useComboBoxAsMenuWidth={true}
						options={checkinStyles}
						placeholder={appStore.messages.web_SelectCheckinStyle}
						onChange={this._onChange}
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
				) : (
					<ComboBox
						disabled={
							trimType === BaseObjectTypes.CheckinStyle &&
							!folderId &&
							isLinkedFolder === true
						}
						useComboBoxAsMenuWidth={true}
						options={this.recordTypes}
						placeholder={appStore.messages.web_SelectRecordType}
						onChange={this._onChange}
						defaultSelectedKey={
							appStore.documentInfo.Options.DefaultDocumentRecordType
						}
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
				)}
				<div className={`new-record-body new-record-body-${trimType}`}>
					<PropertySheet
						formDefinition={formDefinition}
						onChange={this._onPropertySheetChange}
						computedProperties={computedProps}
					/>
					{formDefinition.Pages && (
						<PrimaryButton className="trim-register" type="submit">
							{appStore.messages.web_Register}
						</PrimaryButton>
					)}
				</div>
			</form>
		);
	}
}

export default inject(
	"appStore",
	"trimConnector",
	"wordConnector"
)(observer(NewRecord));
