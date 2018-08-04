import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Switch, Route } from "react-router-dom";

// import "./main.less";
// import './ui/assets/css/semantic.min.css';
// import "semantic-ui-less/semantic.less";
// import "semantic-ui-less/definitions/globals/reset.less";
// import "semantic-ui-less/definitions/globals/site.less";
// import "vid";

import store from "./store";
import Shell from "./containers/container.shell";
import Upload from "./containers/container.upload";
import Home from "./containers/container.home";
import Discover from "./containers/container.discover";
import Feed from "./containers/container.feed";
import Profile from "./containers/container.profile";
import AboutUs from "./containers/container.about-us";
import CommunityRules from "./containers/container.community-rules";
import ContactUs from "./containers/container.contact-us";
import Settings from "./containers/container.settings";

import HeaderBar from "./components/menu/menu.header";
import FooterBar from "./components/menu/menu.footer";
// import MobileBar from "./components/menu/menu.mobile";
// import SideBar from "./components/menu/menu.side";

ReactDOM.render(
  <Provider store={store}>
    <Shell>
      <BrowserRouter basename="/">
        <main style={{ marginTop: "7rem" }}>
          <HeaderBar />
          <Switch>
            <Route exact path="/settings" component={Settings} />
            <Route exact path="/contact-us" component={ContactUs} />
            <Route exact path="/community-rules" component={CommunityRules} />
            <Route exact path="/about-us" component={AboutUs} />
            <Route
              exact
              path="/upload/:userId/uploads/:uploadId"
              component={Upload}
            />
            <Route exact path="/profile/:userId" component={Profile} />
            <Route exact path="/discover" component={Discover} />
            <Route exact path="/feed" component={Feed} />
            <Route exact path="/feed" component={Feed} />
            <Route exact path="/" component={Home} />
          </Switch>
          <FooterBar />
        </main>
      </BrowserRouter>
    </Shell>
  </Provider>,
  document.getElementById("root")
);
