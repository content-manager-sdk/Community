import * as React from "react";
import * as ReactDOM from "react-dom";
import { MainApp } from "./components/MainApp";

import { Provider /* inject, observer  */ } from "mobx-react";

import { appStore } from "./stores/AppStore";

//import thunk, { ThunkDispatch } from "redux-thunk";
//import { createLogger } from "redux-logger";
//import { createStore, applyMiddleware, Store, AnyAction } from "redux";
//import { fetchRecordsThunk, reducer, IBobListState } from "./redux/actions2";
//import { BrowserRouter as Router, Route } from "react-router-dom";
//import rootReducer from "./reducers/doSearch";

//import BobList from "./components/bobList";

import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

//const middleware = applyMiddleware(thunk);

//const store: Store<IBobListState> = createStore(reducer, middleware);
//store.dispatch(add(5));
/*(store.dispatch as ThunkDispatch<IBobListState, void, AnyAction>)(
  fetchRecordsThunk()
);
*/
/*
ReactDOM.render(
      <BobList
        store={store}
        onSearch={() => {
          // store.dispatch(add(5));
          (store.dispatch as ThunkDispatch<IBobListState, void, AnyAction>)(
            fetchThunk()
          );
        }}
      />
,
  document.getElementById("root") as HTMLElement
);
*/

// class Contacts extends React.Component {
//   constructor(props: any) {
//     super(props);
//   }
//   render() {
//     return (
//       <BobList
//         store={store}
//         onSearch={() => {
//           // store.dispatch(add(5));
//           (store.dispatch as ThunkDispatch<IBobListState, void, AnyAction>)(
//             fetchRecordsThunk()
//           );
//         }}
//       />
//     );
//   }
// }

// const MainApp = () => (
//   <Router>
//     <React.Fragment>
//       <Route path="/one" component={Contacts} />
//       <Route exact path="/" component={Contacts} />
//     </React.Fragment>
//   </Router>
// );

// @inject("appStore")
// @observer
// class MyApp extends React.Component<{ appStore?: IAppStore }> {
//   render() {
//     const { appStore } = this.props;
//     return (
//       <div>
//         <h1>Welcome {appStore!.userProfile.DisplayName}</h1>
//       </div>
//     );
//   }
// }

const Root = (
  <Provider appStore={appStore}>
    <MainApp />
  </Provider>
);

ReactDOM.render(Root, document.getElementById("root") as HTMLElement);

registerServiceWorker();
appStore.updateUserInfoGenerator();
