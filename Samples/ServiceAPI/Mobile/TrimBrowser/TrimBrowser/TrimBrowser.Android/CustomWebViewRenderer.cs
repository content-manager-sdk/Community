using Android.Content;
using DisplayPDF.Droid;
using System.IO;
using System.Net;
using TrimBrowser.Controls;
using Xamarin.Forms;
using Xamarin.Forms.Platform.Android;

[assembly: ExportRenderer(typeof(CustomWebView), typeof(CustomWebViewRenderer))]
namespace DisplayPDF.Droid
{
    public class CustomWebViewRenderer : WebViewRenderer
    {
        public CustomWebViewRenderer(Context context) : base(context) { }

        protected override void OnElementChanged(ElementChangedEventArgs<WebView> e)
        {
            base.OnElementChanged(e);

            if (e.NewElement != null)
            {
                var customWebView = Element as CustomWebView;
                Control.Settings.AllowUniversalAccessFromFileURLs = true;

                string extension = Path.GetExtension(customWebView.Uri).Trim('.');

                if (extension.Equals("PDF", System.StringComparison.InvariantCultureIgnoreCase))
                {
                    Control.LoadUrl(string.Format("file:///android_asset/pdfjs/web/viewer.html?file={0}", string.Format("file://{0}", WebUtility.UrlEncode(customWebView.Uri))));
                }
                else
                {
                    Control.LoadUrl(string.Format("file://{0}", customWebView.Uri));
                }
            }
        }
    }
}