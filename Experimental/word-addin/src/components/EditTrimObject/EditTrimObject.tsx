import * as React from "react";
import { inject, observer } from "mobx-react";
import {
	PrimaryButton,
	DefaultButton,
} from "office-ui-fabric-react/lib/Button";

import { ITrimConnector } from "../../trim-coms/trim-connector";
import { BaseObjectTypes } from "../../trim-coms/trim-baseobjecttypes";
import PropertySheet from "../PropertySheet";
import { Stack } from "office-ui-fabric-react";

interface IEditTrimObjectState {
	formDefinition: any;
	processing: boolean;
}

interface IEditTrimObjectProps {
	appStore?: any;
	trimConnector?: ITrimConnector;
	className?: string;
	trimType: BaseObjectTypes;
	recordUri: number;
	onSave?: () => void;
	onClose?: () => void;
}

export class EditTrimObject extends React.Component<
	IEditTrimObjectProps,
	IEditTrimObjectState
> {
	constructor(props: IEditTrimObjectProps) {
		super(props);

		this.state = {
			formDefinition: {},
			processing: false,
		};
	}

	recordProps: any = {};
	recordFields: any = {};

	componentDidMount() {
		const { trimConnector, trimType, recordUri } = this.props;

		if (trimConnector) {
			trimConnector
				.getPropertySheetForObject(trimType, recordUri)
				.then((propertySheet) => {
					this.setState({ formDefinition: propertySheet });
				});
		}
	}

	private _onClick = (event: React.MouseEvent<HTMLFormElement>) => {
		if (event) {
			event.preventDefault();
		}
		const { trimConnector, trimType, recordUri, onSave, appStore } = this.props;
		if (trimConnector) {
			appStore!.setSpinning(true);
			trimConnector
				.saveToTrim(
					trimType,
					{
						Uri: recordUri,
						...this.recordProps,
					},
					this.recordFields
				)
				.then(() => {
					appStore!.setSpinning(false);
					if (onSave) {
						onSave();
					}
				})
				.catch((e) => {
					appStore!.setError(e);
				});
		}
	};

	private _onPropertySheetChange = (newProps: any, newFields: any) => {
		this.recordProps = { ...newProps };
		this.recordFields = { ...newFields };
	};

	public render() {
		const { appStore, className, trimType, onClose } = this.props;

		const { formDefinition, processing } = this.state;

		return (
			<React.Fragment>
				<form
					className={className + (processing === true ? " disabled" : "")}
					onSubmit={this._onClick}
				>
					<div className={`new-record-body new-record-body-${trimType}`}>
						<PropertySheet
							formDefinition={formDefinition}
							onChange={this._onPropertySheetChange}
						/>
						{formDefinition.Pages && (
							<Stack horizontal>
								{onClose !== undefined && (
									<DefaultButton
										className="trim-register"
										text={appStore.messages.web_cancel}
										onClick={onClose}
									/>
								)}
								<PrimaryButton className="trim-register" type="submit">
									{appStore.messages.web_save}
								</PrimaryButton>
							</Stack>
						)}
					</div>
				</form>
			</React.Fragment>
		);
	}
}

export default inject("appStore", "trimConnector")(observer(EditTrimObject));
