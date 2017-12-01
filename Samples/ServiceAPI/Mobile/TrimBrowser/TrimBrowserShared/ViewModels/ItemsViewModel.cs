using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Threading.Tasks;

using Xamarin.Forms;

namespace TrimBrowser
{
    public class ItemsViewModel : BaseViewModel
    {
        public ObservableCollection<Item> Items { get; set; }
        public Command LoadItemsCommand { get; set; }

        public Command LoadNextPageCommand { get; set; }

        public string SearchText { get; set; }

        public SearchClauseDetails SearchClause { get; set; }

        private ObservableCollection<SearchClauseDetails> quickSearchItems;
        public IEnumerable<SearchClauseDetails> QuickSearchItems
        {
            get
            {
                if (quickSearchItems.Count == 0 && DataStore.IsAuthenticated())
                {
                    var items = DataStore.GetSearchShortcuts();

                    foreach (var searchClause in items.Result)
                    {
                        quickSearchItems.Add(new SearchClauseDetails(searchClause));
                    }
                }

                return quickSearchItems;
            }
        }


        private bool isQuickSearchOn;
        public bool IsQuickSearchOn
        {
            get { return isQuickSearchOn; }
            set
            {
                if (SetProperty(ref isQuickSearchOn, value))
                {
                    IsTextSearchOn = !isQuickSearchOn;
                }
            }
        }

        private bool loggedIn;
        public bool LoggedIn
        {
            get { return loggedIn; }
            set
            {
                SetProperty(ref loggedIn, value);
            }
        }

        private bool isTextSearchOn;
        public bool IsTextSearchOn
        {
            get { return isTextSearchOn; }
            set
            {
                SetProperty(ref isTextSearchOn, value);

            }
        }

        public ItemsViewModel()
        {
            IsTextSearchOn = true;
            Title = "Browse";
            Items = new ObservableCollection<Item>();
            LoadItemsCommand = new Command(async (usePicker) => await ExecuteLoadItemsCommand(usePicker));
            LoadNextPageCommand = new Command(async () => await ExecuteNextPageCommand());


            MessagingCenter.Subscribe<NewItemPage, Item>(this, "AddItem", async (obj, item) =>
            {
                var _item = item as Item;

                Item newItem = await DataStore.AddItemAsync(_item);

                Items.Insert(0, newItem);

            });

            MessagingCenter.Subscribe<LoginPage, LoginDetails>(this, "Login", async (obj, item) =>
            {
                var _item = item as LoginDetails;

               // await Task.Run(() =>
               // {
                 //   TaskCompletionSource<bool> doneSource = new TaskCompletionSource<bool>();
                 //   Device.BeginInvokeOnMainThread(async () =>
                 //   {
                        try
                    {
                        LoggedIn = DataStore.Login(_item);
                    }
                    catch (Exception ex)
                    {
                        this.ErrorMessage = ex.Message;
                    }
                  //  });
                    this.OnPropertyChanged("QuickSearchItems");
                });

         //   });

            quickSearchItems = new ObservableCollection<SearchClauseDetails>();
        }

        async Task ExecuteNextPageCommand()
        {
            if (IsBusy)
                return;

            IsBusy = true;

            try
            {
                
                var items = await DataStore.GetItemsAsync(searchText, true);
                foreach (var item in items)
                {
                    Items.Add(item);
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
            }
            finally
            {
                IsBusy = false;
            }
        }

        string searchText;
        async Task ExecuteLoadItemsCommand(object usePicker)
        {

            if (IsBusy)
                return;

            IsBusy = true;

            try
            {
                Items.Clear();

                searchText = this.SearchText;
                if (Convert.ToBoolean(usePicker) == true)
                {
                    searchText = this.SearchClause.Name;
                }

                var items = await DataStore.GetItemsAsync(searchText, true);
                foreach (var item in items)
                {
                    Items.Add(item);
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
            }
            finally
            {
                IsBusy = false;
            }
        }
    }
}
