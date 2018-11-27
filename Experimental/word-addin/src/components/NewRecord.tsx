import * as React from "react";
import { inject, observer } from "mobx-react";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";

@inject("appStore")
@observer
export class NewRecord extends React.Component<{ appStore?: any }, any> {
  public render() {
    const { appStore } = this.props;

    return (
      <div>
        <PrimaryButton>{appStore.messages.web_Register} </PrimaryButton>
      </div>
    );
  }
}

export default NewRecord;
