

  * Settings in web.config on Web Client

`
    <add key="ida:RedirectUri" value="https://localhost:3000" />
    <add key="ida:ClientID" value="53897c90-897f-42c6-a869-dc1bcf489015" />
    <add key="ida:Password" value="zC1AKPhkp4x4ijf4K+uXENK.Z]gqBZ/T" />
    <add key="oauth.aad.ClientId" value="53897c90-897f-42c6-a869-dc1bcf489015"/>
    <add key="oauth.aad.ClientSecret" value="veSB58[yfpqjTATKU394)|="/>
    <add key="oauth.aad.AuthorizeUrl" value="https://login.microsoftonline.com/common/oauth2/v2.0/authorize"/>
    <add key="oauth.aad.AccessTokenUrl" value="https://login.microsoftonline.com/common/oauth2/v2.0/token"/>
    <!-- Optional: -->
    <add key="oauth.aad.TenantId" value="dd30c61c-1361-4509-82d6-fab96f7102a2"/>
`

  * ServiceAPI web.config
  `
    <add key="ida:ClientID" value="53897c90-897f-42c6-a869-dc1bcf489015"/>
    <add key="ida:Audience" value="53897c90-897f-42c6-a869-dc1bcf489015"/>
    <add key="ida:Password" value="zC1AKPhkp4x4ijf4K+uXENK.Z]gqBZ/T"/>
    <add key="ida:Issuer" value="https://login.microsoftonline.com/dd30c61c-1361-4509-82d6-fab96f7102a2/v2.0"/>
    <add key="ida:RedirectUri" value="https://localhost:3000"/>
    <add key="oauth.aad.ClientId" value="53897c90-897f-42c6-a869-dc1bcf489015"/>
    <add key="oauth.aad.ClientSecret" value="zC1AKPhkp4x4ijf4K+uXENK.Z]gqBZ/T"/>
    <add key="oauth.aad.AuthorizeUrl" value="https://login.microsoftonline.com/common/oauth2/v2.0/authorize"/>
    <add key="oauth.aad.AccessTokenUrl" value="https://login.microsoftonline.com/common/oauth2/v2.0/token"/>
    <add key="oauth.aad.RedirectUrl" value="https://localhost/ServiceAPI"/>
    <add key="oauth.aad.TenantId" value="dd30c61c-1361-4509-82d6-fab96f7102a2"/>
  `