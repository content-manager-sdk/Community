import { IBaseProps } from "office-ui-fabric-react/lib/Utilities";
import { ITrimConnector } from "../../trim-coms/trim-connector";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";

export interface ITrimObjectPicker {
	/** Reset the state of the picker to the default */
	reset(): void;
}

export interface ITrimObjectPickerProps
	extends IBaseProps<ITrimObjectPicker>,
		React.HTMLAttributes<HTMLElement> {
	/**
	 * Label for the TrimObjectPicker
	 */
	label?: string;

	trimConnector?: ITrimConnector;

	/**
	 * Disabled state of the ObjectPicker.
	 * @defaultvalue false
	 */
	disabled?: boolean;

	trimType: BaseObjectTypes;
}
