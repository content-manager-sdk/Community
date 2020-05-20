using TRIM.ExchangeLink.SyncServer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmailLinkAdmin
{
	class Program
	{
		static void Main(string[] args)
		{
			string workPath = @"C:\HPTRIM\EmailLink";


			Preferences preferences = Preferences.Load(workPath);


			// Exchange user name and password
			//var credentialsBasic = new MailDomainCredentials() { Domain = "test", Password = "test pwd", UserName = "test name", MailServer = MailServer.Exchange };
			//credentialsBasic.EncryptPassword();
			//preferences.DomainCredentials.Add(credentialsBasic);


			// Exchange OAuth
			var credentialsOAuth = new MailDomainCredentials() { 
				Domain = "cmofficedev.onmicrosoft.com", 
				ClientSecret = "ejmg+qZ9-Dk_N-uq1NNXFSGzP5fet2m3", 
				TenantID= "08363ee4-6592-4325-9d5a-5a25e00d482b", 
				ProjectID= "09f0ec5c-87e9-4568-8b60-4eb3e20de75e", 
				MailServer = MailServer.Exchange };
			credentialsOAuth.EncryptClientSecret();
			preferences.DomainCredentials.Add(credentialsOAuth);


			preferences.Save(workPath);
		}
	}
}
