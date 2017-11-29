using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using Xamarin.Forms;

namespace TrimBrowser
{
    public partial class ItemsPage : ContentPage
    {

        ItemsViewModel viewModel;

        public ItemsPage()
        {
            InitializeComponent();

            BindingContext = viewModel = new ItemsViewModel();

            ItemsListView.ItemAppearing += ItemsListView_ItemAppearing;

            SearchTextEntry.SearchButtonPressed += SearchText_Completed;


            SearchTextPicker.SelectedIndexChanged += SearchTextPicker_SelectedIndexChanged;
        }

        private void SearchTextPicker_SelectedIndexChanged(object sender, EventArgs e)
        {
            viewModel.LoadItemsCommand.Execute(true);
        }

        private void SearchText_Completed(object sender, EventArgs e)
        {

            viewModel.LoadItemsCommand.Execute(false);
        }

        private void ItemsListView_ItemAppearing(object sender, ItemVisibilityEventArgs e)
        {
            var itemTypeObject = e.Item as Item;
            if (viewModel.Items[viewModel.Items.Count-1] == itemTypeObject)
            {
                viewModel.LoadNextPageCommand.Execute(null);
            }
        }

        async void OnItemSelected(object sender, SelectedItemChangedEventArgs args)
        {
            var item = args.SelectedItem as Item;
            if (item == null)
                return;

            await Navigation.PushModalAsync(new ItemPage(item));

            // Manually deselect item
            ItemsListView.SelectedItem = null;
        }

        async void AddItem_Clicked(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new NewItemPage());
        }

        async void LoginItem_Clicked(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new LoginPage());
        }

        //protected override void OnAppearing()
        //{
        //    base.OnAppearing();

        //    if (viewModel.Items.Count == 0)
        //        viewModel.LoadItemsCommand.Execute(null);


        //}


    }
}