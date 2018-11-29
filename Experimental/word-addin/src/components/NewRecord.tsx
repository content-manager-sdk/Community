import * as React from "react";
import { observable, action, runInAction } from "mobx";
import { inject, observer } from "mobx-react";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
import { ITrimConnector, IRecordType } from "../trim-coms/trim-connector";
import { BaseObjectTypes } from "../trim-coms/trim-baseobjecttypes";
import { initializeIcons } from "@uifabric/icons";
import PropertySheet from "./PropertySheet";
import { IWordConnector } from "src/office-coms/word-connector";

initializeIcons();

export class NewRecord extends React.Component<
  {
    appStore?: any;
    trimConnector?: ITrimConnector;
    wordConnector?: IWordConnector;
  },
  any
> {
  @observable recordTypes: IDropdownOption[] = [];
  @observable formDefinition: any = {};
  recordTypeUri: number = 0;
  recordProps: any = {};

  @action.bound
  setRecordTypes(recTypes: IDropdownOption[]) {
    this.recordTypes = recTypes;
    this.recordTypeUri = 0;
  }

  @action.bound
  setPropertySheet() {
    if (this.recordTypeUri > 0) {
      this.props
        .trimConnector!.getPropertySheet(this.recordTypeUri)
        .then((data) => {
          runInAction(() => {
            this.formDefinition = data;
          });
        });
    }
  }

  componentDidMount() {
    const { trimConnector, wordConnector } = this.props;
    this.recordProps["RecordTypedTitle"] = wordConnector!.getName();

    let me = this;
    return trimConnector!
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
    this.recordTypeUri = Number(this.recordTypes[index].key);
    this.setPropertySheet();
  };

  private _onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    this.props.appStore.createRecord(this.recordTypeUri, this.recordProps);
  };

  private _onPropertySheetChange = (
    event: React.FormEvent<HTMLElement>,
    newProps: any
  ) => {
    this.recordProps = newProps;
  };

  public render() {
    const { appStore } = this.props;

    return (
      <div>
        <Dropdown
          options={this.recordTypes}
          placeholder={appStore.messages.web_SelectRecordType}
          onChange={this._onChange}
        />
        <PropertySheet
          formDefinition={this.formDefinition}
          defaultRecordTitle={this.recordProps["RecordTypedTitle"]}
          onChange={this._onPropertySheetChange}
        />
        <PrimaryButton onClick={this._onClick}>
          {appStore.messages.web_Register}{" "}
        </PrimaryButton>
      </div>
    );
  }
}

export default inject("appStore", "trimConnector", "wordConnector")(
  observer(NewRecord)
);
//export default NewRecord;
