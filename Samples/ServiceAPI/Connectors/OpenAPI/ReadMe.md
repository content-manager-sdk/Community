# Open API Definition

[OpenAPI](https://oai.github.io/Documentation/), formerly know as [Swagger](https://swagger.io/), is a standard for defining RESTful web service interfaces. OpenAPI can be used to assist in the design, development and testing of a web service.

## Usage in ServiceAPI

The CM ServiceAPI was designed and developed prior to the popularization of OpenAPI but it is possible to build an OpenAPI definition document to represent a subset of the ServiceAPI operations.  One approach would be to use the same code generation tools used to build the ServiceAPI itself, unfortunately this results in an OpenAPI document so large and complex that it is difficult to use by human beings and causes some of the OpenAPI tools to fail.
An alternate approach is to build an OpenAPI specification to suite the needs of the consumer, this definition is a starting point for this approach.

## YAML
The data serialization language [YAML](https://www.tutorialspoint.com/yaml/yaml_introduction.htm) is used in this OpenAPI definition, it relies on correct spacing and indenting and can be picked up as you go.

## Tools
The tools used to edit this file are:
 - VSCode
 - OpenAPI plugin for VSCode
 - YAML plugin for VS Code, and
 - the C# OpenAPI [code generator](https://openapi-generator.tech/docs/generators/csharp)

 ## The process
 The process used to create this file was to:
  - use the samples found in the swagger [documentation](https://swagger.io/docs/specification/basic-structure/)
  - after each significant change run the code generator to verify that the change produced desirable code

## The code generator
The generator used to develop this OpenAPI definition can be found at the [OpenAPI web site](https://openapi-generator.tech/). The command used to generate the C# client was this"

```
npx @openapitools/openapi-generator-cli generate -i CM.swagger.yml -g csharp-netcore -o /tmp/mytest/ --global-property skipFormModel=false
```

## Basic Authentication hack
For the purposes of testing only basic authentication was used to connect to the ServiceAPI.  No doubt there is a better way to set the username/password in the generated client but the only way I found was to create a partial class for ApiClient to set the request.Credentials, for example:

```cs
	public partial class ApiClient
	{

		partial void InterceptRequest(IRestRequest request)
		{
			request.Credentials = new NetworkCredential("username", "password");
		}
	}
```

## Edit the OpenAPI before using

The OpenAPI definition provided here assumes that your:

- web server hostname is 'localhost', and
- ServiceAPI path is '/ServiceAPI'


