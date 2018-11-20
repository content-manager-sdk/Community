import * as React from "react";
import * as ReactDOM from "react-dom";
import MainApp from "./components/MainApp";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<MainApp />, document.getElementById("root") as HTMLElement);
registerServiceWorker();
