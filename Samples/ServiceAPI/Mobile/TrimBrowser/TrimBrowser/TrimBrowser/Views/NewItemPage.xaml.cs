using Plugin.Media;
using System;
using System.Collections.Generic;
using System.IO;
using Xamarin.Forms;

namespace TrimBrowser4
{
    public partial class NewItemPage : ContentPage
    {
        public Item Item { get; set; }

        public NewItemPage() : this(null)
        {

        }

        public NewItemPage(string filePath)
        {
            InitializeComponent();

            Item = new Item
            {
                Text = "Item name",
                Description = "This is an item description.",
                File = filePath
            };

            BindingContext = this;



            CameraButton.Clicked += CameraButton_Clicked;

            if (!string.IsNullOrWhiteSpace(Item.File))
            {
                PhotoImage.Source = ImageSource.FromFile(Item.File);
            }
        }







        private async void CameraButton_Clicked(object sender, EventArgs e)
        {

            await CrossMedia.Current.Initialize();

            if (!CrossMedia.Current.IsCameraAvailable || !CrossMedia.Current.IsTakePhotoSupported)
            {
                await DisplayAlert("No Camera", "No camera available.", "OK");
                return;
            }

            var file = await CrossMedia.Current.TakePhotoAsync(new Plugin.Media.Abstractions.StoreCameraMediaOptions
            {
                Directory = "Sample",
                Name = "test.jpg"
            });

            if (file == null)
                return;

            Item.File = file.Path;

            //  await DisplayAlert("File Location", file.Path, "OK");

            PhotoImage.Source = ImageSource.FromStream(() =>
            {
                var stream = file.GetStream();
                file.Dispose();
                return stream;
            });


        }

        async void Save_Clicked(object sender, EventArgs e)
        {
            MessagingCenter.Send(this, "AddItem", Item);
            await Navigation.PopToRootAsync();
        }
    }
}
