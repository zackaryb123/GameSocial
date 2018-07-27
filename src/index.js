import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import 'semantic-ui-css/semantic.min.css';

import store from "./store";
import Shell from "./containers/container.shell";
import HeaderBar from "./components/bar/bar.header";
import FooterBar from "./components/bar/bar.footer";
import MobileBar from "./components/bar/bar.mobile";
//import SideBar from "./components/bar/bar.side";

import Home from './containers/container.home';

ReactDOM.render(
  <Provider store={store}>
    <Shell>
      <BrowserRouter basename="/">
        <main>
          <HeaderBar />
          <Switch>
            <Route path="/" component={Home} />
          </Switch>
          <FooterBar />
          <MobileBar />
        </main>
      </BrowserRouter>
    </Shell>
  </Provider>,
  document.getElementById('root'));