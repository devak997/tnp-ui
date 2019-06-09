import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import reducers from "./reducers"
import "./assets/semantic/dist/semantic.min.css";

ReactDOM.render(
  <Provider store={createStore(reducers)}>
    <BrowserRouter>
    <App />
  </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
