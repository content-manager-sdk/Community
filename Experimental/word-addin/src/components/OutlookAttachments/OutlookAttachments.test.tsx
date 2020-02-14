import * as React from "react";
import { shallow, mount } from "enzyme";
import {
	OutlookConnector,
	IOutlookAttachment,
} from "../../office-coms/OutlookConnector";
import { OutlookAttachments } from "./OutlookAttachments";
import NewRecord from "../NewRecord";
import { Checkbox, DefaultButton, PrimaryButton } from "office-ui-fabric-react";
import TrimConnector, {
	IDriveInformation,
} from "../../trim-coms/trim-connector";

import { AppStoreOutlook } from "../../stores/AppStoreOutlook";
import RecordTypePicker from "../RecordTypePicker/RecordTypePicker";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";

describe("Outlook attachments", function() {
	let webUrlFound = "";
	let webUrlFound2 = "";
	let attachmentNameFound = "";
	let attachmentNameFound2 = "";
	let testRecordUrn;
	let testPrefix;

	beforeEach(() => {
		webUrlFound = "";
		webUrlFound2 = "";
		attachmentNameFound = "";
		attachmentNameFound2 = "";
		testRecordUrn = "";
		testPrefix = "";
		appStore.setStatus("WAITING");
		appStore.setDocumentInfo(null);
	});

	let trimConnector = new TrimConnector();

	trimConnector.getDriveId = function(
		webUrl: string,
		isEmail: boolean,
		recordUri: number,
		attachmentName: string
	) {
		if (webUrlFound) {
			webUrlFound2 = webUrl;
		} else {
			webUrlFound = webUrl;
		}

		if (attachmentNameFound) {
			attachmentNameFound2 = attachmentName;
			return new Promise((resolve) => {
				resolve({ Id: "test2" });
			});
		} else {
			attachmentNameFound = attachmentName;
			return new Promise((resolve) => {
				resolve({ Id: "test" });
			});
		}
	}.bind(trimConnector);

	trimConnector.getDatabaseProperties = function() {
		return new Promise(function(resolve) {
			resolve({
				EmailSubjectPrefix: "CM:",
				CurrencySymbol: "",
			});
		});
	}.bind(trimConnector);

	let outlookConnector = new OutlookConnector();

	outlookConnector.getAttachments = function(): IOutlookAttachment[] {
		return [
			{ Id: "a", Name: "A" },
			{ Id: "b", Name: "B" },
		];
	}.bind(outlookConnector);

	outlookConnector.getWebUrl = function() {
		return new Promise((resolve) => {
			resolve("id");
		});
	}.bind(outlookConnector);

	outlookConnector.setAutoOpen = function(
		autoOpen: Boolean,
		recordUrn: String,
		prefix: String
	) {
		testRecordUrn = recordUrn;
		testPrefix = prefix;
	}.bind(outlookConnector);

	const appStore = new AppStoreOutlook(trimConnector, outlookConnector);

	// appStore.setDocumentInfo = function(documentInfo: IDriveInformation) {
	// 	driveInfoFound = documentInfo;
	// }.bind(appStore);

	it("displays a list of check boxes", () => {
		const wrapper = shallow(
			<OutlookAttachments
				wordConnector={outlookConnector}
				appStore={appStore}
			/>
		);

		expect(wrapper.find(Checkbox).length).toEqual(4);
	});

	it("selects an attachment", () => {
		const wrapper = shallow<OutlookAttachments>(
			<OutlookAttachments
				wordConnector={outlookConnector}
				appStore={appStore}
			/>
		);

		wrapper
			.find(Checkbox)
			.at(1)
			.simulate("change", null, true);

		expect(wrapper.state().selectedAttachments).toEqual([
			{ Id: "a", Name: "A" },
		]);
	});

	it("removes a selected attachment", () => {
		const wrapper = shallow<OutlookAttachments>(
			<OutlookAttachments
				wordConnector={outlookConnector}
				appStore={appStore}
			/>
		);

		wrapper
			.find(Checkbox)
			.at(1)
			.simulate("change", null, true);

		wrapper
			.find(Checkbox)
			.at(2)
			.simulate("change", null, true);

		wrapper
			.find(Checkbox)
			.at(1)
			.simulate("change", null, false);

		expect(wrapper.state().selectedAttachments).toEqual([
			{ Id: "b", Name: "B" },
		]);
	});

	it("selects all attachments", () => {
		const wrapper = shallow<OutlookAttachments>(
			<OutlookAttachments
				wordConnector={outlookConnector}
				appStore={appStore}
			/>
		);

		wrapper
			.findWhere((n) => {
				return n.key() === "all_select";
			})
			.props()
			.onChange();

		expect(wrapper.state().selectedAttachments).toEqual([
			{ Id: "a", Name: "A" },
			{ Id: "b", Name: "B" },
		]);

		expect(
			wrapper
				.find(Checkbox)
				.at(1)
				.props().checked
		).toBeTruthy();

		expect(
			wrapper
				.find(Checkbox)
				.at(2)
				.props().checked
		).toBeTruthy();
	});

	it("selects no attachments", () => {
		const wrapper = shallow<OutlookAttachments>(
			<OutlookAttachments
				wordConnector={outlookConnector}
				appStore={appStore}
			/>
		);

		wrapper
			.findWhere((n) => {
				return n.key() === "all_select";
			})
			.props()
			.onChange();

		wrapper
			.findWhere((n) => {
				return n.key() === "all_select";
			})
			.props()
			.onChange();

		expect(wrapper.state().selectedAttachments).toEqual([]);

		expect(
			wrapper
				.find(Checkbox)
				.at(1)
				.props().checked
		).toBeFalsy();
		expect(
			wrapper
				.find(Checkbox)
				.at(2)
				.props().checked
		).toBeFalsy();
	});

	it("does not disable next button when record type not selected", () => {
		const wrapper = shallow<OutlookAttachments>(
			<OutlookAttachments
				wordConnector={outlookConnector}
				appStore={appStore}
			/>
		);

		wrapper
			.findWhere((n) => {
				return n.key() === "all_select";
			})
			.props()
			.onChange();

		wrapper
			.findWhere((n) => {
				return n.key() === "all_select";
			})
			.props()
			.onChange();

		expect(
			wrapper
				.find(PrimaryButton)
				.first()
				.props().disabled
		).toBeTruthy();
	});

	it("disables next button", () => {
		const wrapper = shallow<OutlookAttachments>(
			<OutlookAttachments
				wordConnector={outlookConnector}
				appStore={appStore}
			/>
		);

		wrapper
			.find(Checkbox)
			.at(1)
			.simulate("change", null, true);
		wrapper
			.find(Checkbox)
			.at(2)
			.simulate("change", null, true);

		wrapper
			.find(RecordTypePicker)
			.first()
			.props()
			.onRecordTypeSelected(1, false);

		expect(
			wrapper
				.find(PrimaryButton)
				.first()
				.props().disabled
		).toBeTruthy();
	});

	it("disables next button", () => {
		const wrapper = shallow<OutlookAttachments>(
			<OutlookAttachments
				wordConnector={outlookConnector}
				appStore={appStore}
			/>
		);

		expect(
			wrapper
				.find(PrimaryButton)
				.first()
				.props().disabled
		).toBeTruthy();
	});

	it("enables next button", () => {
		const wrapper = shallow<OutlookAttachments>(
			<OutlookAttachments
				wordConnector={outlookConnector}
				appStore={appStore}
			/>
		);

		wrapper
			.findWhere((n) => {
				return n.key() === "all_select";
			})
			.props()
			.onChange();

		wrapper
			.find(RecordTypePicker)
			.first()
			.props()
			.onRecordTypeSelected(1, false);

		wrapper
			.find(RecordTypePicker)
			.at(1)
			.props()
			.onRecordTypeSelected(1, false);

		expect(
			wrapper
				.find(PrimaryButton)
				.first()
				.props().disabled
		).toBeFalsy();
	});

	it("shows Record Type Picker when checked", () => {
		const wrapper = shallow<OutlookAttachments>(
			<OutlookAttachments
				wordConnector={outlookConnector}
				appStore={appStore}
			/>
		);

		wrapper
			.find(Checkbox)
			.at(1)
			.simulate("change", null, true);

		expect(wrapper.find(RecordTypePicker).length).toEqual(1);
	});
	[
		{ isCheckinStyle: false, expectedTrimType: BaseObjectTypes.RecordType },
		{ isCheckinStyle: true, expectedTrimType: BaseObjectTypes.CheckinStyle },
	].forEach((data) => {
		it(`sets the Record Type on the selected attachment ${data.expectedTrimType}`, () => {
			const wrapper = shallow<OutlookAttachments>(
				<OutlookAttachments
					wordConnector={outlookConnector}
					appStore={appStore}
				/>
			);

			wrapper
				.find(Checkbox)
				.at(1)
				.simulate("change", null, true);

			wrapper
				.find(RecordTypePicker)
				.first()
				.props()
				.onRecordTypeSelected(45, data.isCheckinStyle);

			expect(wrapper.state().selectedAttachments[0].FileUsing).toEqual({
				Uri: 45,
				TrimType: data.expectedTrimType,
			});
		});
	});
	it("get drive info on next", (done) => {
		const wrapper = shallow<OutlookAttachments>(
			<OutlookAttachments
				wordConnector={outlookConnector}
				appStore={appStore}
				trimConnector={trimConnector}
			/>
		);
		wrapper.setState({ autoCreate: false });
		wrapper
			.findWhere((n) => {
				return n.key() === "all_select";
			})
			.props()
			.onChange();

		wrapper
			.find(PrimaryButton)
			.first()
			.simulate("click");

		setTimeout(() => {
			try {
				expect(webUrlFound).toEqual("id/attachments/a");
				expect(attachmentNameFound).toEqual("A");
				expect(appStore.documentInfo).toEqual({ Id: "test" });
				done();
			} catch (e) {
				done.fail();
			}
		});
	});

	it("get drive info for all when auto create == true", (done) => {
		const wrapper = shallow<OutlookAttachments>(
			<OutlookAttachments
				wordConnector={outlookConnector}
				appStore={appStore}
				trimConnector={trimConnector}
			/>
		);
		wrapper.setState({ autoCreate: true });
		wrapper
			.findWhere((n) => {
				return n.key() === "all_select";
			})
			.props()
			.onChange();

		wrapper
			.find(PrimaryButton)
			.first()
			.simulate("click");

		setTimeout(() => {
			try {
				wrapper
					.find(NewRecord)
					.props()
					.onTrimObjectCreated({ Uri: 1 });
				setTimeout(() => {
					try {
						expect(webUrlFound).toEqual("id/attachments/a");
						expect(webUrlFound2).toEqual("id/attachments/b");
						expect(attachmentNameFound).toEqual("A");
						expect(attachmentNameFound2).toEqual("B");
						expect(appStore.documentInfo).toEqual({ Id: "test2" });
						done();
					} catch (e) {
						done.fail(e);
					}
				});
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("displays a NewRecord component", () => {
		const wrapper = shallow(
			<OutlookAttachments
				wordConnector={outlookConnector}
				appStore={appStore}
			/>
		);

		appStore.setDocumentInfo({ EmailPath: "ForUser\\9000000113\\c.png" });
		wrapper.setState({ showForm: true });
		expect(wrapper.find(NewRecord).exists()).toBeTruthy();
	});

	it(`sets default record type on the NewRecord`, () => {
		const wrapper = shallow<OutlookAttachments>(
			<OutlookAttachments
				wordConnector={outlookConnector}
				appStore={appStore}
			/>
		);

		wrapper
			.find(Checkbox)
			.at(1)
			.simulate("change", null, true);

		wrapper
			.find(RecordTypePicker)
			.first()
			.props()
			.onRecordTypeSelected(45, false);

		wrapper.setState({ showForm: true });

		appStore.setDocumentInfo({ EmailPath: "ForUser\\9000000113\\c.png" });

		expect(wrapper.find(NewRecord).props().defaultRecordType).toEqual({
			Uri: 45,
			TrimType: BaseObjectTypes.RecordType,
		});
	});

	it("updates on document save", () => {
		const wrapper = shallow<OutlookAttachments>(
			<OutlookAttachments
				wordConnector={outlookConnector}
				appStore={appStore}
			/>
		);

		wrapper
			.findWhere((n) => {
				return n.key() === "all_select";
			})
			.props()
			.onChange();

		appStore.setDocumentInfo({ EmailPath: "ForUser\\9000000113\\c.png" });
		wrapper.setState({ showForm: true });

		wrapper
			.find(NewRecord)
			.first()
			.props()
			.onTrimObjectCreated({ Uri: 1 });

		expect(appStore.documentInfo.EmailPath).toBeFalsy();
		expect(wrapper.state().selectedAttachments[0].Filed).toBeTruthy();
		expect(wrapper.state().selectedAttachments[1].Filed).toBeFalsy();

		wrapper.setState({ showForm: false });
		expect(
			wrapper
				.find(Checkbox)
				.at(1)
				.props().disabled
		).toBeTruthy();

		expect(wrapper.find(RecordTypePicker).length).toEqual(1);
	});

	it("sets auto open after all saved", (done) => {
		const wrapper = shallow<OutlookAttachments>(
			<OutlookAttachments
				wordConnector={outlookConnector}
				appStore={appStore}
				trimConnector={trimConnector}
			/>
		);

		wrapper
			.findWhere((n) => {
				return n.key() === "all_select";
			})
			.props()
			.onChange();

		appStore.setDocumentInfo({ EmailPath: "ForUser\\9000000113\\c.png" });
		wrapper.setState({ showForm: true });

		wrapper
			.find(NewRecord)
			.first()
			.props()
			.onTrimObjectCreated({ Uri: 1, URN: "urn_1" });

		appStore.setDocumentInfo({ EmailPath: "ForUser\\9000000113\\c.png" });
		wrapper.setState({ showForm: true });

		wrapper
			.find(NewRecord)
			.first()
			.props()
			.onTrimObjectCreated({ Uri: 2, URN: "urn_2" });

		setTimeout(() => {
			try {
				expect(testRecordUrn).toEqual("urn_1;urn_2");
				expect(testPrefix).toEqual("CM:");
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});
});
