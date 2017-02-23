# ServiceAPI Java client
This sample demonstrates using the generates client classes to interact with the ServiceAPI.

# Important - Version support
The techiques used in this sample on work in ServiceAPI 9.0 and later.

#Eclipse plugin
The dto classes in this sample are generated out of the ServiceAPI metadata using the [Eclipse ServiceStack plugin](https://github.com/ServiceStack/ServiceStack.Java/tree/master/src/ServiceStackEclipse).  If you are not using Maven then you will need to [manually download](https://github.com/ServiceStack/ServiceStack.Java/tree/master/src/ServiceStackEclipse#using-the-plugin-without-maven) two support JAR files.

#Testing the metadata
The metadata URL that the plugin calls will look similar to the sample below.  If the plugin does not work for you then test that you can get to this URL from the machine on which you are using Eclipse.
```
http://YOUR_SERVER/ServiceAPI/types/java?Package=com.acme&GlobalNamespace=dto
```