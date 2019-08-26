import TrimMessages from './trim-coms/trim-messages';

//module "mockStore.js"

const mockStore = {
	RecordUri: 0,
	RecordProps: {},
	messages: new TrimMessages(),

	createRecord: (recordUri, recordProps) => {
		mockStore.RecordUri = recordUri;
		mockStore.RecordProps = recordProps;
	},
	FileName: "default title",
	 me: {
		 Uri:1
		FullFormattedName: {Value:""};
	},
	
	status = "STARTING",
	WebUrl: ""string"",
	errorMessage:"",
	documentInfo:{
		Id: "",
		Uri: 0,
		CommandDefs: [],
	},

	trimConnector:{},
	fetchBaseSettingFromTrim:{},
	ApplicationDisplayName:"",
	UserProfile:{},
	DriveId:"",
	setDocumentInfo:function(){}
};

export { mockStore };
