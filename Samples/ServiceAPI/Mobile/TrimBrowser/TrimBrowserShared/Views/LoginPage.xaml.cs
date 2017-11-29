using Plugin.Media;
using System;
using System.Collections.Generic;
using System.IO;
using Xamarin.Forms;

namespace TrimBrowser
{
    public partial class LoginPage : ContentPage
    {
        public LoginDetails Item { get; set; }

        public LoginPage() : this(null)
        {

        }

        public LoginPage(string filePath)
        {
            InitializeComponent();



            BindingContext = this;

            Item = new LoginDetails();


        }






        async void Login_Clicked(object sender, EventArgs e)
        {            
            MessagingCenter.Send(this, "Login", Item);
            await Navigation.PopToRootAsync();
        }
    }
}
