import * as React from "react";
import { inject, observer } from "mobx-react";

@inject("appStore")
@observer
export class NewRecord extends React.Component<{ appStore?: any }, any> {
  public render() {
    const { appStore } = this.props;

    return <div> </div>;
  }
}

export default NewRecord;
