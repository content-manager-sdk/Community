using HP.HPRM.OfficeIntegration.ServiceAPI;
using HP.HPTRIM.Service.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ThinOfficePlugin
{
    /*
    public class SAMLThinOfficePlugin //: IRequestPlugin
    {
        private static List<Cookie> ids = new List<Cookie>();
        private static Form form;

        [DllImport("wininet.dll", SetLastError = true)]
        public static extern bool InternetGetCookieEx(
            string url,
            string cookieName,
            StringBuilder cookieData,
            ref int size,
            Int32 dwFlags,
            IntPtr lpReserved);

        private const Int32 InternetCookieHttponly = 0x2000;

        /// <summary>
        /// Gets the URI cookie container.
        /// </summary>
        /// <param name="uri">The URI.</param>
        /// <returns></returns>
        public static CookieContainer GetUriCookieContainer(Uri uri)
        {
            CookieContainer cookies = null;
            // Determine the size of the cookie
            int datasize = 8192 * 16;
            StringBuilder cookieData = new StringBuilder(datasize);
            if (!InternetGetCookieEx(uri.ToString(), null, cookieData, ref datasize, InternetCookieHttponly, IntPtr.Zero))
            {
                if (datasize < 0)
                    return null;
                // Allocate stringbuilder large enough to hold the cookie
                cookieData = new StringBuilder(datasize);
                if (!InternetGetCookieEx(
                    uri.ToString(),
                    null, cookieData,
                    ref datasize,
                    InternetCookieHttponly,
                    IntPtr.Zero))
                    return null;
            }
            if (cookieData.Length > 0)
            {
                cookies = new CookieContainer();
                cookies.SetCookies(uri, cookieData.ToString().Replace(';', ','));
            }
            return cookies;
        }

        [STAThread]
        public static List<Cookie> GessionCookies()
        {
            if (ids.Count == 0)
            {

                WebBrowser webBrowser = new WebBrowser();
                webBrowser.Url = new Uri("https://portalpoc.identityhub.com.au/oamfed/idp/initiatesso?providerid=https://labtest.citadelix.com/HPEContentManager/&redirect=https%3a%2f%2flabtest.citadelix.com%2fHPEContentManager");
                webBrowser.Width = 600;
                webBrowser.Height = 700;
                webBrowser.Show();

                webBrowser.Navigated += WebBrowser_Navigated;


                form = new Form();
                form.Width = 600;
                form.Height = 700;
                form.VerticalScroll.Enabled = true;

                form.Controls.Add(webBrowser);
                var result = form.ShowDialog();


                form.Close();
            }
            return ids;
        }


        private static void WebBrowser_Navigated(object sender, WebBrowserNavigatedEventArgs e)
        {
            Console.WriteLine(e.Url);


            var cookieContainer = GetUriCookieContainer(e.Url);

            var cookies = cookieContainer.GetCookies(e.Url);

            foreach (System.Net.Cookie cookie in cookies)
            {
                if (cookie.Name == "ss-id" || cookie.Name == "ss-pid")
                {
                    ids.Add(cookie);
                }

                if (ids.Count == 2)
                {
                    (sender as WebBrowser).Stop();
                    form.DialogResult = DialogResult.OK;
                }
            }

        }


        public bool BeforeRequest(TrimClient trimClient)
        {
            var sessionCookies = GessionCookies();
            if (sessionCookies.Count == 2)
            {
                trimClient.ServiceClient.CookieContainer.Add(sessionCookies[0]);
                trimClient.ServiceClient.CookieContainer.Add(sessionCookies[1]);
                return true;
            }

            return false;
        }
    }
    */
}
