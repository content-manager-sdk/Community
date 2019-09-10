# Logic Apps Connector

Microsoft Azure Logic Apps connectors are defined using OpenAPI. While it is possible to generate an OpenAPI description for the entire ServiceAPI this is not suitable for creating a Logic Apps connector because of its size and complexity.

This OpenAPI file is a small subset of the ServiceAPI supporting only very simple record creation and searching. Depending on demand this could grow to either a more comprehensive definition or a tool to generate a bespoke definition (e.g. including 'additional fields').

## Usage

The custom connector can be created within an Azure subscription following these [instructions](https://docs.microsoft.com/en-us/connectors/custom-connectors/define-openapi-definition).

## Edit the OpenAPI before using

The OpenAPI definition provided here assumes that your:

- web server hostname is 'localhost', and
- ServiceAPI pat is '/ServiceAPI'

Ensure you change these before uploading the file to your custom connector.

## On Premise Gateway

If you plan to use the [On Premise gateway](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-gateway-install) to interact with an On Premise CM instance ensure you check the 'Connect via on-premises data gateway' option.
