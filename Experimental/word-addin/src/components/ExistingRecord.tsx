import * as React from "react";
import { inject, observer } from "mobx-react";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";

@inject("appStore")
@observer
export class ExistingRecord extends React.Component<{ appStore?: any }, any> {
  public render() {
    //  const { appStore } = this.props;

    return <PrimaryButton> </PrimaryButton>;
  }
}

export default ExistingRecord;
