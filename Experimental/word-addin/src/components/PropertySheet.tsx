import * as React from "react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { TextField } from "office-ui-fabric-react/lib/TextField";

//@inject("appStore")
//@observer
export class PropertySheet extends React.Component<
  {
    formDefinition: any;
    defaultRecordTitle?: string;
    onChange?: (event: React.FormEvent<HTMLElement>, newValue?: any) => void;
  },
  any
> {
  private formValues: any = {};
  @observable isTextFieldMultiline: any = {};
  @action.bound
  setMultiLine(propName: string, multiline: boolean) {
    this.isTextFieldMultiline[propName] = multiline;
  }

  private _onTextChange = (propName: string) => (
    event: any,
    newText: string
  ) => {
    const newMultiline = newText.length > 40;
    if (newMultiline !== this.isTextFieldMultiline[propName]) {
      this.setMultiLine(propName, newMultiline);
    }
    const { onChange } = this.props;
    if (onChange) {
      this.formValues[propName] = newText;
      onChange(event, this.formValues);
    }
  };

  public render() {
    const { formDefinition } = this.props;

    if (
      formDefinition &&
      formDefinition.Pages &&
      formDefinition.Pages.length > 0
    ) {
      const form = formDefinition.Pages[0];
      const formItems = form.PageItems || [];

      const pageItems = formItems.map((pageItem: any) => {
        if (pageItem.Format === "String") {
          return (
            <TextField
              key={pageItem.Name}
              multiline={this.isTextFieldMultiline[pageItem.Name]}
              label={pageItem.Caption}
              defaultValue={
                pageItem.Name === "RecordTypedTitle"
                  ? this.props.defaultRecordTitle
                  : ""
              }
              onChange={this._onTextChange(pageItem.Name)}
            />
          );
        } else {
          return null;
        }
      });
      return (
        <div>
          <h1 className="ms-font-l">{form.Caption}</h1>
          {pageItems}
        </div>
      );
    } else {
      return null;
    }
  }
}

//export default PropertySheet;
export default observer(PropertySheet);
