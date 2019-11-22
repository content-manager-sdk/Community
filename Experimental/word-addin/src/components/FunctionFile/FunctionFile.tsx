import * as React from "react";

export class FunctionFile extends React.Component<{}, {}> {
	componentDidMount() {
		const script = document.createElement("script");

		script.src = "/function-file/Functionfile.js";
		script.async = true;

		document.body.appendChild(script);

		const script2 = document.createElement("script");

		script2.src = "/scripts/endsWith.js";
		script2.async = true;

		document.body.appendChild(script2);
	}

	public render() {
		return null;
	}
}

export default FunctionFile;
