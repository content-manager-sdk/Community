# Executable Addin Large Selection
If you require the executable add-in to support large numbers of selected records then CM 9.4 has an option to 'send tagged URIs as a temporary file.  This sample uses command line arguments to get the database ID and selected URIs.  If you include the database ID (see below) the paramters will be in this format: ```--dbid J1 --uris c:\Users\USER\AppData\Local\Micro Focus\Content Manager\TEMP\HPTRIM.340064\t0001CR5.txt```

## Rationale
One reason to use the executable over a .Net DLL is that you can store the executable once on a shared drive and have all users access the same instance remotely.  In general the .Net addin provides better functionality.

 
## Example configuration screen
![configuration](exeaddin.PNG)