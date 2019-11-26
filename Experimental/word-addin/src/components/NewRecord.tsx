import * as React from "react";
import { observable, action, runInAction } from "mobx";
import { inject, observer } from "mobx-react";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
import {
	ITrimConnector,
	IRecordType,
	ISearchResults,
} from "../trim-coms/trim-connector";
import { BaseObjectTypes } from "../trim-coms/trim-baseobjecttypes";
import PropertySheet from "./PropertySheet";
import { IOfficeConnector } from "src/office-coms/office-connector";

export class NewRecord extends React.Component<
	{
		appStore?: any;
		trimConnector?: ITrimConnector;
		wordConnector?: IOfficeConnector;
		className?: string;
	},
	any
> {
	@observable recordTypes: IDropdownOption[] = [];
	@observable formDefinition: any = {};
	recordTypeUri: number = 0;
	recordProps: any = {};

	@action.bound
	setRecordTypes(recTypes: IDropdownOption[]) {
		this.recordTypes = recTypes;
		this.recordTypeUri = 0;
	}

	@action.bound
	setPropertySheet() {
		const { trimConnector, appStore } = this.props;

		if (this.recordTypeUri > 0) {
			trimConnector!
				.getPropertySheet(this.recordTypeUri, appStore.documentInfo.EmailPath)
				.then((data) => {
					runInAction(() => {
						this.formDefinition = data;
					});
				});
		}
	}

	componentDidMount() {
		const { trimConnector, appStore } = this.props;
		this.recordProps["RecordTypedTitle"] = appStore.FileName;

		let me = this;
		return trimConnector!
			.search<IRecordType>({
				trimType: BaseObjectTypes.RecordType,
				q: "all",
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
		this.recordTypeUri = Number(this.recordTypes[index].key);
		this.setPropertySheet();
	};

	private _onClick = (event: React.MouseEvent<HTMLDivElement>) => {
		const { appStore, wordConnector } = this.props;

		appStore
			.createRecord(this.recordTypeUri, this.recordProps)
			.then((item: any) => {
				wordConnector!.setAutoOpen(true, appStore.documentInfo.URN);
			});
	};

	private _onPropertySheetChange = (newProps: any) => {
		this.recordProps = { ...this.recordProps, ...newProps };
	};

	public render() {
		const { appStore, className } = this.props;

		return (
			<div className={className}>
				<Dropdown
					options={this.recordTypes}
					placeholder={appStore.messages.web_SelectRecordType}
					onChange={this._onChange}
					defaultSelectedKey={
						appStore.documentInfo.Options.DefaultDocumentRecordType
					}
				/>
				<div className="new-record-body">
					<PropertySheet
						formDefinition={this.formDefinition}
						defaultRecordTitle={this.recordProps["RecordTypedTitle"]}
						onChange={this._onPropertySheetChange}
					/>
					<PrimaryButton className="trim-register" onClick={this._onClick}>
						{appStore.messages.web_Register}
					</PrimaryButton>
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
