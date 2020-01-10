# UnifiedLogViewer Plugin For TailViewer

# Overview

Content Manager is made up of a variety of components including:

- workgroup server (WGS)
- desktop client
- web service
- WebDrawer
- DataPort
- Office Integrations
- Email Link
- and more...

The hub for all of these components is the WGS but other than that they are relatively independent of each other and keep independent log files. When it comes to diagnosing a problem it is sometimes the case that you will need to view the logs of one or more components together (e.g. the web service and WGS). This plugin for TailViewer harmonizes the different formats of the log files and allows them to be merged and viewed as a single log file.

# Using the plugin

To use the plugin:

- install [Tailviewer](https://kittyfisto.github.io/Tailviewer/)
- download the plugin from [published](Published/UnifiedLogViewerPlugins.1.1.tvp)
- copy it to the Tailviewer plugins folder (e.g. C:\Program Files\Tailviewer\Plugins)

# Tailviewer Overview

- Tailviewer is an open source log file viewer for Windows that allows you to view text based log files both offline and in real-time.
- Plugins are a way for you to programmatically extend Tailviewer.
- These are a zip archive containing a description of the plugin (author, website, version, description etc)
- Consist of at least one .NET assembly which is loaded by Tailviewer upon startup.
- Tailviewer is supported on Windows 7, 8 and 10 and requires .NET 4.5 or higher.

# Important

Before you build the C# samples plugin you must use the reference of any required files (like Tailviewer.Api.dll and Tailviewer.Core.dll)
from your Tailviewer folder located under \Program Files\Tailviewer

# Getting Started for Development

1. Download link: - https://kittyfisto.github.io/Tailviewer/
2. In order to start developing a plugin, you need to install Visual Studio (any version since Visual Studio 2012 will do) and create a new Class Library targeting at least .NET 4.5.2:
3. Once created, you need to add a reference to Tailviewer.API. You can download this package manually from nuget.org or you can install it in Visual Studio by right clicking your project in the Solution Explorer and clicking "Managed Nuget Packages...". Make sure to select "Include prerelease".

# Other resources

Documentation to develop and Debug plugins are available below.
https://github.com/Kittyfisto/Tailviewer/blob/master/docs/DevelopingPlugins.md
