import * as React from "react";
import { inject } from "mobx-react";

import { Position } from "office-ui-fabric-react/lib/utilities/positioning";
import { SpinButton } from "office-ui-fabric-react/lib/SpinButton";
import { ITrimConnector } from "../../trim-coms/trim-connector";

interface ITrimNumberFieldProps {
	format: string;
	label: string;
	defaultValue: string;
	trimConnector?: ITrimConnector;
	onChange?: (newValue?: number) => void;
}

export class TrimNumberFieldHelpers {
	public static IsNumberField(format: string): Boolean {
		return (
			format === "Number" ||
			format === "BigNumber" ||
			format === "Decimal" ||
			format === "Currency"
		);
	}
}

const TrimNumberField: React.FC<ITrimNumberFieldProps> = (props) => {
	const [currencySymbol, setCurrencySymbol] = React.useState("");

	const { format, label, defaultValue, trimConnector } = props;
	React.useEffect(() => {
		if (format === "Currency") {
			trimConnector!.getDatabaseProperties().then((databaseProps) => {
				setCurrencySymbol(databaseProps.CurrencySymbol);
			});
		}
	});

	const numberProps = {
		Number: {
			step: 1,
			min: -2147483647,
			max: 2147483647,
		},
		BigNumber: {
			step: 1,
			min: -9223372036854775808,
			max: 9223372036854775808,
		},
		Decimal: {
			step: 0.1,
			min: -2147483647,
			max: 2147483647,
		},
		Currency: {
			step: 1,
		},
	};

	const myProps = {
		...numberProps[format],
		onValidate: (newValue: string) => {
			const { onChange } = props;
			if (!Number.isNaN(Number(newValue))) {
				if (onChange) {
					onChange(Number(newValue));
					return newValue;
				}
			}

			return "0";
		},
	};
	if (format === "Currency") {
		return (
			<div
				className="ms-TextField"
				style={{
					boxSizing: "border-box",
				}}
			>
				<div className="ms-TextField-wrapper trim-number-field">
					<div>
						<label>{label}</label>
					</div>
					<SpinButton
						label={currencySymbol}
						defaultValue={defaultValue || "0"}
						{...myProps}
						labelPosition={Position.start}
					/>
				</div>
			</div>
		);
	} else {
		return (
			<SpinButton
				className="trim-number-field"
				label={label}
				defaultValue={defaultValue || "0"}
				{...myProps}
				labelPosition={Position.top}
			/>
		);
	}
};

export default inject("trimConnector")(TrimNumberField);
