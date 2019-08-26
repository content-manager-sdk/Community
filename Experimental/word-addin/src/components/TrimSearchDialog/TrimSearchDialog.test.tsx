import * as React from "react";
import { shallow } from "enzyme";
import { TrimSearchDialog } from "./TrimSearchDialog";
import { BaseObjectTypes } from "../../../src/trim-coms/trim-baseobjecttypes";
import {
	TrimConnector,
	ISearchParamaters,
	ISearchResults,
	IClassification,
} from "../../trim-coms/trim-connector";
import { PrimaryButton } from "office-ui-fabric-react";

describe("Trim search dialog", function() {
	let trimConnector = new TrimConnector();
	trimConnector.credentialsResolver = (callback) => {};

	const getDriveUrl = function(uri: number): Promise<string> {
		return new Promise(function(resolve, reject) {
			reject({ message: "the error" });
		});
	};

	trimConnector.getDriveUrl = getDriveUrl.bind(trimConnector);
	it("has OK button", () => {
		const wrapper = shallow<TrimSearchDialog>(
			<TrimSearchDialog
				trimType={BaseObjectTypes.Record}
				trimConnector={trimConnector}
			/>
		);

		expect(wrapper.find(PrimaryButton)).toBeTruthy();
	});

	it("set error on click", (done) => {
		let thisError = "";
		const mockAppStore = {
			fetchBaseSettingFromTrim: null,
			resetError: null,
			messages: null,
			status: "",
			setError: function(message: string) {
				thisError = message;
			},
		};

		const wrapper = shallow<TrimSearchDialog>(
			<TrimSearchDialog
				trimType={BaseObjectTypes.Record}
				trimConnector={trimConnector}
				appStore={mockAppStore}
			/>
		);

		wrapper.setState({ selectedItems: [{ Uri: 1 }] });

		const btn = wrapper.find(PrimaryButton);

		btn.props().onClick(null);

		setTimeout(function() {
			try {
				expect(thisError).toEqual("the error");
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});
});
