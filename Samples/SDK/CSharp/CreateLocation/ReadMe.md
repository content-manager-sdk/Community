# Create New Location
This is a very simple sample, it allows you to choose a Location Type and then create a Location of that type.

## Where to look
Code of interest includes:
 * CreateLocationVM.cs which contains the code to create the Location,
 * PropertyCaptions.cs to fetch property captions from CM from with your XAML
 * MainWindow.xaml which binds to the VM to display the form and create a new Location.

## The project
This project is a simple WPF user interface data binding and a rough approximation of the MVVM pattern.

## Setup
To use this sample:
 - edit the database ID in app.config
 - to create documents with a RecordType other than Document edit the recordType in App.config