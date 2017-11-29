using HP.HPTRIM.SDK;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;

namespace CreateLocation
{
    public class CreateLocationVM : BaseViewModel, IDisposable
    {
        private Database _database;

        public CreateLocationVM()
        {
            TrimApplication.Initialize();
            _database = new Database();
            _database.Connect();

            this.PropertyChanged += CreateLocationVM_PropertyChanged;

            NewLocationType = (int)LocationType.Person;

        }

        private void CreateLocationVM_PropertyChanged(object sender, System.ComponentModel.PropertyChangedEventArgs e)
        {
            if (e.PropertyName == "NewLocationType")
            {
                DisplayName = null;
                if (NewLocationType > 0)
                {
                    NewLocation = new Location(_database, (LocationType)NewLocationType);
                }
                else
                {
                    NewLocation = null;
                }
            }
        }

        IList<EnumItem> _locationTypes = null;
        public IList<EnumItem> LocationTypes
        {
            get
            {
                if (_locationTypes == null)
                {
                    HP.HPTRIM.SDK.Enum locTypeEnum = new HP.HPTRIM.SDK.Enum(AllEnumerations.LocationType, _database);
                    _locationTypes = new List<EnumItem>(locTypeEnum.GetItemArray(null, true).Where(ei => ei.Value > 0));

                }
                return _locationTypes;
            }
        }

        private PropertyCaptions propertyCaptions;
        public PropertyCaptions PropertyCaptions
        {
            get
            {
                return propertyCaptions ?? (propertyCaptions = new PropertyCaptions(_database));
            }
        }   


        private int newLocationType;
        public int NewLocationType
        {

            get { return newLocationType; }
            set
            {

                SetProperty(ref newLocationType, value);
            }
        }

        private string displayName;
        public string DisplayName
        {

            get { return displayName; }
            set
            {
                SetProperty(ref displayName, value);
            }
        }

        private Location newLocation;
        public Location NewLocation
        {

            get { return newLocation; }
            set
            {
                SetProperty(ref newLocation, value);
            }
        }


        private ICommand saveCommand;
        public ICommand SaveCommand
        {
            get
            {
                return saveCommand ?? (saveCommand = new RelayCommand(() =>
                {
         
                    string sn = NewLocation.GivenNames;
                    NewLocation.Save();
                    DisplayName = NewLocation.SortName;

                }));
            }
        }


        public void Dispose()
        {
            if (_database != null)
            {
                _database.Dispose();
                _database = null;
            }
        }
    }
}
