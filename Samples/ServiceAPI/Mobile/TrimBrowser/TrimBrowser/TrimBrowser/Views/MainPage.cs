using System;

using Xamarin.Forms;

namespace TrimBrowser4
{
    public class MainPage : CarouselPage
    {
        public MainPage()
        {
            ContentPage itemsPage, aboutPage = null;
            this.ToolbarItems.Add(new ToolbarItem() { Text = "+" });
            //switch (Device.RuntimePlatform)
            //{
            //    case Device.iOS:
            //        //itemsPage = new NavigationPage(new ItemsPage())
            //        //{
            //        //    Title = "Browse"
            //        //};

            //        //aboutPage = new NavigationPage(new AboutPage())
            //        //{
            //        //    Title = "About"
            //        //};
            //        //itemsPage.Icon = "tab_feed.png";
            //        //aboutPage.Icon = "tab_about.png";
            //        break;
            //    default:
            //        itemsPage = new ItemsPage()
            //        {
            //            Title = "Browse"
            //        };

            //        aboutPage = new AboutPage()
            //        {
            //            Title = "About"
            //        };
            //        break;
            //}

            itemsPage = new ItemsPage()
            {
                Title = "Browse"
            };

            aboutPage = new ItemsPage()
            {
                Title = "Browse 2"
            };

            Children.Add(  itemsPage);
            Children.Add(aboutPage);

            //Title = Children[0].Title;

        }



        protected override void OnCurrentPageChanged()
        {
            base.OnCurrentPageChanged();
            Title = CurrentPage?.Title ?? string.Empty;
        }
    }
}
