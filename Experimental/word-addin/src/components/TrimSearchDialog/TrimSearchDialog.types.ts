import { IBaseProps } from "office-ui-fabric-react/lib/Utilities";
import {
	ITrimConnector,
	ITrimMainObject,
} from "../../trim-coms/trim-connector";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";
import { IAppStore } from "../../stores/AppStore";

export interface ITrimSearchDialog {}

export interface ITrimSearchDialogProps
	extends IBaseProps<ITrimSearchDialog>,
		React.HTMLAttributes<HTMLElement> {
	trimConnector?: ITrimConnector;
	appStore?: IAppStore;

	trimType: BaseObjectTypes;

	purpose?: number;
	purposeExtra?: number;
	filter?: string;
	filterSearch?: string;
	value?: ITrimMainObject[];
	startPoint?: string;
	insertText?: boolean;

	/** Callback for when a given trim object has been selected */
	onTrimObjectSelected?: (item?: ITrimMainObject) => void;
}
