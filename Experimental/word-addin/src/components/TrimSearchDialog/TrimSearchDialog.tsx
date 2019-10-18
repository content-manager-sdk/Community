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
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import SearchBar from "../SearchBar/SearchBar";
import { Checkbox, Stack } from "office-ui-fabric-react";

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
		//	}
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
		} = this.state;

		const startSearchAt = textFieldText || searchStartPoint;

		const myFilterSearch = applyFilterSearch === true ? filterSearch : "";

		return (
			<div className="dialog-top">
				{isRunning === true ? (
					<Spinner size={SpinnerSize.large} />
				) : (
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
								/>
							</FocusTrapZone>
						)}
					</React.Fragment>
				)}
				<div className="dialog-footer">
					<Stack horizontal>
						{filterSearch && !isRunning ? (
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
							text="Cancel"
							onClick={() => {
								Office.context.ui.messageParent("0");
							}}
						/>

						<PrimaryButton
							data-automation-id="ok"
							disabled={!startSearchAt}
							text="OK"
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

			trimConnector!
				[fn](selectedItems[0].Uri)
				.then((response: string) => {
					Office.context.ui.messageParent(response);
				})
				// .finally(() => {
				// 	this.setState({ isRunning: false });
				// })
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
		//const { onTrimObjectSelected } = this.props;
		this.setState({
			selectedItems: [trimObject],
			// 	textFieldText: "",
		});

		if (isDoubleClick) {
			this._onOk();
		}
		// if (onTrimObjectSelected) {
		// 	onTrimObjectSelected(trimObject);
		// }
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
		};
	}

	private _onApplyFilterChange(
		ev: React.FormEvent<HTMLElement>,
		isChecked: boolean
	): void {
		console.log("555555555555");
		this.setState({ applyFilterSearch: isChecked });
	}
}

export default inject("appStore", "trimConnector")(TrimSearchDialog);
