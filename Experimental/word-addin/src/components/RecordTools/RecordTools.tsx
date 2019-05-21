import * as React from "react";
//import { observable, action, runInAction } from "mobx";
import { inject, observer } from "mobx-react";
//import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
//import { Dropdown, IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
import {
	ITrimConnector,
	// IRecordType,
	// ISearchResults,
} from "../../trim-coms/trim-connector";
//import { BaseObjectTypes } from "../../trim-coms/trim-baseobjecttypes";
//import PropertySheet from "./PropertySheet";
import { IWordConnector } from "src/office-coms/word-connector";

export class RecordTools extends React.Component<
	{
		appStore?: any;
		trimConnector?: ITrimConnector;
		wordConnector?: IWordConnector;
		className?: string;
	},
	any
> {
	// @observable recordTypes: IDropdownOption[] = [];
	// @observable formDefinition: any = {};
	// recordTypeUri: number = 0;
	// recordProps: any = {};

	// @action.bound
	// setRecordTypes(recTypes: IDropdownOption[]) {
	// 	this.recordTypes = recTypes;
	// 	this.recordTypeUri = 0;
	// }

	// @action.bound
	// setPropertySheet() {
	// 	if (this.recordTypeUri > 0) {
	// 		this.props
	// 			.trimConnector!.getPropertySheet(this.recordTypeUri)
	// 			.then((data) => {
	// 				runInAction(() => {
	// 					this.formDefinition = data;
	// 				});
	// 			});
	// 	}
	// }

	componentDidMount() {
		// const { trimConnector, wordConnector } = this.props;
		// this.recordProps["RecordTypedTitle"] = wordConnector!.getName();
		// let me = this;
		// return trimConnector!
		// 	.search<IRecordType>({
		// 		trimType: BaseObjectTypes.RecordType,
		// 		q: "all",
		// 		purpose: 3,
		// 	})
		// 	.then(function(response: ISearchResults<IRecordType>) {
		// 		me.setRecordTypes(
		// 			response.results.map(function(o: IRecordType) {
		// 				return { key: o.Uri, text: o.NameString } as IDropdownOption;
		// 			})
		// 		);
		// 	});
	}

	// private _onChange = (
	// 	event: React.FormEvent<HTMLDivElement>,
	// 	option: IDropdownOption,
	// 	index: number
	// ) => {
	// 	this.recordTypeUri = Number(this.recordTypes[index].key);
	// 	this.setPropertySheet();
	// };

	// private _onClick = (event: React.MouseEvent<HTMLDivElement>) => {
	// 	this.props.appStore.createRecord(this.recordTypeUri, this.recordProps);
	// };

	// private _onPropertySheetChange = (newProps: any) => {
	// 	this.recordProps = { ...this.recordProps, ...newProps };
	// };

	public render() {
		const { className } = this.props;

		return (
			<div className={className}>
				<h1>Record Tools</h1>
			</div>
		);
	}
}

export default inject("appStore", "trimConnector", "wordConnector")(
	observer(RecordTools)
);
