import * as React from "react";
import { observable, action } from "mobx";
import { inject, observer } from "mobx-react";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
import { ITrimConnector, IRecordType } from "../trim-coms/trim-connector";
import { BaseObjectTypes } from "../trim-coms/trim-baseobjecttypes";
import { initializeIcons } from "@uifabric/icons";

initializeIcons();

export class NewRecord extends React.Component<
  {
    appStore?: any;
    trimConnector: ITrimConnector;
  },
  any
> {
  @observable recordTypes: IDropdownOption[] = [];
  recordTypeUri: 0;

  @action.bound
  setRecordTypes(recTypes: IDropdownOption[]) {
    this.recordTypes = recTypes;
  }

  componentDidMount() {
    const { trimConnector } = this.props;

    let me = this;
    return trimConnector
      .search<IRecordType>(BaseObjectTypes.RecordType, "all", 3)
      .then(function(response: IRecordType[]) {
        me.setRecordTypes(
          response.map(function(o: IRecordType) {
            return { key: o.Uri, text: o.NameString } as IDropdownOption;
          })
        );
      });
  }

  private _onChange = (
    event: React.FormEvent<HTMLDivElement>,
    option: IDropdownOption,
    index: number
  ) => {
    this.recordTypeUri = this.recordTypes[index].key;
  };

  public render() {
    const { appStore } = this.props;

    return (
      <div>
        <PrimaryButton>{appStore.messages.web_Register} </PrimaryButton>
        <Dropdown
          options={this.recordTypes}
          placeholder={appStore.messages.web_SelectRecordType}
          onChange={this._onChange}
        />
      </div>
    );
  }
}

export default inject("appStore", "trimConnector")(observer(NewRecord));
//export default NewRecord;
