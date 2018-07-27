import * as firebase from 'firebase';
import {fireConfig}  from "../DBconfig";
import {openLoginModal, closeResetPasswordModal, openResetPasswordModal} from "./actions.modals";

export const initApp = () => dispatch => {
  firebase.initializeApp(fireConfig);
  const auth = firebase.auth();
  const mode = getUrlParameters('mode', "", true);
  const actionCode = getUrlParameters('oobCode', "", true);

  // Check redirect mode url's
  if (mode) {
    switch (mode) {
      case 'resetPassword':
        handleResetPassword(auth, actionCode);
        break;
      case 'recoverEmail':
        handleRecoverEmail(auth, actionCode);
        break;
      case 'verifyEmail':
        handleVerifyEmail(auth, actionCode);
        break;
      default:
    }
  } else {
    dispatch(openLoginModal('', '', null));
  }

  /********Functions*********/
  function handleVerifyEmail (auth, actionCode) {
    return auth.applyActionCode(actionCode).then(function (resp) {
      console.log('handleVerifyEmail:', resp);
      dispatch(openLoginModal('Email successfully verified!', 'You may proceed to login.', 0));
    }).catch(function (error) {
      dispatch(openLoginModal(error.code, error.message, 1));
    });
  }

  function handleResetPassword(auth, actionCode) {
    auth.verifyPasswordResetCode(actionCode).then(function(email) {
      dispatch(openResetPasswordModal(`Reset email verified for ${email}`, 'Please reset password below.', 0))
    }).catch(function(error) {
      dispatch(openLoginModal(error.header, error.message, 1))
    });
  }

  function handleRecoverEmail(auth, actionCode) {
    var restoredEmail = null;
    // Confirm the action code is valid.
    auth.checkActionCode(actionCode).then(function(info) {
      // Get the restored email address.
      restoredEmail = info['data']['email'];

      // Revert to the old email.
      return auth.applyActionCode(actionCode);
    }).then(function() {
      // Account email reverted to restoredEmail

      // TODO: Display a confirmation message to the user.

      // You might also want to give the user the option to reset their password
      // in case the account was compromised:
      auth.sendPasswordResetEmail(restoredEmail).then(function() {
        // Password reset confirmation sent. Ask user to check their email.
      }).catch(function(error) {
        // Error encountered while sending password reset code.
      });
    }).catch(function(error) {
      // Invalid code.
    });
  }
};

export const handleConfirmPasswordReset = (actionCode, newPassword) => dispatch => {
  firebase.auth().confirmPasswordReset(actionCode, newPassword).then(function(resp) {
    console.log('confirmPasswordReset:', resp);
    dispatch(closeResetPasswordModal());
    dispatch(openLoginModal(`Password reset successful!!`, 'You may continue to login.', 0));
  }).catch(function(error) {
    dispatch(closeResetPasswordModal());
    dispatch(openLoginModal(error.header, error.message, 1));
  });
}

export function getUrlParameters(parameter, staticURL, decode){
  var windowLocation = (window.location.search !== "")? window.location.search : window.location.hash;
  var currLocation = (staticURL && staticURL.length)? staticURL : windowLocation

  if(currLocation !== ""){
    var parArr = currLocation.split("?")[1].split("&");
    var returnBool = true;

    for(var i = 0; i < parArr.length; i++){
      var parr = parArr[i].split("=");
      if(parr[0] === parameter){
        return (decode) ? decodeURIComponent(parr[1]) : parr[1];
      }else{
        returnBool = false;
      }
    }

    if(!returnBool) return false;
  }else{
    return false;
  }
}