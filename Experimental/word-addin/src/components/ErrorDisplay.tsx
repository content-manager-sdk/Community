import * as React from "react";
import "./ErrorDisplay.css";

export class ErrorDisplay extends React.Component<{ Message: string }, any> {
  public render() {
    return (
      <React.Fragment>
        <div className="error error-header">Error</div>
        <div className="error error-body">{this.props.Message}</div>
      </React.Fragment>
    );
  }
}
export default ErrorDisplay;
