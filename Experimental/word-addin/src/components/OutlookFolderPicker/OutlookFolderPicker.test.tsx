import * as React from "react";
import { OutlookFolderPicker } from "./OutlookFolderPicker";
import { shallow } from "enzyme";
import { ComboBox } from "office-ui-fabric-react";

jest.mock("../../office-coms/OutlookConnector");
describe("Outlook Folder Picker", function() {
	it("fires onChange", () => {
		let testFolderId = "";
		const wrapper = shallow<OutlookFolderPicker>(
			<OutlookFolderPicker onChange={(folderId) => {testFolderId = folderId} appStore={{messages:{}}} />
		);
		wrapper
			.find(ComboBox)
			.props()
			.onChange(null, { key: "cm_auto", text: "auto" });

		expect(testFolderId).toEqual("cm_auto");
	});
});
