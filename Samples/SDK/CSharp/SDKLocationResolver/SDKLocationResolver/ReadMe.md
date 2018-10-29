# .Net SDK Location Resolver
As of 93 HP.HPTRIM.SDK.dll is not longer installed in the GAC by the Content Manager installer.  Whe writing an SDK application you will either need to ship HP.HPTRIM.SDK.dll in the same folder as your binaries or dynamicaly load it.  The benefit of dynamic loading is that you are able to run the same application against multiple different versions of Content Manager.

## Operation
The code looks in the registry to find the location of the Content Manager binaries as set by the installation routine.  It then intercepts the assembly loading process to specify the correct location.