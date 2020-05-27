# Dynamic SDK Load
Rather than hard wire a reference to HP.HPTRIM.SDK you can choose to not copy it locally then load it from the Content Manager install folder dynamically.

## Notes
In this sample:
 - After adding a reference to HP.HPTRIM.SDK.dll 'Copy Local' is set to false.
 - Binary location is set in app.config, as notes in comments (in program.cs) it is probably best to source the binary location from the registry.
 
 ## Locating the SDK Dll
 In this sample we store the location of the CM DLLs in the app.config.  On an installed instance of CM it is probably better to find the DLL by referring to the registry setting:
 ```
 Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Micro Focus\Content Manager\MSISettings\INSTALLDIR
 ```