using System;
using System.Collections.Generic;
using System.Text;
using Xamarin.Forms;

namespace TrimBrowser
{
   public class ItemPage : TabbedPage
    {
        public ItemPage(Item item)
        {
            Page itemPage, previewPage = null;

            switch (Device.RuntimePlatform)
            {
                case Device.iOS:
                    itemPage = new NavigationPage(new ItemsPage())
                    {
                        Title = "Browse"
                    };

                    previewPage = new NavigationPage(new AboutPage())
                    {
                        Title = "About"
                    };
                    itemPage.Icon = "tab_feed.png";
                    previewPage.Icon = "tab_about.png";
                    break;
                default:
                    itemPage = new ItemDetailPage(new ItemDetailViewModel(item))
                    {
                        Title = "Details"
                    };

                    previewPage = new FilePreviewPage(new FilePreviewViewModel(item))
                    {
                        Title = "Preview"
                    };
                    break;
            }

            Children.Add(itemPage);
            Children.Add(previewPage);

            Title = Children[0].Title;

        }

        protected override void OnCurrentPageChanged()
        {
            base.OnCurrentPageChanged();
            Title = CurrentPage?.Title ?? string.Empty;
        }
    }
}
