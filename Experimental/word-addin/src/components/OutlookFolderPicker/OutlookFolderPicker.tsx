import * as React from "react";
import { ComboBox } from "office-ui-fabric-react";
import { OutlookConnector } from "../../office-coms/OutlookConnector";
import { inject } from "mobx-react";
import { IAppStore } from "src/stores/AppStoreBase";

export interface IOutlookFolderPickerState {}

export interface IFullDocumentCardProps {}

interface IOutlookFolderPickerProps {
	wordConnector?: OutlookConnector;
	appStore?: IAppStore;
	className?: string;
}

export class OutlookFolderPicker extends React.Component<
	IOutlookFolderPickerProps,
	IOutlookFolderPickerState
> {
	public render(): JSX.Element {
		const { wordConnector, appStore, className } = this.props;
		let loading = false;
		return (
			<ComboBox
				className={className}
				placeholder={appStore!.messages.web_Select_Folder}
				useComboBoxAsMenuWidth={true}
				onResolveOptions={() => {
					if (!loading) {
						loading = true;

						//const connector = new OutlookConnector();
						return wordConnector!
							.getFolders(appStore!.messages.web_Auto_Generate_Folder)
							.then(function(folders) {
								loading = false;

								return folders.map((fi) => {
									return { key: fi.id, text: fi.displayName };
								});
							});
					}
					return [];
				}}
			/>
		);
	}
}

export default inject("appStore", "wordConnector")(OutlookFolderPicker);
