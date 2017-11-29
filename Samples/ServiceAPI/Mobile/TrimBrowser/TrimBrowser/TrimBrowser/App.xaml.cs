using System;
using System.IO;
using Xamarin.Forms;

namespace TrimBrowser4
{
    public partial class App : Application
    {
        public App()
        {
            InitializeComponent();

            //if (Device.RuntimePlatform == Device.iOS)
            //    MainPage = new MainPage();
            //else
            //    MainPage = new NavigationPage(new MainPage());

            if (Device.RuntimePlatform == Device.iOS)
                MainPage = new MainPage();
            else
                MainPage = new NavigationPage(new ItemsPage());
            
        }

        public void NewRecordWithFile( string filePath) 
        {
          (MainPage as IPageContainer<Page>).CurrentPage.Navigation.PushAsync(new NewItemPage(filePath));
        }
    }
}