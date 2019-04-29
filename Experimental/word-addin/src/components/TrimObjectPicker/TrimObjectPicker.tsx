import * as React from "react";
import "./TrimObjectPicker.css";
import {
	ITrimObjectPickerProps,
	ITrimObjectPicker,
} from "./TrimObjectPicker.types";
import {
	TextField,
	ITextField,
	ITextFieldProps,
} from "office-ui-fabric-react/lib/TextField";
import { Callout, DirectionalHint } from "office-ui-fabric-react/lib/Callout";
import { FocusTrapZone } from "office-ui-fabric-react/lib/FocusTrapZone";
import TrimObjectSearchList from "../TrimObjectSearchList/TrimObjectSearchList";
import { createRef } from "office-ui-fabric-react/lib/Utilities";
import { ITrimObjectSearchList } from "../TrimObjectSearchList/TrimObjectSearchList.types";
import { ITrimMainObject } from "src/trim-coms/trim-connector";
import { IconButton } from "office-ui-fabric-react/lib/Button";
import { IconType } from "office-ui-fabric-react/lib/Icon";
import { inject } from "mobx-react";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";
import { debounce } from "throttle-debounce";

export interface IObjectPickerState {
	isObjectPickerShown?: boolean;
	selectedItems: ITrimMainObject[];
	searchStartPoint: string;
	includeAlternateWhenShowingFolderContents: boolean;
	textFieldText: string;
	contentsInReverseDateOrder: boolean;
	advancedSearch: boolean;
}

export class TrimObjectPicker
	extends React.Component<ITrimObjectPickerProps, IObjectPickerState>
	implements ITrimObjectPicker {
	autocompleteSearchDebounced: any;
	public reset(): void {
		throw new Error("Method not implemented.");
	}

	private _objectPickerDiv = createRef<HTMLDivElement>();
	private _searchList = createRef<ITrimObjectSearchList>();
	private _textField = createRef<ITextField>();

	constructor(props: ITrimObjectPickerProps) {
		super(props);
		this.state = this._getDefaultState();

		this.autocompleteSearchDebounced = debounce(500, this.__textChanged);
	}

	componentDidMount() {
		const { trimConnector, trimType, propertyName } = this.props;
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
		trimConnector!.getSearchOptions().then((data) => {
			let key =
				{
					[BaseObjectTypes.Record]: data.StartPointRecordDefault,
					[BaseObjectTypes.Location]: data.StartPointForLocations,
					[BaseObjectTypes.LookupItem]: "Top",
				}[trimType] || data.StartPointDefault;

			if (propertyName === "RecordContainer") {
				key = data.StartPointForContainers;
			}

			const startSearch = startSearches[key] || "unkFavorite";

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
			label,
			disabled,
			trimType,
			purpose,
			purposeExtra,
			filter,
		} = this.props;
		const {
			isObjectPickerShown,
			searchStartPoint,
			textFieldText,
			advancedSearch,
			contentsInReverseDateOrder,
			includeAlternateWhenShowingFolderContents,
		} = this.state;

		const startSearchAt = textFieldText || searchStartPoint;

		return (
			<div>
				<div ref={this._objectPickerDiv} role="combobox">
					<TextField
						label={label}
						disabled={disabled}
						iconProps={{
							iconName: "Search",
							onClick: this._onIconClick,
							className: "trim-ObjectPicker-event--without-label",
						}}
						componentRef={this._textField}
						className="trim-object-picker"
						onRenderPrefix={this._renderPrefix}
						onChange={this.changeQuery}
						value={textFieldText}
					/>
				</div>

				{isObjectPickerShown && startSearchAt && (
					<Callout
						id="Trim-ObjectPicker-Callout"
						role="dialog"
						isBeakVisible={false}
						gapSpace={0}
						doNotLayer={false}
						target={this._objectPickerDiv.current}
						directionalHint={DirectionalHint.bottomLeftEdge}
						onDismiss={this._objectPickerDismissed}
						className="ms-DatePicker-callout"
						calloutWidth={
							this._objectPickerDiv.current
								? this._objectPickerDiv.current.clientWidth
								: 0
						}
					>
						{
							<FocusTrapZone isClickableOutsideFocusTrap={true}>
								<TrimObjectSearchList
									componentRef={this._searchList}
									onDismiss={this._listDismissed}
									trimType={trimType}
									onTrimObjectSelected={this._trimObjectSelected}
									q={startSearchAt}
									purpose={purpose}
									purposeExtra={purposeExtra}
									filter={filter}
									includeAlternateWhenShowingFolderContents={
										includeAlternateWhenShowingFolderContents
									}
									contentsInReverseDateOrder={contentsInReverseDateOrder}
									advancedSearch={advancedSearch}
								/>
							</FocusTrapZone>
						}
					</Callout>
				)}
			</div>
		);
	}

	private _trimObjectSelected = (trimObject: ITrimMainObject): void => {
		const { onTrimObjectSelected } = this.props;
		this.setState({
			selectedItems: [trimObject],
			textFieldText: "",
		});

		this._dismissObjectPickerPopup();

		if (onTrimObjectSelected) {
			onTrimObjectSelected(trimObject);
		}
	};

	/**
	 * Callback for closing the calendar callout
	 */
	private _objectPickerDismissed = (): void => {
		//  this._preventFocusOpeningPicker = true;
		this._dismissObjectPickerPopup();
		// don't need to focus the text box, if necessary the focusTrapZone will do it
	};

	private _dismissObjectPickerPopup = (): void => {
		if (this.state.isObjectPickerShown) {
			this.setState({
				isObjectPickerShown: false,
			});

			//   this._validateTextInput();
		}
	};

	/**
	 * Callback for closing the search callout
	 */
	private _listDismissed = (): void => {
		//   this._preventFocusOpeningPicker = true;
		this._dismissObjectPickerPopup();
		// don't need to focus the text box, if necessary the focusTrapZone will do it
	};

	private changeQuery = (
		ev: React.FormEvent<HTMLInputElement>,
		newText: string
	): void => {
		this.autocompleteSearchDebounced(newText);
	};

	private __textChanged = (newText: string): void => {
		this.setState({ textFieldText: newText });
		if (!this.state.isObjectPickerShown && newText.length > 2) {
			this._onTextFieldClick();
		}
	};

	private _onIconClick = (ev: React.MouseEvent<HTMLElement>): void => {
		ev.stopPropagation();
		this._onTextFieldClick();
	};

	private _renderPrefix = (
		props?: ITextFieldProps,
		defaultRender?: (props?: ITextFieldProps) => JSX.Element | null
	): JSX.Element => {
		const { advancedSearch } = this.state;
		return (
			<React.Fragment>
				<IconButton
					onClick={this._doAdvancedSearch}
					className="trim-advanced-search"
					iconProps={{
						iconType: IconType.image,
						imageProps: {
							src: `/assets/${
								advancedSearch ? "dbp_searchmethod" : "spanner"
							}_x24.png`,
						},
					}}
				/>
				<div className="trim-object-pills">
					{this.state.selectedItems.map((selectedItem) => {
						return (
							<div className="trim-pill-container" key={selectedItem.Uri}>
								<div className="trim-pill-content">
									{selectedItem.NameString}
								</div>
								<IconButton
									className="ms-fontSize-sPlus remove-item"
									iconProps={{ iconName: "Cancel" }}
									onClick={this._removeSelectedItem}
								/>
							</div>
						);
					})}
				</div>
			</React.Fragment>
		);
	};

	private _doAdvancedSearch = () => {
		const { advancedSearch } = this.state;
		this.setState({ advancedSearch: !advancedSearch });
	};
	private _removeSelectedItem = () => {
		this.setState({
			selectedItems: [],
		});
	};

	private _onTextFieldClick = (): void => {
		if (!this.state.isObjectPickerShown && !this.props.disabled) {
			this._showObjectPickerPopup();
		} else {
			// if (this.props.allowTextInput) {
			this.setState({
				isObjectPickerShown: false,
			});
			//  }
		}
	};

	private _showObjectPickerPopup(): void {
		if (!this.state.isObjectPickerShown) {
			this.setState({
				isObjectPickerShown: true,
				//	errorMessage: ''
			});
		}
	}

	private _getDefaultState(): IObjectPickerState {
		const { value } = this.props;

		return {
			isObjectPickerShown: false,
			selectedItems: value || [],
			searchStartPoint: "",
			includeAlternateWhenShowingFolderContents: false,
			textFieldText: "",
			contentsInReverseDateOrder: false,
			advancedSearch: false,
		};
	}
}

export default inject("trimConnector")(TrimObjectPicker);
