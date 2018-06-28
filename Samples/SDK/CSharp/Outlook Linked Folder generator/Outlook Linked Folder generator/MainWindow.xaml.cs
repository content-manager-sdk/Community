using Microsoft.Exchange.WebServices.Data;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using SDK = HP.HPTRIM.SDK;

namespace FolderGenerator
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            SDK.TrimApplication.Initialize();
            InitializeComponent();

            CheckinStyles = new ObservableCollection<CheckinStyle>();

            populateList();

            this.DataContext = this;
        }

        private void populateList()
        {
           // Get a list of all Check in Styles valid to be used in Outlook.  
           // The Checkin Place is where we store the Outlook folder information so we only return Check in Styles that do not have a Checkin Place
            using (SDK.Database database = new SDK.Database())
            {
                database.Connect();

                List<long> stylesWithAPlace = new List<long>();

                var placeSearch = new SDK.TrimMainObjectSearch(database, SDK.BaseObjectTypes.CheckinPlace);
                SDK.TrimSearchClause ownerClause = new SDK.TrimSearchClause(database, SDK.BaseObjectTypes.CheckinPlace, SDK.SearchClauseIds.CheckinPlaceOwner);
                ownerClause.SetCriteriaFromObject(database.CurrentUser);
                SDK.TrimSearchClause typeClause = new SDK.TrimSearchClause(database, SDK.BaseObjectTypes.CheckinPlace, SDK.SearchClauseIds.CheckinPlaceType);
                typeClause.SetCriteriaFromString(SDK.CheckinPlaceTypes.MailForClientProcessing.ToString());

                placeSearch.AddSearchClause(ownerClause);
                placeSearch.AddSearchClause(typeClause);
                placeSearch.And();

                foreach (SDK.CheckinPlace checkinPlace in placeSearch)
                {
                    stylesWithAPlace.Add(checkinPlace.CheckinAs.Uri);
                }


                var styleSearch = new SDK.TrimMainObjectSearch(database, SDK.BaseObjectTypes.CheckinStyle);
                styleSearch.SetPurpose((int)SDK.CheckinToolPurposes.UserCheckin);
                styleSearch.SelectAll();
                SDK.TrimSearchClause matterClause = new SDK.TrimSearchClause(database, SDK.BaseObjectTypes.CheckinStyle, SDK.SearchClauseIds.CheckinStyleMatterTemplate);
                styleSearch.AddSearchClause(matterClause);
                styleSearch.Not();
                styleSearch.And();

                foreach (SDK.CheckinStyle checkinStyle in styleSearch)
                {
                    if (!stylesWithAPlace.Contains(checkinStyle.Uri))
                    {
                        CheckinStyles.Add(new CheckinStyle(checkinStyle));
                    }
                }

            }
        }

        public ObservableCollection<CheckinStyle> CheckinStyles { get; set; }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            var service = new ExchangeService();

            if (this.DefaultCredentials.IsChecked == true)
            {
                service.UseDefaultCredentials = true;
            } else
            {
                service.Credentials = new WebCredentials(this.Email.Text, this.Password.Password);
            }
            service.AutodiscoverUrl(this.Email.Text);
                             
            

            int counter = 0;

            using (SDK.Database database = new SDK.Database())
            {
                database.Connect();
                foreach (var checkinStyle in CheckinStyles)
                {
                    if (checkinStyle.Link)
                    {
                        Folder folder = new Folder(service);
                        folder.DisplayName = checkinStyle.Name;
                        folder.Save(WellKnownFolderName.Inbox);

                        SDK.CheckinStyle sourceStyle = new SDK.CheckinStyle(database, checkinStyle.GetUri());

                        AlternateId alternateId = new AlternateId();
                        alternateId.Format = IdFormat.EwsId;
                        alternateId.Mailbox = this.Email.Text;
                        alternateId.UniqueId = folder.Id.UniqueId;

                        string id = ((AlternateId)service.ConvertId(alternateId, IdFormat.HexEntryId)).UniqueId; // convert the folder ID we get from EWS to the Id Outlook expects

                        var place = sourceStyle.FindOrCreatePlace(SDK.CheckinPlaceTypes.MailForClientProcessing, id);

                        // the Checkin Place name must include the name of the Outlook profile to cater for environments that use multiple Outlook Profiles
                        place.Name = $"{place.Name}:{this.ProfileName.Text}";
                        place.Save();

                        counter++;
                    }
                }
            }

            MessageBox.Show($"Created {counter} folders.");
        }
    }
}
