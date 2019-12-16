import * as React from "react";
import { observable, action } from "mobx";
import { inject, observer } from "mobx-react";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
import {
	ITrimConnector,
	IRecordType,
	ISearchResults,
	IDatabase,
	ITrimMainObject,
} from "../trim-coms/trim-connector";
import { BaseObjectTypes } from "../trim-coms/trim-baseobjecttypes";
import PropertySheet from "./PropertySheet";
import { IOfficeConnector } from "src/office-coms/office-connector";
import { ResponsiveMode } from "office-ui-fabric-react/lib/utilities/decorators/withResponsiveMode";

interface INewRecordState {
	formDefinition: any;
}

interface INewRecordProps {
	appStore?: any;
	trimConnector?: ITrimConnector;
	wordConnector?: IOfficeConnector;
	className?: string;
	trimType: BaseObjectTypes;
	onTrimObjectCreated?: (newObject?: ITrimMainObject) => void;
	folderId?: string;
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

		if (this.recordTypeUri > 0) {
			trimConnector!
				.getPropertySheet(
					trimType || BaseObjectTypes.Record,
					this.recordTypeUri,
					appStore.documentInfo.EmailPath
				)
				.then((data) => {
					this.setState({ formDefinition: data });
				});
		}
	}

	componentDidMount() {
		const { trimConnector, appStore, trimType } = this.props;

		if (trimType === BaseObjectTypes.Record) {
			this.recordProps["RecordTypedTitle"] = appStore.FileName;
		}

		let me = this;
		return trimConnector!
			.search<IRecordType>({
				trimType: BaseObjectTypes.RecordType,
				q: "unkAll",
				filter: "unkUsable rtyBehaviour:1 hasElecDocSupport unkActive",
				purpose: 3,
			})
			.then(function(response: ISearchResults<IRecordType>) {
				me.setRecordTypes(
					response.results.map(function(o: IRecordType) {
						return { key: o.Uri, text: o.NameString } as IDropdownOption;
					})
				);

				if (appStore.documentInfo.Options.DefaultDocumentRecordType > 0) {
					me.recordTypeUri =
						appStore.documentInfo.Options.DefaultDocumentRecordType;
					me.setPropertySheet();
				}
			});
	}

	private _onChange = (
		event: React.FormEvent<HTMLDivElement>,
		option: IDropdownOption,
		index: number
	) => {
		const { validateRecordType, appStore } = this.props;
		const recordTypeUri = Number(this.recordTypes[index].key);

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
	};

	private _onClick = (event: React.MouseEvent<HTMLDivElement>) => {
		const {
			appStore,
			wordConnector,
			trimConnector,
			trimType,
			onTrimObjectCreated,
			folderId,
		} = this.props;

		if (trimType === BaseObjectTypes.Record) {
			appStore
				.createRecord(this.recordTypeUri, this.recordProps, this.recordFields)
				.then(() => {
					return trimConnector!.getDatabaseProperties();
				})
				.then((item: IDatabase) => {
					wordConnector!.setAutoOpen(
						true,
						appStore.documentInfo.URN,
						item.EmailSubjectPrefix
					);
					if (onTrimObjectCreated) {
						onTrimObjectCreated();
					}
				});
		} else {
			const props = {
				CheckinStyleRecordType: this.recordTypeUri,
				...this.recordProps,
			};
			trimConnector!
				.registerInTrim(trimType, props, this.recordFields)
				.then((trimObject: ITrimMainObject) => {
					if (folderId) {
						trimConnector!
							.registerInTrim(
								BaseObjectTypes.CheckinPlace,
								{
									CheckinPlacePlaceId: folderId,
									CheckinPlaceCheckinAs: trimObject.Uri,
									CheckinPlacePlaceType: "MailForServerProcessing",
								},
								{}
							)
							.then((trimObject) => {
								// 		console.log("3333333333");
								if (onTrimObjectCreated) {
									onTrimObjectCreated(trimObject);
								}
							});
					} else {
						if (onTrimObjectCreated) {
							onTrimObjectCreated(trimObject);
						}
					}
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
		} = this.props;
		const { formDefinition } = this.state;

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
			<div className={className}>
				<Dropdown
					disabled={trimType === BaseObjectTypes.CheckinStyle && !folderId}
					options={this.recordTypes}
					placeholder={appStore.messages.web_SelectRecordType}
					onChange={this._onChange}
					responsiveMode={ResponsiveMode.large}
					defaultSelectedKey={
						appStore.documentInfo.Options.DefaultDocumentRecordType
					}
				/>
				<div className={`new-record-body new-record-body-${trimType}`}>
					<PropertySheet
						formDefinition={formDefinition}
						defaultRecordTitle={this.recordProps["RecordTypedTitle"]}
						onChange={this._onPropertySheetChange}
						computedProperties={computedProps}
					/>
					{formDefinition.Pages && (
						<PrimaryButton className="trim-register" onClick={this._onClick}>
							{appStore.messages.web_Register}
						</PrimaryButton>
					)}
				</div>
			</div>
		);
	}
}

export default inject(
	"appStore",
	"trimConnector",
	"wordConnector"
)(observer(NewRecord));
