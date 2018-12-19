import * as React from "react";
import "./TrimObjectPicker.css";
import {
	ITrimObjectPickerProps,
	ITrimObjectPicker,
} from "./TrimObjectPicker.types";
import { TextField, ITextField } from "office-ui-fabric-react/lib/TextField";
import { Callout, DirectionalHint } from "office-ui-fabric-react/lib/Callout";
import { FocusTrapZone } from "office-ui-fabric-react/lib/FocusTrapZone";
import TrimObjectSearchList from "../TrimObjectSearchList/TrimObjectSearchList";
import { createRef } from "office-ui-fabric-react/lib/Utilities";
import { ITrimObjectSearchList } from "../TrimObjectSearchList/TrimObjectSearchList.types";
import { ITrimMainObject } from "src/trim-coms/trim-connector";

export interface IObjectPickerState {
	isObjectPickerShown?: boolean;
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

	public render(): JSX.Element {
		const { label, disabled, trimType } = this.props;
		const { isObjectPickerShown } = this.state;

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
					/>
				</div>

				{isObjectPickerShown && (
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
					>
						{
							<FocusTrapZone isClickableOutsideFocusTrap={true}>
								<TrimObjectSearchList
									componentRef={this._searchList}
									onDismiss={this._calendarDismissed}
									trimType={trimType}
									onTrimObjectSelected={this._trimObjectSelected}
								/>
							</FocusTrapZone>
						}
					</Callout>
				)}
			</div>
		);
	}

	private _trimObjectSelected = (trimObject: ITrimMainObject): void => {};

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
	private _calendarDismissed = (): void => {
		//   this._preventFocusOpeningPicker = true;
		this._dismissObjectPickerPopup();
		// don't need to focus the text box, if necessary the focusTrapZone will do it
	};

	private _onIconClick = (ev: React.MouseEvent<HTMLElement>): void => {
		ev.stopPropagation();
		this._onTextFieldClick(ev);
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
		};
	}
}

export default TrimObjectPicker;
