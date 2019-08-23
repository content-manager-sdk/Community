import * as React from "react";
import "./ErrorDisplay.css";
import { Overlay } from "office-ui-fabric-react";

export class ErrorDisplay extends React.Component<{ Message: string }, any> {
	public render() {
		return (
			<Overlay>
				<div className="error error-header">Error</div>
				<div className="error error-body">{this.props.Message}</div>
			</Overlay>
		);
	}
}
export default ErrorDisplay;
