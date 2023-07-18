import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import App from "./component/App";
import reducer from "./reducer/";
import thunk from "redux-thunk";

const store = createStore(reducer, applyMiddleware(thunk));
ReactDOM.render(

  <app77777>

  <soham></soham>
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
