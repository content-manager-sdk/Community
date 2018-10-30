import * as React from "react";
import * as ReactDOM from "react-dom";

import ButtonDefaultExample from "./components/bobList";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<ButtonDefaultExample />, document.getElementById(
  "root"
) as HTMLElement);
registerServiceWorker();
