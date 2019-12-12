import { OutlookConnector } from "./OutlookConnector";
import { SERVICEAPI_BASE_URI } from "../trim-coms/trim-connector";
import MockAdapter from "axios-mock-adapter";

let responseType = "folders";

export namespace Office {
	export const MailboxEnums = { RestVersion: {} };

	export const context = {
		mailbox: {
			diagnostics: {},
			convertToRestId: (
				itemId: string,
				restVersion: Office.MailboxEnums.RestVersion
			) => {
				return "rest_id";
			},
			getCallbackTokenAsync: (
				options: Office.AsyncContextOptions & { isRest?: boolean },
				callback: (result: AsyncResult<string>) => void
			) => {
				callback({ status: "succeeded", value: "abc" });
			},
			restUrl: "rest_url",
			item: { subject: "test_subject" },
			makeEwsRequestAsync: function(url, callback) {
				callback({
					status: "succeeded",
					value:
						responseType === "changeKey"
							? '<?xml version="1.0" encoding="utf-8"?><s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Header><h:ServerVersionInfo MajorVersion="15" MinorVersion="20" MajorBuildNumber="2516" MinorBuildNumber="19" Version="V2018_01_08" xmlns:h="http://schemas.microsoft.com/exchange/services/2006/types" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"/></s:Header><s:Body><m:GetFolderResponse xmlns:m="http://schemas.microsoft.com/exchange/services/2006/messages" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types"><m:ResponseMessages><m:GetFolderResponseMessage ResponseClass="Success"><m:ResponseCode>NoError</m:ResponseCode><m:Folders><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAABCevK4AAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsarr"/><t:DisplayName>XXXXXXXXXXXXXXXXXXXXXX</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder></m:Folders></m:GetFolderResponseMessage></m:ResponseMessages></m:GetFolderResponse></s:Body></s:Envelope>'
							: '<?xml version="1.0" encoding="utf-8"?><s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Header><h:ServerVersionInfo MajorVersion="15" MinorVersion="20" MajorBuildNumber="2516" MinorBuildNumber="19" Version="V2018_01_08" xmlns:h="http://schemas.microsoft.com/exchange/services/2006/types" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"/></s:Header><s:Body><m:FindFolderResponse xmlns:m="http://schemas.microsoft.com/exchange/services/2006/messages" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types"><m:ResponseMessages><m:FindFolderResponseMessage ResponseClass="Success"><m:ResponseCode>NoError</m:ResponseCode><m:RootFolder TotalItemsInView="63" IncludesLastItemInRange="true"><t:Folders><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA7jhrNAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsarf"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:DisplayName>[CM10]</t:DisplayName><t:ExtendedProperty><t:ExtendedFieldURI PropertySetId="0708434c-2e95-41c8-992f-8ee34b796fec" PropertyName="HPRM URN" PropertyType="String"/><t:Value>HPRM</t:Value></t:ExtendedProperty></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAABEtIfQAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsarh"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA7jhrNAAA=" ChangeKey="AQAAAA=="/><t:DisplayName>demo</t:DisplayName><t:ExtendedProperty><t:ExtendedFieldURI PropertySetId="0708434c-2e95-41c8-992f-8ee34b796fec" PropertyName="HPRM URN" PropertyType="String"/><t:Value>trim:N1/cip/9000000698</t:Value></t:ExtendedProperty></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAABCevK5AAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsarj"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA7jhrNAAA=" ChangeKey="AQAAAA=="/><t:DisplayName>For Helen</t:DisplayName><t:ExtendedProperty><t:ExtendedFieldURI PropertySetId="0708434c-2e95-41c8-992f-8ee34b796fec" PropertyName="HPRM URN" PropertyType="String"/><t:Value>trim:N1/cip/9000000613</t:Value></t:ExtendedProperty></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAABFCQLEAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABE9b7G"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA7jhrNAAA=" ChangeKey="AQAAAA=="/><t:DisplayName>in the root</t:DisplayName><t:ExtendedProperty><t:ExtendedFieldURI PropertySetId="0708434c-2e95-41c8-992f-8ee34b796fec" PropertyName="HPRM URN" PropertyType="String"/><t:Value>trim:N1/cip/9000000706</t:Value></t:ExtendedProperty></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAABFCQLFAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABE9b7R"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA7jhrNAAA=" ChangeKey="AQAAAA=="/><t:DisplayName>NewFolderName</t:DisplayName><t:ExtendedProperty><t:ExtendedFieldURI PropertySetId="0708434c-2e95-41c8-992f-8ee34b796fec" PropertyName="HPRM URN" PropertyType="String"/><t:Value>trim:N1/cip/9000000707</t:Value></t:ExtendedProperty></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAABCevK2AAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsarl"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA7jhrNAAA=" ChangeKey="AQAAAA=="/><t:DisplayName>Test</t:DisplayName><t:ExtendedProperty><t:ExtendedFieldURI PropertySetId="0708434c-2e95-41c8-992f-8ee34b796fec" PropertyName="HPRM URN" PropertyType="String"/><t:Value>trim:N1/cip/9000000610</t:Value></t:ExtendedProperty></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAABCevK3AAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsarn"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA7jhrNAAA=" ChangeKey="AQAAAA=="/><t:DisplayName>test 123</t:DisplayName><t:ExtendedProperty><t:ExtendedFieldURI PropertySetId="0708434c-2e95-41c8-992f-8ee34b796fec" PropertyName="HPRM URN" PropertyType="String"/><t:Value>trim:N1/cip/9000000611</t:Value></t:ExtendedProperty></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA7jhrOAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsarp"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA7jhrNAAA=" ChangeKey="AQAAAA=="/><t:DisplayName>Test for CMOfficeDev</t:DisplayName><t:ExtendedProperty><t:ExtendedFieldURI PropertySetId="0708434c-2e95-41c8-992f-8ee34b796fec" PropertyName="HPRM URN" PropertyType="String"/><t:Value>trim:N1/cip/9000000609</t:Value></t:ExtendedProperty></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAABFCQLDAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABE9b7C"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA7jhrNAAA=" ChangeKey="AQAAAA=="/><t:DisplayName>WWW</t:DisplayName><t:ExtendedProperty><t:ExtendedFieldURI PropertySetId="0708434c-2e95-41c8-992f-8ee34b796fec" PropertyName="HPRM URN" PropertyType="String"/><t:Value>trim:N1/cip/9000000705</t:Value></t:ExtendedProperty></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAABCevK4AAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsarr"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA7jhrNAAA=" ChangeKey="AQAAAA=="/><t:DisplayName>XXXXXXXXXXXXXXXXXXXXXX</t:DisplayName><t:ExtendedProperty><t:ExtendedFieldURI PropertySetId="0708434c-2e95-41c8-992f-8ee34b796fec" PropertyName="HPRM URN" PropertyType="String"/><t:Value>trim:N1/cip/9000000612</t:Value></t:ExtendedProperty></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFeAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsart"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Archive</t:DisplayName></t:Folder><t:CalendarFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAENAAA=" ChangeKey="AgAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsarv"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Appointment</t:FolderClass><t:DisplayName>Calendar</t:DisplayName><t:DistinguishedFolderId>calendar</t:DistinguishedFolderId></t:CalendarFolder><t:CalendarFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAACSTduAAA=" ChangeKey="AgAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsarx"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAENAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Appointment</t:FolderClass><t:DisplayName>Australia holidays</t:DisplayName></t:CalendarFolder><t:CalendarFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAACSTdtAAA=" ChangeKey="AgAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsarz"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAENAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Appointment.Birthday</t:FolderClass><t:DisplayName>Birthdays</t:DisplayName></t:CalendarFolder><t:ContactsFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEOAAA=" ChangeKey="AwAAABYAAACjhKCg59RNQ4YnJZN5sQewAABE9bqv"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Contact</t:FolderClass><t:DisplayName>Contacts</t:DisplayName><t:DistinguishedFolderId>contacts</t:DistinguishedFolderId></t:ContactsFolder><t:ContactsFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFGAAA=" ChangeKey="AwAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsar3"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEOAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Contact.MOC.QuickContacts</t:FolderClass><t:DisplayName>{06967759-274D-40B2-A3EB-D7F9E73727D7}</t:DisplayName><t:DistinguishedFolderId>quickcontacts</t:DistinguishedFolderId></t:ContactsFolder><t:ContactsFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFHAAA=" ChangeKey="AwAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsar5"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEOAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Contact.MOC.ImContactList</t:FolderClass><t:DisplayName>{A9E2BC46-B3A0-4243-B315-60D991004455}</t:DisplayName><t:DistinguishedFolderId>imcontactlist</t:DistinguishedFolderId></t:ContactsFolder><t:ContactsFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFMAAA=" ChangeKey="AwAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsar7"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEOAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Contact.Company</t:FolderClass><t:DisplayName>Companies</t:DisplayName><t:DistinguishedFolderId>companycontacts</t:DistinguishedFolderId></t:ContactsFolder><t:ContactsFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFLAAA=" ChangeKey="AwAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsar9"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEOAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Contact.GalContacts</t:FolderClass><t:DisplayName>GAL Contacts</t:DisplayName></t:ContactsFolder><t:ContactsFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFKAAA=" ChangeKey="AwAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsar/"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEOAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Contact.OrganizationalContacts</t:FolderClass><t:DisplayName>Organizational Contacts</t:DisplayName></t:ContactsFolder><t:ContactsFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFJAAA=" ChangeKey="AwAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsasB"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEOAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Contact.PeopleCentricConversationBuddies</t:FolderClass><t:DisplayName>PeopleCentricConversation Buddies</t:DisplayName><t:DistinguishedFolderId>peoplecentricconversationbuddies</t:DistinguishedFolderId></t:ContactsFolder><t:ContactsFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAE5AAA=" ChangeKey="AwAAABYAAACjhKCg59RNQ4YnJZN5sQewAABE9bqx"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEOAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Contact.RecipientCache</t:FolderClass><t:DisplayName>Recipient Cache</t:DisplayName><t:DistinguishedFolderId>recipientcache</t:DistinguishedFolderId></t:ContactsFolder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEhAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsasF"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Configuration</t:FolderClass><t:DisplayName>Conversation Action Settings</t:DisplayName></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAE4AAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsasH"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:DisplayName>Conversation History</t:DisplayName><t:DistinguishedFolderId>conversationhistory</t:DistinguishedFolderId></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFSAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABE9bq9"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAE4AAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.SkypeTeams.Message</t:FolderClass><t:DisplayName>Team Chat</t:DisplayName></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEKAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsasJ"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Deleted Items</t:DisplayName><t:DistinguishedFolderId>deleteditems</t:DistinguishedFolderId></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAABEtIfMAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABE9b+D"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEKAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>NewFolderName</t:DisplayName></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEPAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsasL"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Drafts</t:DisplayName><t:DistinguishedFolderId>drafts</t:DistinguishedFolderId></t:Folder><t:ContactsFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFFAAA=" ChangeKey="AwAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsasN"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Contact</t:FolderClass><t:DisplayName>ExternalContacts</t:DisplayName></t:ContactsFolder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEgAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABE9bqw"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Files</t:FolderClass><t:DisplayName>Files</t:DisplayName></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEMAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsab8"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Inbox</t:DisplayName><t:DistinguishedFolderId>inbox</t:DistinguishedFolderId></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAABFCQLHAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABE9b8E"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEMAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>b2</t:DisplayName></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAABFCQLGAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABE9b7Y"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEMAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>NewFolderName</t:DisplayName></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3bJPOAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsasP"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEMAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>wwwww</t:DisplayName></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIHSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3bJPOAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsasP"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3bJPOAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>eee</t:DisplayName></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAABEtIfTAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsasR"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3bJPOAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>this is a very long folder name I wonder how it will look</t:DisplayName></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEQAAA=" ChangeKey="BgAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsasV"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Journal</t:FolderClass><t:DisplayName>Journal</t:DisplayName><t:DistinguishedFolderId>journal</t:DistinguishedFolderId></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAETAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsasX"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Junk Email</t:DisplayName><t:PolicyTag IsExplicit="true">3dbb5f39-dc76-4916-9db3-fa9191760a55</t:PolicyTag></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3bJPDAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsasZ"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Junk Email</t:DisplayName><t:DistinguishedFolderId>junkemail</t:DistinguishedFolderId><t:PolicyTag IsExplicit="true">3dbb5f39-dc76-4916-9db3-fa9191760a55</t:PolicyTag></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAABFCQLIAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABE9b9/"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>My Filed Emails</t:DisplayName></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAABFCQLKAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABE9b+t"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAABFCQLIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Filed Email 2</t:DisplayName><t:ExtendedProperty><t:ExtendedFieldURI PropertySetId="0708434c-2e95-41c8-992f-8ee34b796fec" PropertyName="HPRM URN" PropertyType="String"/><t:Value>trim:N1/cip/9000000711</t:Value></t:ExtendedProperty></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAABFCQLJAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABE9b+O"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAABFCQLIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>NewFolderName</t:DisplayName></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAERAAA=" ChangeKey="BQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsasb"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.StickyNote</t:FolderClass><t:DisplayName>Notes</t:DisplayName><t:DistinguishedFolderId>notes</t:DistinguishedFolderId></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAELAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST+K"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Outbox</t:DisplayName><t:DistinguishedFolderId>outbox</t:DistinguishedFolderId></t:Folder><t:ContactsFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAGEHAAA=" ChangeKey="AwAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsasd"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Contact</t:FolderClass><t:DisplayName>PersonMetadata</t:DisplayName><t:DistinguishedFolderId>personmetadata</t:DistinguishedFolderId></t:ContactsFolder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3bJPFAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsasf"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Configuration</t:FolderClass><t:DisplayName>Quick Step Settings</t:DisplayName></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3bJPEAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsash"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note.OutlookHomepage</t:FolderClass><t:DisplayName>RSS Feeds</t:DisplayName></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEJAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsasj"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Sent Items</t:DisplayName><t:DistinguishedFolderId>sentitems</t:DistinguishedFolderId></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3bJPGAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsasl"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEJAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Content Manager</t:DisplayName></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3bJPMAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsasn"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3bJPGAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Transitie</t:DisplayName></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3bJPHAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsasp"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3bJPGAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Transition</t:DisplayName></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3a5OaAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsasr"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:DisplayName>Social Activity Notifications</t:DisplayName></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3a4uaAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsast"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Sync Issues</t:DisplayName><t:DistinguishedFolderId>syncissues</t:DistinguishedFolderId></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3a4ubAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsasv"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3a4uaAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Conflicts</t:DisplayName><t:DistinguishedFolderId>conflicts</t:DistinguishedFolderId></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3a4ucAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsasx"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3a4uaAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Local Failures</t:DisplayName><t:DistinguishedFolderId>localfailures</t:DistinguishedFolderId></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3a4udAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsasz"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3a4uaAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Server Failures</t:DisplayName><t:DistinguishedFolderId>serverfailures</t:DistinguishedFolderId></t:Folder><t:TasksFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAESAAA=" ChangeKey="BAAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsas1"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Task</t:FolderClass><t:DisplayName>Tasks</t:DisplayName><t:DistinguishedFolderId>tasks</t:DistinguishedFolderId></t:TasksFolder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA/cMQSAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsas3"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.WebExtension</t:FolderClass><t:DisplayName>WebExtAddIns</t:DisplayName></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA/cMQTAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsas5"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA/cMQSAAA=" ChangeKey="AQAAAA=="/><t:DisplayName>bbf8f785-ac58-4fa1-a679-1d2a00bec93c</t:DisplayName></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA/cMQUAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsas7"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA/cMQTAAA=" ChangeKey="AQAAAA=="/><t:DisplayName>Content Manager</t:DisplayName></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFZAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsas9"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF</t:FolderClass><t:DisplayName>Yammer Root</t:DisplayName></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFcAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsas/"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFZAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF</t:FolderClass><t:DisplayName>Feeds</t:DisplayName></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFaAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsatB"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFZAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF</t:FolderClass><t:DisplayName>Inbound</t:DisplayName></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFbAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsatD"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFZAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF</t:FolderClass><t:DisplayName>Outbound</t:DisplayName></t:Folder></t:Folders></m:RootFolder></m:FindFolderResponseMessage></m:ResponseMessages></m:FindFolderResponse></s:Body></s:Envelope>',
				});
			},
		},
	};
}

(<any>global).Office = Office;

const axios = require("axios");

describe("Outlook connector tests", () => {
	beforeEach(() => {
		Office.context.mailbox.item.subject = "test_subject";
		responseType = "folders";
	});
	const outlookConnector = new OutlookConnector();
	const mock = new MockAdapter(axios);

	it("set URN on email", (done) => {
		let postConfig;
		mock
			.onPatch(`rest_url/v2.0/me/messages/rest_id`)
			.reply(function(config: any) {
				postConfig = config;

				return [200, {}];
			});

		outlookConnector.setAutoOpen(true, "trim:N1/123", "CM:");
		setTimeout(() => {
			try {
				expect(postConfig.data).toEqual(
					JSON.stringify({
						SingleValueExtendedProperties: [
							{
								PropertyId:
									"String {0708434C-2E95-41C8-992F-8EE34B796FEC} Name HPRM_RECORD_URN",
								Value: "trim:N1/123",
							},
							{
								PropertyId:
									"String {00020386-0000-0000-C000-000000000046} Name HPTrimRecordUri",
								Value: "123",
							},
							{
								PropertyId:
									"String {00020386-0000-0000-C000-000000000046} Name HPTrimDataset",
								Value: "N1",
							},
						],
						Subject: "CM: test_subject",
					})
				);

				expect(postConfig.headers.Authorization).toEqual("Bearer abc");

				expect.assertions(2);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("not duplicate prefix", (done) => {
		Office.context.mailbox.item.subject = "CM: test_subject";

		let postConfig;
		mock
			.onPatch(`rest_url/v2.0/me/messages/rest_id`)
			.reply(function(config: any) {
				postConfig = config;

				return [200, {}];
			});

		outlookConnector.setAutoOpen(true, "trim:N1/123", "CM:");
		setTimeout(() => {
			try {
				expect(postConfig.data).toEqual(
					JSON.stringify({
						SingleValueExtendedProperties: [
							{
								PropertyId:
									"String {0708434C-2E95-41C8-992F-8EE34B796FEC} Name HPRM_RECORD_URN",
								Value: "trim:N1/123",
							},
							{
								PropertyId:
									"String {00020386-0000-0000-C000-000000000046} Name HPTrimRecordUri",
								Value: "123",
							},
							{
								PropertyId:
									"String {00020386-0000-0000-C000-000000000046} Name HPTrimDataset",
								Value: "N1",
							},
						],
						Subject: "CM: test_subject",
					})
				);

				expect.assertions(1);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("prefix is empty", (done) => {
		let postConfig;
		mock
			.onPatch(`rest_url/v2.0/me/messages/rest_id`)
			.reply(function(config: any) {
				postConfig = config;

				return [200, {}];
			});

		outlookConnector.setAutoOpen(true, "trim:N1/123", "");
		setTimeout(() => {
			try {
				expect(postConfig.data).toEqual(
					JSON.stringify({
						SingleValueExtendedProperties: [
							{
								PropertyId:
									"String {0708434C-2E95-41C8-992F-8EE34B796FEC} Name HPRM_RECORD_URN",
								Value: "trim:N1/123",
							},
							{
								PropertyId:
									"String {00020386-0000-0000-C000-000000000046} Name HPTrimRecordUri",
								Value: "123",
							},
							{
								PropertyId:
									"String {00020386-0000-0000-C000-000000000046} Name HPTrimDataset",
								Value: "N1",
							},
						],
					})
				);

				expect.assertions(1);
				done();
			} catch (e) {
				done.fail(e);
			}
		});
	});

	it("inbox not included in getFolder", (done) => {
		outlookConnector
			.getFolders("")
			.then((items) => {
				expect(
					items.find((item) => {
						return item.displayName === `Inbox`;
					})
				).toBeFalsy();
				done();
			})
			.catch((e) => {
				done.fail(e);
			});
	});

	it("webExtAddins not included in getFolder", (done) => {
		outlookConnector
			.getFolders("")
			.then((items) => {
				expect(
					items.find((item) => {
						return item.displayName.indexOf("WebExtAddIns") > -1;
					})
				).toBeUndefined();
				done();
			})
			.catch((e) => {
				done.fail(e);
			});
	});

	it("excludes folders with retention policy", (done) => {
		outlookConnector
			.getFolders("")
			.then((items) => {
				expect(
					items.find((item) => {
						return item.displayName.indexOf("Junk Email") > -1;
					})
				).toBeUndefined();
				done();
			})
			.catch((e) => {
				done.fail(e);
			});
	});

	it("excludes folders which are children of well known folders", (done) => {
		outlookConnector
			.getFolders("")
			.then((items) => {
				expect(
					items.find((item) => {
						return item.displayName.indexOf("Sent Items") > -1;
					})
				).toBeUndefined();
				done();
			})
			.catch((e) => {
				done.fail(e);
			});
	});

	it("excludes folders which are descendants of well known folders", (done) => {
		outlookConnector
			.getFolders("")
			.then((items) => {
				expect(
					items.find((item) => {
						return item.displayName.indexOf("Transition") > -1;
					})
				).toBeUndefined();
				done();
			})
			.catch((e) => {
				done.fail(e);
			});
	});

	it("children of inbox included in getFolder", (done) => {
		outlookConnector
			.getFolders("")
			.then((items) => {
				expect(
					items.find((item) => {
						return item.displayName === `Inbox\\wwwww`;
					})
				).toBeTruthy();
				done();
			})
			.catch((e) => {
				done.fail(e);
			});
	});

	it("includes lower level folders", (done) => {
		outlookConnector
			.getFolders("")
			.then((items) => {
				expect(
					items.find((item) => {
						return item.displayName === `Inbox\\wwwww\\eee`;
					})
				).toBeTruthy();
				done();
			})
			.catch((e) => {
				done.fail(e);
			});
	});

	it("has first item as Auto Create", (done) => {
		outlookConnector
			.getFolders("")
			.then((items) => {
				expect(items[0].id).toEqual("cm_auto");
				done();
			})
			.catch((e) => {
				done.fail(e);
			});
	});

	it("has first item as Auto Create with caption", (done) => {
		outlookConnector
			.getFolders("auto create")
			.then((items) => {
				expect(items[0].displayName).toEqual("auto create");
				done();
			})
			.catch((e) => {
				done.fail(e);
			});
	});

	it("extracts change key from FindFolder", (done) => {
		responseType = "changeKey";
		outlookConnector
			.getFolderChangeKey("")
			.then((changeKey) => {
				expect(changeKey).toEqual("AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEsarr");
				done();
			})
			.catch((e) => {
				done.fail(e);
			});
	});

	it("excludes folders which are linked", (done) => {
		outlookConnector
			.getFolders("")
			.then((items) => {
				expect(
					items.find((item) => {
						return item.displayName.indexOf("Filed Email 2") > -1;
					})
				).toBeUndefined();
				done();
			})
			.catch((e) => {
				done.fail(e);
			});
	});
});
