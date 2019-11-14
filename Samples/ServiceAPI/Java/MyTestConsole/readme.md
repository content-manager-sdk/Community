# ServiceAPI Java client

This sample demonstrates using the generated client classes to interact with the ServiceAPI.

# Important - Version support

The techniques used in this sample on work in ServiceAPI 9.0 and later.

# Eclipse plugin

The dto classes in this sample are generated out of the ServiceAPI metadata using the [Eclipse ServiceStack plugin](https://github.com/ServiceStack/ServiceStack.Java/tree/master/src/ServiceStackEclipse). If you are not using Maven then you will need to [manually download](https://github.com/ServiceStack/ServiceStack.Java/tree/master/src/ServiceStackEclipse#using-the-plugin-without-maven) two support JAR files.

# Testing the metadata

The metadata URL that the plugin calls will look similar to the sample below. If the plugin does not work for you then test that you can get to this URL from the machine on which you are using Eclipse.

```
http://YOUR_SERVER/ServiceAPI/types/java?Package=com.acme&GlobalNamespace=dto
```

# Impersonation

Java applications are often server side applications that handle their own authentication, in which case you might need to simply pass the authenticated user name to the ServiceAPI and expect it to trust you. To allow this follow these steps:

## Set hptrim.config in ServiceAPI

Set the trustedToImpersonate property to the name that the Java application will authenticate as.

```
<hptrim
  serviceFeatures="Razor,Html,Json,Xml,PredefinedRoutes"
  trustedToImpersonate="domain\\ImpersonatingUser"
  ...>
```

## Authenticate as the trusted user

In your application authenticate as the trusted user set in hotrim.config

```
		client = new JsonServiceClient("http://192.168.0.19/ServiceAPI");
		client.setCredentials("domain\\ImpersonatingUser", "YOUR_PASSWORD");
```

## Pass user name in HTTP header

Set a request filter on the client so that all request are sent with the userToImpersonate header containing the login name of the user you wish to run as.

```
		client.RequestFilter = new ConnectionFilter() {
            @Override
            public void exec(HttpURLConnection conn) {
                conn.addRequestProperty("userToImpersonate", "itu_tenduser");
            }
        };
```
