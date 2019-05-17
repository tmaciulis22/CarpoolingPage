import React, { Component } from 'react';
import {Provider} from "react-redux";
import store from "./store";
import RouterComponent from "./components/Router/Router";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
            <RouterComponent/>
      </Provider>
    )
  }
}

export default App;

