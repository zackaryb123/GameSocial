import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { openLoginModal } from "../../actions/actions.modals";

export default () => Component => {
  function RequiresLogin(props) {
    const {
      openLoginModal,
      authenticating,
      loggedIn,
      error,
      ...passThroughProps
    } = props;
    if (authenticating) {
      return <div>Logging in...</div>;
    } else if (!loggedIn || error) {
      openLoginModal("Login Required!", "Please login", 1);
    }

    return <Component {...passThroughProps} />;
  }

  const displayName = Component.displayName || Component.name || "Component";
  RequiresLogin.displayName = `RequiresLogin(${displayName})`;

  const mapStateToProps = (state, props) => ({
    authenticating: state.auth.loading,
    loggedIn: state.auth.currentUser !== null,
    error: state.auth.error
  });

  return connect(
    mapStateToProps,
    { openLoginModal }
  )(RequiresLogin);
};
