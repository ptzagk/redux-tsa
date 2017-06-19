import { applyMiddleware, compose, createStore } from "redux";
import reduxTSA from "redux-tsa";

import rootReducer from "reducers";

const enhancer = compose(
  applyMiddleware(reduxTSA),
  (window as any).devToolsExtension ? (window as any).devToolsExtension() : (f: any): any => f,
);

export default (initialState?: object) =>
  createStore(
    rootReducer,
    initialState ? initialState : undefined,
    enhancer,
  );
