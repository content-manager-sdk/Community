import * as React from "react";
import { inject, observer } from "mobx-react";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
import {
	ITrimConnector,
	IDatabase,
	ITrimMainObject,
} from "../trim-coms/trim-connector";
import { BaseObjectTypes } from "../trim-coms/trim-baseobjecttypes";
import PropertySheet from "./PropertySheet";
import { IOfficeConnector } from "src/office-coms/office-connector";
import RecordTypePicker from "./RecordTypePicker/RecordTypePicker";
import { IAppStore } from "src/stores/AppStoreBase";

interface INewRecordState {
	formDefinition: any;
	processing: Boolean;
	saving: Boolean;
	checkinStyles: IDropdownOption[];
	checkinUsingStyle: Boolean;
}

interface INewRecordProps {
	appStore?: IAppStore;
	trimConnector?: ITrimConnector;
	wordConnector?: IOfficeConnector;
	className?: string;
	trimType: BaseObjectTypes;
	onTrimObjectCreated?: (newObject?: ITrimMainObject) => void;
	onAfterSave?: () => void;
	folderId?: string;
	isLinkedFolder?: Boolean;
	bypassUpdateEmailSubject?: Boolean;
	validateRecordType?: (recordTypeUri: number) => Promise<Boolean>;
	computedCheckinStyleName?: string;
	defaultRecordType?: ITrimMainObject;
	processInBackgroundIfPossible?: Boolean;
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
			saving: false,
		};
	}

	componentDidMount() {
		const { defaultRecordType, processInBackgroundIfPossible } = this.props;

		if (defaultRecordType && processInBackgroundIfPossible) {
			this._onChange(defaultRecordType.Uri, false);
		}
	}

	componentDidUpdate(prevProps: INewRecordProps, prevState: INewRecordState) {
		const { appStore } = this.props;
		const { processing, saving } = this.state;

		if (processing !== prevState.processing || saving !== prevState.saving) {
			let spinnerLabel = appStore!.FileName;

			const spinnerLabelFull = !spinnerLabel
				? undefined
				: `${appStore!.messages.web_filing} ${spinnerLabel}`;

			appStore!.setSpinning(
				processing || saving,
				saving ? spinnerLabelFull : undefined
			);
		}
	}

	recordTypeUri: number = 0;
	recordProps: any = {};
	recordFields: any = {};
	showUI: Boolean = false;

	setPropertySheet() {
		const {
			trimConnector,
			appStore,
			trimType,
			processInBackgroundIfPossible,
		} = this.props;
		const { checkinUsingStyle } = this.state;
		this.showUI = false;

		if (this.recordTypeUri > 0) {
			const getPropsSheet = checkinUsingStyle
				? trimConnector!.getPropertySheetFromStyle(
						this.recordTypeUri,
						appStore!.documentInfo.EmailPath
				  )
				: trimConnector!.getPropertySheet(
						trimType || BaseObjectTypes.Record,
						this.recordTypeUri,
						appStore!.documentInfo.EmailPath
				  );

			getPropsSheet
				.then((data) => {
					if (
						data &&
						data.DataEntryFormDefinition.Pages &&
						data.DataEntryFormDefinition.Pages.length > 0
					) {
						for (
							let counter = 0;
							counter < data.DataEntryFormDefinition.Pages.length;
							counter++
						) {
							const page = data.DataEntryFormDefinition.Pages[counter];
							for (
								let itemCounter = 0;
								itemCounter < page.PageItems.length;
								itemCounter++
							) {
								const pageItem = page.PageItems[itemCounter];
								if (pageItem.Name === "RecordTypedTitle") {
									pageItem.Value = pageItem.Value || appStore!.FileName;
								}
							}
						}
					}

					this.setState({ formDefinition: data.DataEntryFormDefinition });
					this.setState({ processing: false });

					this.showUI =
						!processInBackgroundIfPossible || data.NeedsDataEntryForm === true;
					if (!this.showUI) {
						this.recordProps = {
							DataEntryFormDefinition: data.DataEntryFormDefinition,
						};
						this.doSave();
					}
				})
				.catch((e) => {
					appStore!.setError(e);
				});
		}
	}

	private _onChange = (uri: number, isCheckinStyle: boolean) => {
		const { validateRecordType, appStore } = this.props;

		this.setState({ processing: true, checkinUsingStyle: isCheckinStyle });

		if (isCheckinStyle) {
			this.recordTypeUri = uri;

			this.setPropertySheet();
		} else {
			const recordTypeUri = uri;

			if (validateRecordType) {
				validateRecordType(recordTypeUri).then((isValid) => {
					if (isValid) {
						this.recordTypeUri = recordTypeUri;

						this.setPropertySheet();
					} else {
						appStore!.setError(appStore!.messages.web_RecordTypeRequiresForm);
						this.setState({ processing: false });
					}
				});
			} else {
				this.recordTypeUri = recordTypeUri;

				this.setPropertySheet();
			}
		}
	};

	private saveFinished = (saved: boolean, trimObject?: ITrimMainObject) => {
		const { onTrimObjectCreated, onAfterSave } = this.props;
		this.setState({ saving: false });
		if (saved) {
			if (onTrimObjectCreated) {
				onTrimObjectCreated(trimObject);
			}
		}

		if (onAfterSave) {
			onAfterSave();
		}
	};

	private doSave = () => {
		const {
			appStore,
			wordConnector,
			trimConnector,
			trimType,
			folderId,
			bypassUpdateEmailSubject,
		} = this.props;

		const { checkinUsingStyle } = this.state;
		let newTrimObject: ITrimMainObject;
		this.setState({ saving: true });
		if (trimType === BaseObjectTypes.Record) {
			const createRec = checkinUsingStyle
				? appStore!.createRecordFromStyle(
						this.recordTypeUri,
						this.recordProps,
						this.recordFields
				  )
				: appStore!.createRecord(
						this.recordTypeUri,
						this.recordProps,
						this.recordFields
				  );

			createRec
				.then((trimObject) => {
					newTrimObject = trimObject;
					if (!bypassUpdateEmailSubject) {
						return trimConnector!.getDatabaseProperties();
					} else {
						return Promise.reject("saved");
					}
				})
				.then((item: IDatabase) => {
					wordConnector!.setAutoOpen(
						true,
						appStore!.documentInfo.URN,
						item.EmailSubjectPrefix
					);

					this.saveFinished(true, newTrimObject);
				})
				.catch((value) => {
					this.saveFinished(value === "saved", newTrimObject);
				});
		} else {
			const props = {
				CheckinStyleRecordType: this.recordTypeUri,
				...this.recordProps,
			};

			if (folderId === "cm_auto") {
				props.CheckinStyleUseForServerMailCapture = true;
			}

			trimConnector!
				.saveToTrim(trimType, props, this.recordFields)
				.then((trimObject: ITrimMainObject) => {
					if (folderId === "cm_auto") {
						this.saveFinished(true, trimObject);
					} else {
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
							.saveToTrim(BaseObjectTypes.CheckinPlace, placeBody, {})
							.then((trimObject) => {
								this.saveFinished(true, trimObject);
							})
							.catch((e) => {
								this.saveFinished(false);
								appStore!.setError(e);
							});
					}
				})
				.catch((e) => {
					this.saveFinished(false);
					appStore!.setError(e);
				});
		}
	};

	private _onClick = (event: React.MouseEvent<HTMLFormElement>) => {
		event.preventDefault();
		this.doSave();
	};

	private _onPropertySheetChange = (newProps: any, newFields: any) => {
		this.recordProps = { ...newProps };
		this.recordFields = { ...newFields };
	};

	public render() {
		const {
			appStore,
			className,
			trimType,
			folderId,
			computedCheckinStyleName,
			isLinkedFolder,
			defaultRecordType,
			processInBackgroundIfPossible,
		} = this.props;

		const { formDefinition, processing, saving } = this.state;

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
				className={
					className +
					(processing === true || saving === true ? " disabled" : "")
				}
				onSubmit={this._onClick}
			>
				{(!processInBackgroundIfPossible || this.showUI === true) && (
					<RecordTypePicker
						trimType={trimType}
						computedCheckinStyleName={computedCheckinStyleName!}
						folderId={folderId!}
						isLinkedFolder={isLinkedFolder!}
						onRecordTypeSelected={this._onChange}
						includeCheckinStyles={!!appStore!.documentInfo.EmailPath}
						defaultRecordType={defaultRecordType}
					/>
				)}
				{(!processInBackgroundIfPossible || this.showUI === true) && (
					<div className={`new-record-body new-record-body-${trimType}`}>
						<PropertySheet
							formDefinition={formDefinition}
							onChange={this._onPropertySheetChange}
							computedProperties={computedProps}
						/>
						{formDefinition.Pages && (
							<PrimaryButton className="trim-register" type="submit">
								{appStore!.messages.web_Register}
							</PrimaryButton>
						)}
					</div>
				)}
			</form>
		);
	}
}

export default inject(
	"appStore",
	"trimConnector",
	"wordConnector"
)(observer(NewRecord));
