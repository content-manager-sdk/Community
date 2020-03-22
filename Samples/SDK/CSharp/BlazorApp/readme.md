# Blazor Sample App
[Blazor](https://dotnet.microsoft.com/apps/aspnet/web-apps/blazor) is a Microsoft technology that allows you to build interactive web UIs using C# instead of JavaScript.  This project is the result of creating a new Blazor project in Visual Studio 2019 and then adding some Content Manager SDK code.

## Interesting things
The interesting difference between this and a Razor Application (like Content Manager WebDrawer) is that, while it uses Razor syntax, it is a single page interactive application, not a tradition multi-page HTML web site.  Another interesting things is that it because we interact directly with the .Net SDK we get some of the benefits that do not come naturally with a web service, for example we can keep the connection open between requests and take better advantage of some of the pre-fetch optimisations in the searching.

## Warning
This is the result of my first 3 hours with Blazor, it is strictly sample code.  Think and test long and carefully before going near a production environment.

## Pre-requisites
Install .Net Core 3.1.102 or later, also while you do not need Visual Studio 2019 to create Blazor apps this project is built with VS 2019.  See the [getting started](https://docs.microsoft.com/en-us/aspnet/core/blazor/get-started?view=aspnetcore-3.1&tabs=visual-studio) page for more help.