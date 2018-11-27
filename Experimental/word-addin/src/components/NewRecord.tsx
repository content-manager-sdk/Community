import * as React from "react";
import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown";
import { /* ITrimConnector, */ IRecordType } from "../trim-coms/trim-connector";
import { BaseObjectTypes } from "../trim-coms/trim-baseobjecttypes";
import { initializeIcons } from "@uifabric/icons";

initializeIcons();

export class NewRecord extends React.Component<
  {
    appStore?: any;
    trimConnector: {
      search<T>(
        trimType: BaseObjectTypes,
        query: string,
        purpose: number
      ): Promise<IRecordType[]>;
    };
  },
  any
> {
  @observable recordTypes: any[] = [];

  componentDidMount() {
    const { trimConnector } = this.props;

    let me = this;
    return trimConnector
      .search<IRecordType>(BaseObjectTypes.RecordType, "all", 3)
      .then(function(response: IRecordType[]) {
        me.recordTypes = response.map(function(o: IRecordType) {
          return { key: o.Uri, text: o.NameString };
        });
      });
  }

  public render() {
    const { appStore } = this.props;

    return (
      <div>
        <PrimaryButton>{appStore.messages.web_Register} </PrimaryButton>
        <Dropdown options={this.recordTypes} />
      </div>
    );
  }
}

export default inject("appStore", "trimConnector")(observer(NewRecord));
//export default NewRecord;
