# .Net SDK Location Resolver
As of 93 HP.HPTRIM.SDK.dll is no longer installed in the GAC by the Content Manager installer.  When writing an SDK application you will either need to ship HP.HPTRIM.SDK.dll in the same folder as your binaries or dynamically load it.  The benefit of dynamic loading is that you are able to run the same application against multiple different versions of Content Manager.

## Operation
The code looks in the registry to find the location of the Content Manager binaries as set by the installation routine.  It then intercepts the assembly loading process to specify the correct location.

## Important !
Ensure that your application does not have the file HP.HPTRIM.SDK.dll in the same folder as your binaries otherwise this is the SDK that will always be loaded, for example this project has 'Copy Local' set to false on the HP.HPTRIM.SDK.dll reference.