import * as React from "react";
import { observer } from "mobx-react";
//import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import DetailsView from "./DetailsView";

export class ExistingRecord extends React.Component<{ appStore?: any }, any> {
	public render() {
		//  const { appStore } = this.props;

		return <DetailsView />;
	}
}
export default observer(ExistingRecord);
