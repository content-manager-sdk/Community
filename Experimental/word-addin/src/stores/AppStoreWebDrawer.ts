import AppStoreBase from "./AppStoreBase";

export class AppStoreWebDrawer extends AppStoreBase {
	public fetchBaseSettingFromTrim = async (fromDialog: boolean) => {
		const tc = this.trimConnector;

		this.PreservedUris = [];

		try {
			this.setMe(await tc.getMe());
			this.setMessages(await tc.getMessages());
			this.setStatus("WAITING");
		} catch (error) {
			this.setError(error, "fetch base settings");
		}
	};

	public isWebApp(): boolean {
		return true;
	}
}
export default AppStoreWebDrawer;
