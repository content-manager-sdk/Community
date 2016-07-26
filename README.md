# Welcome to the HPECM-Community repo!
## Welcome
To start with this site is mostly about sample code for the .Net SDK.  It may become more than this depending on interest and time.

## Important
Before you build the C# samples you must copy HP.HPTRIM.SDK.dll and HP.HPTRIM.SDK.xml from your HPE Content Manager folder to \Samples\CSharp\lib

## 32 versus 64 bit
As the SDK is a wrapper around the underlying unmanaged code it needs to know whether to run in 32 or 64 bit.  All samples in this site are built to run 64 bit.  To run in 32 bit mode change enable the option 'Prefer 32-bit' in each Project - Properties - Build settings

## Sample code compatibility
The sample code in this site should build against the current release of Content Manager (CM) (as at the time of writing 9.0).  In general most code should also work with older versions of CM, maybe with a few edits.  To change CM version replace Samples/CSharp/lib/HP.HPTRIM.SDK.DLL.

## Other resources
The .Net SDK documentation is available for version [83](http://sdk.hpecm.xyz/83/index.html) and [90](http://sdk.hpecm.xyz/90/index.html).

## List Sample Projects

| Project            | Description                                                                            |
| ------------------ |:--------------------------------------------------------------------------------------:|
| [TrimUI](Samples/CSharp/TrimUI)             | A simple WPF application to demonstrate the user interferface classes in the SDK.      |
| CreateNewDocument  | A simple application demonstrating creation of a new Record from a RecordType.         | 
| BulkDataLoader     | Combines the BulkDataLoader and Origin to create a high performance import of Records. |
| ExecutableAddin    | Sample demonstrates passing parameters via the command line for an EXE addin.          |
