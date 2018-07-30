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
import Discover from './containers/container.discover';
import Community from './containers/container.community';
import Profile from './containers/container.profile';

ReactDOM.render(
  <Provider store={store}>
    <Shell>
      <BrowserRouter basename="/">
        <main>
          <HeaderBar />
          <section style={{marginTop: '6rem'}}>
            <Switch>
              <Route path='/profile' component={Profile}/>
              <Route path='/discover' component={Discover}/>
              <Route path='/community' component={Community}/>
              <Route path='/' component={Home}/>
            </Switch>
          </section>
          <FooterBar />
          <MobileBar />
        </main>
      </BrowserRouter>
    </Shell>
  </Provider>,
  document.getElementById('root'));