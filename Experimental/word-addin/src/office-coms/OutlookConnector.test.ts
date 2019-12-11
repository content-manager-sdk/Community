import { OutlookConnector } from "./OutlookConnector";
import { SERVICEAPI_BASE_URI } from "../trim-coms/trim-connector";
import MockAdapter from "axios-mock-adapter";

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
						'<?xml version="1.0" encoding="utf-8"?><s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Header><h:ServerVersionInfo MajorVersion="15" MinorVersion="20" MajorBuildNumber="2516" MinorBuildNumber="18" Version="V2018_01_08" xmlns:h="http://schemas.microsoft.com/exchange/services/2006/types" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"/></s:Header><s:Body><m:FindFolderResponse xmlns:m="http://schemas.microsoft.com/exchange/services/2006/messages" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types"><m:ResponseMessages><m:FindFolderResponseMessage ResponseClass="Success"><m:ResponseCode>NoError</m:ResponseCode><m:RootFolder TotalItemsInView="55" IncludesLastItemInRange="true"><t:Folders><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA7jhrNAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST9S"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:DisplayName>[CM10]</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>6</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAABEtIfQAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEoiVb"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA7jhrNAAA=" ChangeKey="AQAAAA=="/><t:DisplayName>demo</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAABCevK5AAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST9U"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA7jhrNAAA=" ChangeKey="AQAAAA=="/><t:DisplayName>For Helen</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAABCevK2AAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST9W"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA7jhrNAAA=" ChangeKey="AQAAAA=="/><t:DisplayName>Test</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAABCevK3AAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST9Y"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA7jhrNAAA=" ChangeKey="AQAAAA=="/><t:DisplayName>test 123</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA7jhrOAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST9a"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA7jhrNAAA=" ChangeKey="AQAAAA=="/><t:DisplayName>Test for CMOfficeDev</t:DisplayName><t:TotalCount>2</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAABCevK4AAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST9c"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA7jhrNAAA=" ChangeKey="AQAAAA=="/><t:DisplayName>XXXXXXXXXXXXXXXXXXXXXX</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFeAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST9e"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Archive</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder><t:CalendarFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAENAAA=" ChangeKey="AgAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEoiVd"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Appointment</t:FolderClass><t:DisplayName>Calendar</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>2</t:ChildFolderCount><t:DistinguishedFolderId>calendar</t:DistinguishedFolderId></t:CalendarFolder><t:CalendarFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAACSTduAAA=" ChangeKey="AgAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEoiVf"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAENAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Appointment</t:FolderClass><t:DisplayName>Australia holidays</t:DisplayName><t:TotalCount>136</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount></t:CalendarFolder><t:CalendarFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAACSTdtAAA=" ChangeKey="AgAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEoiVh"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAENAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Appointment.Birthday</t:FolderClass><t:DisplayName>Birthdays</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount></t:CalendarFolder><t:ContactsFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEOAAA=" ChangeKey="AwAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEojEN"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Contact</t:FolderClass><t:DisplayName>Contacts</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>7</t:ChildFolderCount><t:DistinguishedFolderId>contacts</t:DistinguishedFolderId></t:ContactsFolder><t:ContactsFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFGAAA=" ChangeKey="AwAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST9o"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEOAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Contact.MOC.QuickContacts</t:FolderClass><t:DisplayName>{06967759-274D-40B2-A3EB-D7F9E73727D7}</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:DistinguishedFolderId>quickcontacts</t:DistinguishedFolderId></t:ContactsFolder><t:ContactsFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFHAAA=" ChangeKey="AwAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST9q"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEOAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Contact.MOC.ImContactList</t:FolderClass><t:DisplayName>{A9E2BC46-B3A0-4243-B315-60D991004455}</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:DistinguishedFolderId>imcontactlist</t:DistinguishedFolderId></t:ContactsFolder><t:ContactsFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFMAAA=" ChangeKey="AwAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST9s"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEOAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Contact.Company</t:FolderClass><t:DisplayName>Companies</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:DistinguishedFolderId>companycontacts</t:DistinguishedFolderId></t:ContactsFolder><t:ContactsFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFLAAA=" ChangeKey="AwAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST9u"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEOAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Contact.GalContacts</t:FolderClass><t:DisplayName>GAL Contacts</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount></t:ContactsFolder><t:ContactsFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFKAAA=" ChangeKey="AwAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST9w"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEOAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Contact.OrganizationalContacts</t:FolderClass><t:DisplayName>Organizational Contacts</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount></t:ContactsFolder><t:ContactsFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFJAAA=" ChangeKey="AwAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST9y"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEOAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Contact.PeopleCentricConversationBuddies</t:FolderClass><t:DisplayName>PeopleCentricConversation Buddies</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:DistinguishedFolderId>peoplecentricconversationbuddies</t:DistinguishedFolderId></t:ContactsFolder><t:ContactsFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAE5AAA=" ChangeKey="AwAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEojEO"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEOAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Contact.RecipientCache</t:FolderClass><t:DisplayName>Recipient Cache</t:DisplayName><t:TotalCount>12</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:DistinguishedFolderId>recipientcache</t:DistinguishedFolderId></t:ContactsFolder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEhAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST92"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Configuration</t:FolderClass><t:DisplayName>Conversation Action Settings</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAE4AAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEoiVj"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:DisplayName>Conversation History</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>1</t:ChildFolderCount><t:DistinguishedFolderId>conversationhistory</t:DistinguishedFolderId><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFSAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAAA/b8YB"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAE4AAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.SkypeTeams.Message</t:FolderClass><t:DisplayName>Team Chat</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEKAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEoiVl"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Deleted Items</t:DisplayName><t:TotalCount>34</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:DistinguishedFolderId>deleteditems</t:DistinguishedFolderId><t:UnreadCount>32</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEPAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEoiVn"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Drafts</t:DisplayName><t:TotalCount>2</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:DistinguishedFolderId>drafts</t:DistinguishedFolderId><t:UnreadCount>0</t:UnreadCount></t:Folder><t:ContactsFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFFAAA=" ChangeKey="AwAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST9+"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Contact</t:FolderClass><t:DisplayName>ExternalContacts</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount></t:ContactsFolder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEgAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAAA/b8X0"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Files</t:FolderClass><t:DisplayName>Files</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEMAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEojNB"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Inbox</t:DisplayName><t:TotalCount>165</t:TotalCount><t:ChildFolderCount>1</t:ChildFolderCount><t:DistinguishedFolderId>inbox</t:DistinguishedFolderId><t:UnreadCount>123</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3bJPOAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEogQw"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEMAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>wwwww</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>1</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAABEtIfTAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEojPR"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3bJPOAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>eee</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAABEtIfMAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEoiVp"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>is this in the root</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEQAAA=" ChangeKey="BgAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST+C"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Journal</t:FolderClass><t:DisplayName>Journal</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:DistinguishedFolderId>journal</t:DistinguishedFolderId><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAETAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST+E"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Junk Email</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:PolicyTag IsExplicit="true">3dbb5f39-dc76-4916-9db3-fa9191760a55</t:PolicyTag><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3bJPDAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEoiVr"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Junk Email</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:DistinguishedFolderId>junkemail</t:DistinguishedFolderId><t:PolicyTag IsExplicit="true">3dbb5f39-dc76-4916-9db3-fa9191760a55</t:PolicyTag><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAERAAA=" ChangeKey="BQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST+I"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.StickyNote</t:FolderClass><t:DisplayName>Notes</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:DistinguishedFolderId>notes</t:DistinguishedFolderId><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAELAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST+K"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Outbox</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:DistinguishedFolderId>outbox</t:DistinguishedFolderId><t:UnreadCount>0</t:UnreadCount></t:Folder><t:ContactsFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAGEHAAA=" ChangeKey="AwAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST+M"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Contact</t:FolderClass><t:DisplayName>PersonMetadata</t:DisplayName><t:TotalCount>12</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:DistinguishedFolderId>personmetadata</t:DistinguishedFolderId></t:ContactsFolder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3bJPFAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST+O"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Configuration</t:FolderClass><t:DisplayName>Quick Step Settings</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3bJPEAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST+Q"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note.OutlookHomepage</t:FolderClass><t:DisplayName>RSS Feeds</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEJAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEoiVt"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Sent Items</t:DisplayName><t:TotalCount>107</t:TotalCount><t:ChildFolderCount>1</t:ChildFolderCount><t:DistinguishedFolderId>sentitems</t:DistinguishedFolderId><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3bJPGAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEoiVv"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEJAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Content Manager</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>2</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3bJPMAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEoiVx"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3bJPGAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Transitie</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3bJPHAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEoiVz"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3bJPGAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Transition</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3a5OaAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST+a"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:DisplayName>Social Activity Notifications</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3a4uaAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST+c"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Sync Issues</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>3</t:ChildFolderCount><t:DistinguishedFolderId>syncissues</t:DistinguishedFolderId><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3a4ubAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST+e"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3a4uaAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Conflicts</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:DistinguishedFolderId>conflicts</t:DistinguishedFolderId><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3a4ucAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST+g"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3a4uaAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Local Failures</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:DistinguishedFolderId>localfailures</t:DistinguishedFolderId><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3a4udAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST+i"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA3a4uaAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Note</t:FolderClass><t:DisplayName>Server Failures</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:DistinguishedFolderId>serverfailures</t:DistinguishedFolderId><t:UnreadCount>0</t:UnreadCount></t:Folder><t:TasksFolder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAESAAA=" ChangeKey="BAAAABYAAACjhKCg59RNQ4YnJZN5sQewAABEoiV1"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.Task</t:FolderClass><t:DisplayName>Tasks</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:DistinguishedFolderId>tasks</t:DistinguishedFolderId><t:UnreadCount>0</t:UnreadCount></t:TasksFolder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA/cMQSAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST+m"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF.WebExtension</t:FolderClass><t:DisplayName>WebExtAddIns</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>1</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA/cMQTAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST+o"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA/cMQSAAA=" ChangeKey="AQAAAA=="/><t:DisplayName>bbf8f785-ac58-4fa1-a679-1d2a00bec93c</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>1</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA/cMQUAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST+q"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAA/cMQTAAA=" ChangeKey="AQAAAA=="/><t:DisplayName>Content Manager</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFZAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST+s"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAEIAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF</t:FolderClass><t:DisplayName>Yammer Root</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>3</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFcAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST+u"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFZAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF</t:FolderClass><t:DisplayName>Feeds</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFaAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST+w"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFZAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF</t:FolderClass><t:DisplayName>Inbound</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder><t:Folder><t:FolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFbAAA=" ChangeKey="AQAAABYAAACjhKCg59RNQ4YnJZN5sQewAABDST+y"/><t:ParentFolderId Id="AAMkADJlMTUzYmY1LWJiNTMtNGMyNS1hNjhjLTUwZGZiMjQ0YmJkNAAuAAAAAADmFIH7IW9TSrtTBZjbYsfzAQCjhKCg59RNQ4YnJZN5sQewAAAAAAFZAAA=" ChangeKey="AQAAAA=="/><t:FolderClass>IPF</t:FolderClass><t:DisplayName>Outbound</t:DisplayName><t:TotalCount>0</t:TotalCount><t:ChildFolderCount>0</t:ChildFolderCount><t:UnreadCount>0</t:UnreadCount></t:Folder></t:Folders></m:RootFolder></m:FindFolderResponseMessage></m:ResponseMessages></m:FindFolderResponse></s:Body></s:Envelope>',
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
});
