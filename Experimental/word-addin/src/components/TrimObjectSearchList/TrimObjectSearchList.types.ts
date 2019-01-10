import { IBaseProps } from "office-ui-fabric-react/lib/Utilities";
import {
	ITrimConnector,
	ITrimMainObject,
} from "../../trim-coms/trim-connector";
import BaseObjectTypes from "src/trim-coms/trim-baseobjecttypes";

export interface ITrimObjectSearchList {
	/** Reset the state of the picker to the default */
	reset(): void;
}

export interface ITrimObjectSearchListProps
	extends IBaseProps<ITrimObjectSearchList>,
		React.HTMLAttributes<HTMLElement> {
	/**
	 * TRIM search query
	 */
	q?: string;

	trimType?: BaseObjectTypes;

	purpose?: number;
	purposeExtra?: number;

	trimConnector?: ITrimConnector;

	/**
	 * Callback issued when search is closed
	 */
	onDismiss?: () => void;

	/** Callback for when a given trim object has been selected */
	onTrimObjectSelected?: (item?: ITrimMainObject) => void;
}
