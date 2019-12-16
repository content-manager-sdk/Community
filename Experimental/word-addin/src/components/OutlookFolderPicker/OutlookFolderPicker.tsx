import * as React from "react";
import { ComboBox, IComboBoxOption } from "office-ui-fabric-react";
import { OutlookConnector } from "../../office-coms/OutlookConnector";
import { inject } from "mobx-react";
import { IAppStore } from "../../stores/AppStoreBase";

export interface IOutlookFolderPickerState {}

export interface IFullDocumentCardProps {}

interface IOutlookFolderPickerProps {
	wordConnector?: OutlookConnector;
	appStore?: IAppStore;
	className?: string;
	onChange?: (folderId: string, folderName: string) => void;
}

export class OutlookFolderPicker extends React.Component<
	IOutlookFolderPickerProps,
	IOutlookFolderPickerState
> {
	public render(): JSX.Element {
		const { appStore, className, onChange } = this.props;
		let loading = false;
		return (
			<ComboBox
				className={className}
				onChange={(evt, option: IComboBoxOption) => {
					if (onChange && option) {
						onChange(`${option.key}`, `${option.text}`);
					}
				}}
				placeholder={appStore!.messages.web_Select_Folder}
				useComboBoxAsMenuWidth={true}
				onResolveOptions={() => {
					if (!loading) {
						loading = true;

						const connector = new OutlookConnector();
						return connector
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

export default inject("appStore")(OutlookFolderPicker);
