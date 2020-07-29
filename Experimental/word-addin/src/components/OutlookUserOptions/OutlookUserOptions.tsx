import * as React from "react";
import { inject, observer } from "mobx-react";
import { IAppStore } from "../../stores/AppStoreBase";
import {
	ITrimConnector,
	IRecordType,
	IOutlookUserOptions,
	ITrimMainObject,
} from "../../trim-coms/trim-connector";
import TrimObjectPicker from "../TrimObjectPicker/TrimObjectPicker";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";
import { Checkbox, PrimaryButton } from "office-ui-fabric-react";
import { CacheIds } from "../../trim-coms/cache-ids";

interface IOutlookUserOptionsProps {
	appStore?: IAppStore;
	trimConnector?: ITrimConnector;
}

interface IOutlookUserOptionsState {
	defaultRecordType?: IRecordType;
	useDefaultRecordType: boolean;
	loaded: boolean;
}

export class OutlookUserOptions extends React.Component<
	IOutlookUserOptionsProps,
	IOutlookUserOptionsState
> {
	constructor(props: IOutlookUserOptionsProps) {
		super(props);
		this.state = {
			defaultRecordType: undefined,
			useDefaultRecordType: false,
			loaded: false,
		};
	}

	componentWillMount() {
		const { appStore } = this.props;
		appStore!.setSpinning(true);
	}

	async componentDidMount() {
		const { trimConnector, appStore } = this.props;

		const options: IOutlookUserOptions = await trimConnector!.getOutlookUserOptions();

		if (options) {
			this.setState({
				defaultRecordType: options.defaultRecordType,
				useDefaultRecordType: options.useDefaultRecordType,
				loaded: true,
			});
		}
		appStore!.setSpinning(false);
	}

	public render() {
		const { defaultRecordType, useDefaultRecordType, loaded } = this.state;
		const { appStore } = this.props;

		let val: ITrimMainObject[] = [];

		if (defaultRecordType) {
			val = [defaultRecordType as ITrimMainObject];
		}

		return loaded === true ? (
			<form>
				<Checkbox
					label={appStore!.messages.web_useDefaultRecordType}
					checked={useDefaultRecordType}
					onChange={() => {
						this.setState({ useDefaultRecordType: !useDefaultRecordType });
					}}
				/>
				<TrimObjectPicker
					disabled={!useDefaultRecordType}
					trimType={BaseObjectTypes.RecordType}
					value={val}
					filter="rtyHasElecDocSupport unkActive"
					onTrimObjectSelected={(trimObject) => {
						this.setState({ defaultRecordType: trimObject });
					}}
				/>
				<PrimaryButton
					text={appStore!.messages.web_Save}
					onClick={() => {
						const { trimConnector, appStore } = this.props;
						const { useDefaultRecordType, defaultRecordType } = this.state;

						appStore!.setSpinning(true);
						trimConnector!
							.setOutlookUserOptions({
								defaultRecordType,
								useDefaultRecordType,
							})
							.then(function () {
								trimConnector!.clearCache(CacheIds.DefaultRecordType);
								appStore!.setSpinning(false);
							});
					}}
				/>
			</form>
		) : null;
	}
}

export default inject(
	"appStore",
	"trimConnector"
)(observer(OutlookUserOptions));
