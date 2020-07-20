import * as React from "react";
import "./TrimSearchDialog.css";
import {
	ITrimSearchDialogProps,
	ITrimSearchDialog,
} from "./TrimSearchDialog.types";
import { FocusTrapZone } from "office-ui-fabric-react/lib/FocusTrapZone";
import TrimObjectSearchList from "../TrimObjectSearchList/TrimObjectSearchList";
import { createRef } from "office-ui-fabric-react/lib/Utilities";
import { ITrimObjectSearchList } from "../TrimObjectSearchList/TrimObjectSearchList.types";
import { ITrimMainObject } from "src/trim-coms/trim-connector";
import {
	PrimaryButton,
	DefaultButton,
} from "office-ui-fabric-react/lib/Button";
import { inject } from "mobx-react";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";
import { debounce } from "throttle-debounce";
import SearchBar from "../SearchBar/SearchBar";
import {
	Checkbox,
	Stack,
	DialogType,
	Dialog,
	DialogFooter,
	IDialogContentProps,
} from "office-ui-fabric-react";

export interface ITrimSearchDialogState {
	isObjectPickerShown?: boolean;
	selectedItems: ITrimMainObject[];
	searchStartPoint: string;
	includeAlternateWhenShowingFolderContents: boolean;
	textFieldText: string;
	contentsInReverseDateOrder: boolean;
	advancedSearch: boolean;
	textSearchHelp: string;
	advancedSearchHelp: string;
	isRunning: boolean;
	navTrimType: BaseObjectTypes;
	applyFilterSearch: boolean;
	urlToOpen: string;
}

export class TrimSearchDialog
	extends React.Component<ITrimSearchDialogProps, ITrimSearchDialogState>
	implements ITrimSearchDialog {
	autocompleteSearchDebounced: any;

	private _searchList = createRef<ITrimObjectSearchList>();

	constructor(props: ITrimSearchDialogProps) {
		super(props);
		this.state = this._getDefaultState();

		this.autocompleteSearchDebounced = debounce(500, this.__textChanged);
	}

	componentDidMount() {
		const { trimConnector, trimType, startPoint } = this.props;
		const startSearches = {
			Containers: "recMyContainers",
			FavRecords: "unkFavorite",
			Favorites: "unkFavorite",
			All: "unkAll",
			ContentBlocks: "recMyContent",
			Templates: "recMyTemplates",
			DueOrIn: "recDueOrInTray",
			In: "recInTray",
			Due: "recDueTray",
			Search: "unkFavorite",
			Offline: "unkFavorite",
			RecentDocs: "recMyDocuments",
			ClassBrowser: "unkFavorite",
			Worktray: "recWorkTray",
			Top: "unkTop",
		};

		trimConnector!.getMessages().then((messages) => {
			this.setState({
				textSearchHelp: messages.web_GoToTextSearch,
				advancedSearchHelp: messages.web_GoToAdvancedSearch,
			});
		});

		trimConnector!.getSearchOptions().then((data) => {
			let key =
				{
					[BaseObjectTypes.Record]: data.StartPointRecordDefault,
					[BaseObjectTypes.Location]: data.StartPointForLocations,
					[BaseObjectTypes.LookupItem]: "Top",
				}[trimType] || data.StartPointDefault;

			const startSearch = startSearches[startPoint || key] || "unkFavorite";

			this.setState({
				searchStartPoint: startSearch,
				includeAlternateWhenShowingFolderContents:
					data.IncludeAlternateWhenShowingFolderContents,
				contentsInReverseDateOrder: data.ContentsInReverseDateOrder,
			});
		});
	}

	public render(): JSX.Element {
		const {
			trimType,
			purpose,
			purposeExtra,
			filter,
			appStore,
			filterSearch,
		} = this.props;
		const {
			isRunning,
			searchStartPoint,
			textFieldText,
			contentsInReverseDateOrder,
			includeAlternateWhenShowingFolderContents,
			navTrimType,
			applyFilterSearch,
			urlToOpen,
		} = this.state;

		const startSearchAt = textFieldText || searchStartPoint;

		const myFilterSearch = applyFilterSearch === true ? filterSearch : "";
		const dialogStyles = { main: { maxWidth: 450 } };
		const modalProps = {
			isBlocking: false,
			styles: dialogStyles,
		};

		const dialogContentProps: IDialogContentProps = {
			type: DialogType.normal,
			title: appStore!.messages.web_openDocument,
			closeButtonAriaLabel: appStore!.messages.web_cancel,
			subText: appStore!.messages.web_openDocumentBody,
			styles: { subText: { fontSize: "14px" } },
		};

		return (
			<div className="dialog-top">
				<React.Fragment>
					<SearchBar
						trimType={navTrimType}
						onQueryChange={this.changeQuery}
						includeShortCuts={false}
						wideDisplay={true}
					/>
					<div className="trim-list-clear-float" />
					{startSearchAt && (
						<FocusTrapZone
							isClickableOutsideFocusTrap={true}
							className="dialog-list"
							data-is-scrollable="true"
						>
							<TrimObjectSearchList
								componentRef={this._searchList}
								trimType={trimType}
								onTrimObjectSelected={this._trimObjectSelected}
								q={startSearchAt}
								purpose={purpose}
								purposeExtra={purposeExtra}
								filter={filter}
								filterSearch={myFilterSearch}
								includeAlternateWhenShowingFolderContents={
									includeAlternateWhenShowingFolderContents
								}
								contentsInReverseDateOrder={contentsInReverseDateOrder}
								advancedSearch={true}
								dialogDisplay={true}
								onTrimTypeChanged={(newTrimType) => {
									this.setState({ navTrimType: newTrimType });
								}}
								autoSelectFirst={true}
							/>
							<Dialog
								hidden={!urlToOpen}
								onDismiss={() => {
									this.setState({ urlToOpen: "" });
								}}
								dialogContentProps={dialogContentProps}
								modalProps={modalProps}
							>
								<DialogFooter>
									<DefaultButton
										onClick={() => {
											this.setState({ urlToOpen: "" });
										}}
										text={appStore!.messages.web_cancel}
									/>
									<PrimaryButton
										onClick={() => {
											const myUrl = urlToOpen;
											this.setState({ urlToOpen: "" }, function () {
												window.open(myUrl, "_blank");
												Office.context.ui.messageParent("0");
											});
										}}
										text={appStore!.messages.web_open}
									/>
								</DialogFooter>
							</Dialog>
						</FocusTrapZone>
					)}
				</React.Fragment>

				<div className="dialog-footer">
					<Stack horizontal>
						{filterSearch &&
						!isRunning &&
						appStore!.messages.web_ApplySearchFilter ? (
							<Checkbox
								label={appStore!.messages.web_ApplySearchFilter}
								defaultChecked={true}
								onChange={(
									ev: React.FormEvent<HTMLElement>,
									isChecked: boolean
								) => {
									this._onApplyFilterChange(ev, isChecked);
								}}
							/>
						) : (
							<div className="ms-Checkbox"></div>
						)}
						<DefaultButton
							data-automation-id="cancel"
							allowDisabledFocus={true}
							disabled={!startSearchAt}
							text={appStore!.messages.web_cancel}
							onClick={() => {
								Office.context.ui.messageParent("0");
							}}
						/>

						<PrimaryButton
							data-automation-id="ok"
							disabled={!startSearchAt}
							text={appStore!.messages.web_ok}
							onClick={this._onOk}
							allowDisabledFocus={true}
						/>
					</Stack>
				</div>
			</div>
		);
	}

	private _onOk = () => {
		const { selectedItems } = this.state;
		const { trimConnector, insertText, appStore } = this.props;

		this.setState({ isRunning: true });

		if (selectedItems.length > 0) {
			const fn = insertText ? "getRecordAsText" : "getDriveUrl";
			appStore!.setSpinning(true);
			trimConnector!
				[fn](selectedItems[0].Uri)
				.then((response: string) => {
					if (insertText) {
						Office.context.ui.messageParent(response);
					} else {
						appStore!.setSpinning(false);
						const obj = JSON.parse(response);

						if (
							obj.UserHasAccess === true &&
							Office.context.diagnostics.platform !== Office.PlatformType.PC
						) {
							let url = obj.WebUrl;
							this.setState({ urlToOpen: url });
						} else {
							Office.context.ui.messageParent(response);
						}
					}
				})
				.catch((error) => {
					appStore!.setError(error);
					this.setState({ isRunning: false });
				});
		} else {
			Office.context.ui.messageParent("0");
		}
	};

	private _trimObjectSelected = (
		trimObject: ITrimMainObject,
		isDoubleClick: boolean
	): void => {
		this.setState({
			selectedItems: [trimObject],
		});

		if (isDoubleClick) {
			this._onOk();
		}
	};

	private changeQuery = (newText: string): void => {
		this.autocompleteSearchDebounced(newText);
	};

	private __textChanged = (newText: string): void => {
		this.setState({ textFieldText: newText });
		if (!this.state.isObjectPickerShown && newText.length > 2) {
			this._onTextFieldClick();
		}
	};

	private _onTextFieldClick = (): void => {};

	private _getDefaultState(): ITrimSearchDialogState {
		const { value, trimType } = this.props;

		return {
			isRunning: false,
			isObjectPickerShown: false,
			selectedItems: value || [],
			searchStartPoint: "",
			includeAlternateWhenShowingFolderContents: false,
			textFieldText: "",
			contentsInReverseDateOrder: false,
			advancedSearch: false,
			textSearchHelp: "",
			advancedSearchHelp: "",
			navTrimType: trimType,
			applyFilterSearch: true,
			urlToOpen: "",
		};
	}

	private _onApplyFilterChange(
		ev: React.FormEvent<HTMLElement>,
		isChecked: boolean
	): void {
		this.setState({ applyFilterSearch: isChecked });
	}
}

export default inject("appStore", "trimConnector")(TrimSearchDialog);
