import * as React from "react";
import { shallow, mount } from "enzyme";
import {
	OutlookConnector,
	IOutlookAttachment,
} from "../../office-coms/OutlookConnector";
import { OutlookAttachments } from "./OutlookAttachments";
import NewRecord from "../NewRecord";
import {
	Checkbox,
	DefaultButton,
	PrimaryButton,
	Check,
} from "office-ui-fabric-react";
import TrimConnector, {
	IDriveInformation,
	IRecord,
} from "../../trim-coms/trim-connector";

import { AppStoreOutlook } from "../../stores/AppStoreOutlook";
import RecordTypePicker from "../RecordTypePicker/RecordTypePicker";
import BaseObjectTypes from "../../trim-coms/trim-baseobjecttypes";
import { Text } from "office-ui-fabric-react/lib/Text";
import * as flushPromises from "flush-promises";

describe("Outlook attachments", function() {
	let webUrlFound = "";
	let webUrlFound2 = "";
	let attachmentNameFound = "";
	let attachmentNameFound2 = "";
	let testRecordUrn;
	let testPrefix;
	let foundAttachments = [];
	let filedRecords: IRecord[];

	beforeEach(() => {
		webUrlFound = "";
		webUrlFound2 = "";
		attachmentNameFound = undefined;
		attachmentNameFound2 = "";
		testRecordUrn = "";
		testPrefix = "";
		filedRecords = [];
		appStore.setStatus("WAITING");
		appStore.setDocumentInfo(null);
		appStore.setMessages({
			core_mailAttachmentsCap: "Attachments",
			core_completeEmail: "test {0}",
		});
		foundAttachments = [
			{ Id: "a", Name: "A", IsAttachment: false },
			{ Id: "b", Name: "B", IsAttachment: true },
		];
	});

	let trimConnector = new TrimConnector();

	trimConnector.getDefaultRecordType = function() {
		return new Promise(function(resolve) {
			resolve(null);
		});
	}.bind(trimConnector);
	trimConnector.getDriveId = function(
		webUrl: string,
		isEmail: boolean,
		recordUri: number,
		attachmentName: string
	) {
		if (webUrlFound) {
			webUrlFound2 = webUrl;
			attachmentNameFound2 = attachmentName;
			return new Promise((resolve) => {
				resolve({ Id: "test2" });
			});
		} else {
			webUrlFound = webUrl;
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
				Id: "N1",
			});
		});
	}.bind(trimConnector);

	let outlookConnector = new OutlookConnector();

	outlookConnector.getAttachments = function(): IOutlookAttachment[] {
		return foundAttachments;
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

	appStore.fetchFiledRecords = function() {
		return new Promise<IRecord[]>((resolve) => {
			resolve(filedRecords);
		});
	}.bind(appStore);

	const getWrapper = function() {
		return shallow<OutlookAttachments>(
			<OutlookAttachments
				wordConnector={outlookConnector}
				appStore={appStore}
				trimConnector={trimConnector}
			/>
		);
	};

	it("displays a list of check boxes", async () => {
		const wrapper = getWrapper();

		await flushPromises();
		expect(wrapper.find(Checkbox).length).toEqual(4);
		expect(
			wrapper
				.findWhere((c) => {
					return c.props().label === "test A";
				})
				.exists()
		).toBeTruthy();
		expect(
			wrapper
				.findWhere((c) => {
					return c.props().label === "B";
				})
				.exists()
		).toBeTruthy();
	});

	it("display disabled checkboxes for already filed", async () => {
		filedRecords = [
			{ Uri: 1, MessageId: { Value: "" }, ESource: { Value: "test\\A" } },
		];
		const wrapper = getWrapper();

		await flushPromises();
		expect(wrapper.find(Checkbox).length).toEqual(4);
		expect(
			wrapper
				.findWhere((c) => {
					return c.props().label === "test A";
				})
				.props().disabled
		).toBeTruthy();
		expect(
			wrapper
				.findWhere((c) => {
					return c.props().label === "B";
				})
				.props().disabled
		).toBeFalsy();
	});

	it("display disabled checkboxes for already filed email item", async () => {
		filedRecords = [
			{ Uri: 1, MessageId: { Value: "test" }, ESource: { Value: "" } },
		];
		const wrapper = getWrapper();

		await flushPromises();
		expect(wrapper.find(Checkbox).length).toEqual(4);
		expect(
			wrapper
				.findWhere((c) => {
					return c.props().label === "test A";
				})
				.props().disabled
		).toBeTruthy();
		expect(
			wrapper
				.findWhere((c) => {
					return c.props().label === "B";
				})
				.props().disabled
		).toBeFalsy();
	});

	it("displays a heading after the first item", async () => {
		const wrapper = getWrapper();

		await flushPromises();
		expect(wrapper.find(Text).exists()).toBeTruthy();
	});

	it("displays the record type picker only for zero attachments ", async () => {
		foundAttachments = [{ Id: "a", Name: "A", IsAttachment: false }];

		const wrapper = getWrapper();

		await flushPromises();
		expect(wrapper.find(Text).exists()).toBeFalsy();
		expect(wrapper.find(RecordTypePicker).exists()).toBeTruthy();
		expect(wrapper.find(Checkbox).exists()).toBeFalsy();
		expect(wrapper.state().autoCreate).toBeFalsy();
		expect(wrapper.state().selectedAttachments).toEqual([
			{
				Id: "a",
				Name: "A",
				IsAttachment: false,
			},
		]);
	});

	it("shows form on Record type selected when there are no attachments", async () => {
		appStore.setDocumentInfo({});
		foundAttachments = [{ Id: "a", Name: "A", IsAttachment: false }];

		const wrapper = getWrapper();

		await flushPromises();

		wrapper
			.find(RecordTypePicker)
			.props()
			.onRecordTypeSelected({ Uri: 9, TrimType: BaseObjectTypes.RecordType });

		await flushPromises();
		expect(wrapper.state().selectedAttachments[0].FileUsing).toEqual({
			Uri: 9,
			TrimType: BaseObjectTypes.RecordType,
		});

		expect(webUrlFound).toEqual("id");
		expect(attachmentNameFound).toBeUndefined();
		expect(appStore.documentInfo).toEqual({ Id: "test" });
	});

	it("selects an attachment", async () => {
		const wrapper = getWrapper();

		await flushPromises();
		wrapper
			.find(Checkbox)
			.at(1)
			.simulate("change", null, true);

		expect(wrapper.state().selectedAttachments).toEqual([
			{ Id: "a", Name: "A", IsAttachment: false },
		]);
	});

	it("removes a selected attachment", async () => {
		const wrapper = getWrapper();

		await flushPromises();
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
			{ Id: "b", Name: "B", IsAttachment: true },
		]);
	});

	it("selects all attachments", async () => {
		const wrapper = getWrapper();

		await flushPromises();
		wrapper
			.findWhere((n) => {
				return n.key() === "all_select";
			})
			.props()
			.onChange();

		expect(wrapper.state().selectedAttachments).toEqual([
			{ Id: "a", Name: "A", IsAttachment: false },
			{ Id: "b", Name: "B", IsAttachment: true },
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

	it("selects only non disabled attachments", async () => {
		filedRecords = [
			{ Uri: 1, MessageId: { Value: "test" }, ESource: { Value: "test\\A" } },
		];
		const wrapper = getWrapper();

		await flushPromises();
		wrapper
			.findWhere((n) => {
				return n.key() === "all_select";
			})
			.props()
			.onChange();

		expect(wrapper.state().selectedAttachments).toEqual([
			{ Id: "b", Name: "B", IsAttachment: true },
		]);
	});

	it("selects no attachments", async () => {
		const wrapper = getWrapper();

		await flushPromises();
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
		const wrapper = getWrapper();

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

	it("disables next button", async () => {
		const wrapper = getWrapper();

		await flushPromises();
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
			.onRecordTypeSelected({ Uri: 1, TrimType: BaseObjectTypes.RecordType });

		expect(
			wrapper
				.find(PrimaryButton)
				.first()
				.props().disabled
		).toBeTruthy();
	});

	it("disables next button", async () => {
		const wrapper = getWrapper();

		await flushPromises();
		expect(
			wrapper
				.find(PrimaryButton)
				.first()
				.props().disabled
		).toBeTruthy();
	});

	it("enables next button", async () => {
		const wrapper = getWrapper();

		await flushPromises();
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
			.onRecordTypeSelected({ Uri: 2, TrimType: BaseObjectTypes.RecordType });

		wrapper
			.find(RecordTypePicker)
			.at(1)
			.props()
			.onRecordTypeSelected({ Uri: 2, TrimType: BaseObjectTypes.RecordType });

		expect(
			wrapper
				.find(PrimaryButton)
				.first()
				.props().disabled
		).toBeFalsy();
	});

	it("shows Record Type Picker when checked", async () => {
		const wrapper = getWrapper();

		await flushPromises();
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
		it(`sets the Record Type on the selected attachment ${data.expectedTrimType}`, async () => {
			const wrapper = getWrapper();

			await flushPromises();
			wrapper
				.find(Checkbox)
				.at(1)
				.simulate("change", null, true);

			wrapper
				.find(RecordTypePicker)
				.first()
				.props()
				.onRecordTypeSelected({
					Uri: 45,
					TrimType: data.isCheckinStyle
						? BaseObjectTypes.CheckinStyle
						: BaseObjectTypes.RecordType,
				});

			expect(wrapper.state().selectedAttachments[0].FileUsing).toEqual({
				Uri: 45,
				TrimType: data.expectedTrimType,
			});
		});
	});
	it("get drive info on next -is attachment", async () => {
		appStore.setDocumentInfo({});
		const wrapper = getWrapper();

		await flushPromises();
		wrapper.setState({ autoCreate: false });
		wrapper
			.find(Checkbox)
			.at(2)
			.simulate("change", null, true);

		wrapper
			.find(PrimaryButton)
			.first()
			.simulate("click");

		await flushPromises();

		expect(webUrlFound).toEqual("id/attachments/b");
		expect(attachmentNameFound).toEqual("B");
		expect(appStore.documentInfo).toEqual({ Id: "test" });
	});

	it("get drive info on next - not attachment", async () => {
		appStore.setDocumentInfo({});
		const wrapper = getWrapper();

		await flushPromises();
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

		await flushPromises();
		expect(webUrlFound).toEqual("id");
		expect(attachmentNameFound).toBeUndefined();
		expect(appStore.documentInfo).toEqual({ Id: "test" });
	});

	it("get drive info for all when auto create == true", async () => {
		appStore.setDocumentInfo({});
		const wrapper = getWrapper();

		await flushPromises();
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

		await flushPromises();
		wrapper
			.find(NewRecord)
			.props()
			.onAfterSave({ Uri: 1 });

		await flushPromises();
		expect(webUrlFound).toEqual("id");
		expect(webUrlFound2).toEqual("id/attachments/b");
		expect(attachmentNameFound).toBeUndefined();
		expect(attachmentNameFound2).toEqual("B");
		expect(appStore.documentInfo).toEqual({ Id: "test2" });
	});

	it("displays a NewRecord component", () => {
		const wrapper = getWrapper();

		appStore.setDocumentInfo({ EmailPath: "ForUser\\9000000113\\c.png" });
		wrapper.setState({ showForm: true });
		expect(wrapper.find(NewRecord).exists()).toBeTruthy();
	});

	it(`sets selected record type on the NewRecord`, async () => {
		const wrapper = getWrapper();

		await flushPromises();
		wrapper
			.find(Checkbox)
			.at(1)
			.simulate("change", null, true);

		wrapper
			.find(RecordTypePicker)
			.first()
			.props()
			.onRecordTypeSelected({ Uri: 45, TrimType: BaseObjectTypes.RecordType });

		wrapper.setState({ showForm: true });

		appStore.setDocumentInfo({ EmailPath: "ForUser\\9000000113\\c.png" });
		await flushPromises();
		expect(wrapper.find(NewRecord).props().selectedRecordType).toEqual({
			Uri: 45,
			TrimType: BaseObjectTypes.RecordType,
		});
	});

	it("updates on document save", async () => {
		const wrapper = getWrapper();

		await flushPromises();
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
			.onAfterSave({ Uri: 1 });

		expect(appStore.documentInfo.EmailPath).toBeFalsy();
		expect(wrapper.state().selectedAttachments[0].Filed).toBeTruthy();
		expect(wrapper.state().selectedAttachments[1].Filed).toBeFalsy();

		wrapper.setState({ showForm: false, spinning: false });
		expect(
			wrapper
				.find(Checkbox)
				.at(1)
				.props().disabled
		).toBeTruthy();

		expect(wrapper.find(RecordTypePicker).length).toEqual(1);
	});

	it("sets auto open after all saved", async () => {
		const wrapper = getWrapper();

		await flushPromises();
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
			.onAfterSave({ Uri: 1, URN: "urn_1" });

		appStore.setDocumentInfo({ EmailPath: "ForUser\\9000000113\\c.png" });
		wrapper.setState({ showForm: true });
		await flushPromises();
		wrapper
			.find(NewRecord)
			.first()
			.props()
			.onAfterSave({ Uri: 2, URN: "urn_2" });
		await flushPromises();
		expect(testRecordUrn).toEqual("urn_1;urn_2");
		expect(testPrefix).toEqual("CM:");
	});

	it("includes existing URIs in URN sent to Extended prop", async () => {
		const wrapper = getWrapper();

		await flushPromises();
		wrapper
			.find(Checkbox)
			.at(1)
			.simulate("change", null, true);

		appStore.PreservedUris = [99, 88];

		wrapper.setState({ showForm: true });

		wrapper
			.find(NewRecord)
			.first()
			.props()
			.onAfterSave({ Uri: 1, URN: "urn_1" });
		await flushPromises();

		expect(testRecordUrn).toEqual("trim:N1/rec/99;trim:N1/rec/88;urn_1");
		expect(testPrefix).toEqual("CM:");
		expect(appStore.documentInfo.Uris).toEqual([99, 88, 1]);
	});
});
