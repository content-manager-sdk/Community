# Executable Addin
The executuable addin uses command line arguments to get the database ID and selected URIs.  If you include the database ID (see below) the paramters will be in this format: --dbid J1 --uris 9000000001,9000000002

## Warning
As the URIS are passed as a comma seperated string there is a limit on the number that will be passed.  I believe it is 200, make sure you test this.

## Rationale
One reason to use the executable over a .Net DLL is that you can store the executable once on a shared drive and have all users access the same instance remotely.  In general the .Net addin provides better functionality.

## Points of interest
This is a very simple sample.  The points of interest are:
 - the console parameters are retrieved in App.cs, which also loads MainWindow
 - prefer 32 bit has been de-selected, you may need to change this if you are running 32 bit
 
## Example configuration screen
![configuration](exeaddin.PNG)