// (function() {
//   Office.initialize = function(reason) {
//     // If you need to initialize something you can do so here.
//     //  loadProps();typescript class
//   };
// })();

export interface IGetRecordUriResponse {
  found: boolean;
  uri: number;
  message?: string;
}

export interface IWordConnector {
  getUri(): Promise<IGetRecordUriResponse>;
  getName(): string;
}

export class WordConnector implements IWordConnector {
  getName(): string {
    const tokens = Office.context.document.url.split("/");
    return tokens[tokens.length - 1];
  }
  getUri(): Promise<IGetRecordUriResponse> {
    return new Promise(function(resolve, reject) {
      let response = { found: false, uri: 0, message: "" };

      Word.run(context => {
        let customProps = context.document.properties.customProperties;
        context.load(customProps);

        let customProp = customProps.getItem("CM_Record_Uri");
        context.load(customProp);

        return context
          .sync()
          .then(function() {
            var v = customProp.value;

            if (v) {
              response.uri = Number(v);
              if (response.uri > 0) {
                response.found = true;
              }
            }
            resolve(response);
          })
          .catch(function(myError) {
            //  response.message = myError.message || myError;
            resolve(response);
          });
      });
    });

    // });
  }
}
export default WordConnector;
