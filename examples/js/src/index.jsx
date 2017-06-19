import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import configureStore from "store";
import UI from "ui";

// tslint:disable-next-line
require("stylesheets/app.scss");

const store = configureStore();

render(
 <Provider store={store}><UI/></Provider>,
  document.getElementById("root"),
);
