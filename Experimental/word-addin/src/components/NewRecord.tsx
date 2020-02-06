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

import { Spinner, SpinnerSize } from "office-ui-fabric-react";
import RecordTypePicker from "./RecordTypePicker/RecordTypePicker";

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
	onBeforeSave?: () => void;
	onAfterSave?: () => void;
	folderId?: string;
	isLinkedFolder?: Boolean;
	bypassUpdateEmailSubject?: Boolean;
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

	recordTypeUri: number = 0;
	recordProps: any = {};
	recordFields: any = {};

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
				this.setState({ processing: false });
			});
		}
	}

	private _onChange = (uri: number, isCheckinStyle: boolean) => {
		const { validateRecordType, appStore } = this.props;

		this.setState({ processing: true });

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
						appStore.setError(appStore.messages.web_RecordTypeRequiresForm);
						this.setState({ processing: false });
					}
				});
			} else {
				this.recordTypeUri = recordTypeUri;
				this.setPropertySheet();
			}
		}
	};

	private saveFinished = (saved: boolean) => {
		const { onTrimObjectCreated, onAfterSave } = this.props;
		if (saved) {
			if (onTrimObjectCreated) {
				onTrimObjectCreated();
			}
		}

		this.setState({ processing: false });

		if (onAfterSave) {
			onAfterSave();
		}
	};

	private _onClick = (event: React.MouseEvent<HTMLFormElement>) => {
		const {
			appStore,
			wordConnector,
			trimConnector,
			trimType,
			folderId,
			onBeforeSave,
			bypassUpdateEmailSubject,
		} = this.props;

		if (onBeforeSave) {
			onBeforeSave();
		}

		event.preventDefault();
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
					if (!bypassUpdateEmailSubject) {
						wordConnector!.setAutoOpen(
							true,
							appStore.documentInfo.URN,
							item.EmailSubjectPrefix
						);
					}
					this.saveFinished(true);
				})
				.catch(() => {
					this.saveFinished(false);
				});
		} else {
			const props = {
				CheckinStyleRecordType: this.recordTypeUri,
				...this.recordProps,
			};

			trimConnector!
				.saveToTrim(trimType, props, this.recordFields)
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
						.saveToTrim(BaseObjectTypes.CheckinPlace, placeBody, {})
						.then((trimObject) => {
							this.saveFinished(true);
						})
						.catch((e) => {
							this.saveFinished(false);
							appStore.setError(e);
						});
				})
				.catch((e) => {
					this.saveFinished(false);
					appStore.setError(e);
				});
		}
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
		} = this.props;

		const { formDefinition, processing } = this.state;

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
				{processing && (
					<Spinner className="trim-edit-spinner" size={SpinnerSize.large} />
				)}

				<RecordTypePicker
					trimType={trimType}
					computedCheckinStyleName={computedCheckinStyleName!}
					className={className!}
					folderId={folderId!}
					isLinkedFolder={isLinkedFolder!}
					onRecordTypeSelected={this._onChange}
				/>
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
