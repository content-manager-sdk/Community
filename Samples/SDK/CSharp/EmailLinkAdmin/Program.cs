
using HP.HPTRIM.ExchangeLink.SyncServer;


namespace EmailLinkAdmin
{
	class Program
	{
		static void Main(string[] args)
		{
			// folder within which the EmailLink preferences JSON is stored
			string workPath = @"C:\Micro Focus Content Manager\EmailLink";


			Preferences preferences = Preferences.Load(workPath);


			//Exchange user name and password
			var credentialsBasic = new MailDomainCredentials() { Domain = "test", Password = "test pwd", UserName = "test name", MailServer = MailServer.Exchange };
			credentialsBasic.EncryptPassword();
			preferences.DomainCredentials.Add(credentialsBasic);


			// Exchange OAuth
			var credentialsOAuth = new MailDomainCredentials()
			{
				Domain = "cmofficedev.onmicrosoft.com",
				ClientSecret = "MY SECRET",
				TenantID = "MY TENANT ID",
				ProjectID = "MY PROJECT ID",
				MailServer = MailServer.Exchange
			};

			// in a relase subsequent to 9.4 the Client Secret is encryptable and the following should be used to encrypt it.
			//credentialsOAuth.EncryptClientSecret();

			preferences.DomainCredentials.Add(credentialsOAuth);


			preferences.Save(workPath);
		}
	}
}
