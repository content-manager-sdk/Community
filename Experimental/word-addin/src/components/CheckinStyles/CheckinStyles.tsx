import * as React from "react";
import { inject, observer } from "mobx-react";

import ErrorDisplay from "../ErrorDisplay";
import { IAppStore } from "../../stores/AppStoreBase";
import ContextList from "../ContextList/ContextList";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";
import { ITrimConnector } from "../../trim-coms/trim-connector";
import NewRecord from "../NewRecord";
import OutlookFolderPicker from "../OutlookFolderPicker/OutlookFolderPicker";
import { mergeStyles } from "@uifabric/styling";
import { OutlookConnector } from "../../office-coms/OutlookConnector";
import ViewTrimObject from "../ViewTrimObject/ViewTrimObject";
import EditTrimObject from "../EditTrimObject/EditTrimObject";

interface ICheckinStylesProps {
	appStore?: IAppStore;
	trimConnector?: ITrimConnector;
	forServerProcessing: boolean;
}

interface ICheckinStylesState {
	view: string;
	folderId: string;
	folderName: string;
	editUri: number;
}

export class CheckinStyles extends React.Component<
	ICheckinStylesProps,
	ICheckinStylesState
> {
	constructor(props: ICheckinStylesProps) {
		super(props);

		this.state = {
			view: "List",
			folderId: "",
			folderName: "",
			editUri: 0,
		};
	}

	private getStyles(): string {
		return mergeStyles({
			selectors: {
				"& .ms-ComboBox": {
					marginBottom: "8px",
				},
			},
		});
	}

	public render() {
		const { appStore, forServerProcessing } = this.props;
		const { view, folderId, folderName, editUri } = this.state;

		return (
			<div>
				{appStore!.status === "ERROR" && <ErrorDisplay />}
				{(() => {
					switch (view) {
						case "Edit":
							return (
								<EditTrimObject
									trimType={BaseObjectTypes.CheckinStyle}
									recordUri={editUri}
									onSave={() => {
										this.setState({ view: "Properties" });
									}}
									onClose={() => {
										this.setState({ view: "List" });
									}}
								/>
							);
						case "Properties":
							return (
								<ViewTrimObject
									recordUri={editUri}
									trimType={BaseObjectTypes.CheckinStyle}
									onEdit={() => {
										this.setState({ view: "Edit" });
									}}
									onClose={() => {
										this.setState({ view: "List" });
									}}
								/>
							);
						case "New":
							return (
								<React.Fragment>
									{forServerProcessing && (
										<OutlookFolderPicker
											className={this.getStyles()}
											onChange={(folderId, folderName) => {
												this.setState({ folderId, folderName });
											}}
										/>
									)}
									<NewRecord
										trimType={BaseObjectTypes.CheckinStyle}
										folderId={folderId}
										isLinkedFolder={forServerProcessing}
										computedCheckinStyleName={folderName}
										onClose={() => {
											this.setState({ view: "List" });
										}}
										onAfterSave={(trimObject) => {
											if (trimObject) {
												if (forServerProcessing && folderId !== "cm_auto") {
													const connector = new OutlookConnector();
													connector
														.getFolderChangeKey(folderId)
														.then((changeKey) => {
															connector.setUrnOnFolder(
																folderId,
																changeKey,
																trimObject!.URN!
															);
															this.setState({ view: "List" });
														})
														.catch((e) => {
															appStore!.setError(e);
														});
												} else {
													this.setState({ view: "List" });
												}
											}
										}}
										validateRecordType={(recordTypeUri) => {
											const { trimConnector } = this.props;
											return new Promise<Boolean>(function (resolve) {
												if (!forServerProcessing) {
													resolve(true);
												} else {
													trimConnector!
														.isDataEntryFormNeeded(recordTypeUri)
														.then(function (isValid) {
															resolve(!isValid);
														});
												}
											});
										}}
									/>
								</React.Fragment>
							);
						default:
							return (
								<ContextList
									trimType={BaseObjectTypes.CheckinPlace}
									hideSearchBar={true}
									searchString={
										forServerProcessing
											? "cipType:MailForServerProcessing"
											: "cipType:MailForClientProcessing"
									}
									pageTitle={
										forServerProcessing === true
											? appStore!.messages.web_LinkedFolders
											: appStore!.messages.web_CheckinStyles
									}
									newCaption={
										forServerProcessing === true
											? appStore!.messages.web_NewLinkedFolder
											: appStore!.messages.web_NewCheckinStyle
									}
									onCommand={(key: string, uri: number) => {
										this.setState({ view: key, editUri: uri });
									}}
								/>
							);
					}
				})()}
			</div>
		);
	}
}

export default inject("appStore", "trimConnector")(observer(CheckinStyles));
