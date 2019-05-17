import { createStore, compose, applyMiddleware } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import rootReducer from '../reducers/index';
import thunk from 'redux-thunk';
import signalRMiddleware from "../middlewares/signalRMiddleware";

const defaultState = {};

const enhancers = compose(
    applyMiddleware(thunk, signalRMiddleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
);

const store = createStore(rootReducer, defaultState, enhancers);

export const history = syncHistoryWithStore(createBrowserHistory(), store);

export default store;
