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
import { inject } from "mobx-react";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";

export interface IObjectPickerState {
	isObjectPickerShown?: boolean;
	selectedItems: ITrimMainObject[];
	searchStartPoint: string;
	includeAlternateWhenShowingFolderContents: boolean;
}

export class TrimObjectPicker
	extends React.Component<ITrimObjectPickerProps, IObjectPickerState>
	implements ITrimObjectPicker {
	public reset(): void {
		throw new Error("Method not implemented.");
	}

	private _objectPickerDiv = createRef<HTMLDivElement>();
	private _searchList = createRef<ITrimObjectSearchList>();
	private _textField = createRef<ITextField>();

	constructor(props: ITrimObjectPickerProps) {
		super(props);
		this.state = this._getDefaultState();
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
		};
		trimConnector!.getSearchOptions().then((data) => {
			let key =
				{
					[BaseObjectTypes.Record]: data.StartPointRecordDefault,
					[BaseObjectTypes.Location]: data.StartPointForLocations,
				}[trimType] || data.StartPointDefault;

			if (propertyName === "RecordContainer") {
				key = data.StartPointForContainers;
			}

			const startSearch = startSearches[key] || "unkFavorite";
			this.setState({
				searchStartPoint: startSearch,
				includeAlternateWhenShowingFolderContents:
					data.IncludeAlternateWhenShowingFolderContents,
			});
		});
		//	}
	}

	public render(): JSX.Element {
		const { label, disabled, trimType, purpose, purposeExtra } = this.props;
		const { isObjectPickerShown, searchStartPoint } = this.state;

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
					/>
				</div>

				{isObjectPickerShown && searchStartPoint && (
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
									q={this.state.searchStartPoint}
									purpose={purpose}
									purposeExtra={purposeExtra}
									includeAlternateWhenShowingFolderContents={
										this.state.includeAlternateWhenShowingFolderContents
									}
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

	private _onIconClick = (ev: React.MouseEvent<HTMLElement>): void => {
		ev.stopPropagation();
		this._onTextFieldClick(ev);
	};

	private _renderPrefix = (
		props?: ITextFieldProps,
		defaultRender?: (props?: ITextFieldProps) => JSX.Element | null
	): JSX.Element => {
		return (
			<div className="trim-object-pills">
				{this.state.selectedItems.map((selectedItem) => {
					return (
						<div className="trim-pill-container" key={selectedItem.Uri}>
							<div className="trim-pill-content">{selectedItem.NameString}</div>
							<IconButton
								className="ms-fontSize-sPlus"
								iconProps={{ iconName: "Cancel" }}
								onClick={this._removeSelectedItem}
							/>
						</div>
					);
				})}
			</div>
		);
	};

	private _removeSelectedItem = () => {
		this.setState({
			selectedItems: [],
		});
	};

	private _onTextFieldClick = (ev: React.MouseEvent<HTMLElement>): void => {
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
			//  this._preventFocusOpeningPicker = true;
			this.setState({
				isObjectPickerShown: true,
				//	errorMessage: ''
			});
		}
	}

	private _getDefaultState(
		props: ITrimObjectPickerProps = this.props
	): IObjectPickerState {
		return {
			isObjectPickerShown: false,
			selectedItems: [],
			searchStartPoint: "",
			includeAlternateWhenShowingFolderContents: false,
		};
	}
}

export default inject("trimConnector")(TrimObjectPicker);
