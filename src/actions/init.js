import * as firebase from 'firebase';
import {openLoginModal, closeResetPasswordModal, openResetPasswordModal} from "./actions.modals";
import { authGet, browseXboxDVR, linkXboxDVR, setOneDriveVideoFileId, setOneDriveXboxFileId, xboxVideos, setFacebook } from "./actions.auth";
import {UserAgentApplication} from "msal";
const FirebaseConfig = require('FirebaseConfig');
const MicrosoftConfig = require('MicrosoftConfig');

export const initApp = () => dispatch => {

  firebase.initializeApp(FirebaseConfig);

  const auth = firebase.auth();
  const mode = getUrlParameters('mode', "", true);
  const actionCode = getUrlParameters('oobCode', "", true);

  const idToken = getHashParameters('#id_token', true);
  const accessToken = getHashParameters('#access_token', true);

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
      case 'linkOneDrive':
        localStorage.setItem('linkDvr', true);
        dispatch(linkXboxDVR(true));
        handleMicrosoftAuthLink(idToken, accessToken);
        break;
      case 'browseOneDrive':
        localStorage.setItem('browseDdvr', true);
        dispatch(browseXboxDVR(true));
        handleMicrosoftAuthBrowse(idToken, accessToken);
        break;
      default:
        break;
    }
  } else {
    checkAuthStateChange(auth);
  }

  function checkAuthStateChange(auth) {
    auth.onAuthStateChanged(function(auth) {
      if (auth && auth.emailVerified) {
        console.log('User is logged in', auth);
        return firebase.database().ref(`users/${auth.uid}`).once('value', snapshot => {
          let user = snapshot.val();
          auth.isAdmin = user.isAdmin;
          dispatch(authGet(auth));
          if(user.oneDrive){
            dispatch(setOneDriveXboxFileId(user.oneDrive.xboxFileId));
            dispatch(setOneDriveVideoFileId(user.oneDrive.videoFileId));
            if(user.oneDrive.xboxDvr){
              dispatch(xboxVideos(user.oneDrive.xboxDvr));
            }
          }
          if(user.facebook) {
           dispatch(setFacebook(user.facebook));
          }
        });
      }else{
        dispatch(openLoginModal('', '', null));
      }
    });
  }

  function handleMicrosoftAuthLink(idToken, accessToken) {
    var userAgentApplication = new UserAgentApplication(MicrosoftConfig.clientId, null, null,{
      redirectUri: MicrosoftConfig.linkOneDriveRedirect
    });
    if(idToken){ userAgentApplication.acquireTokenRedirect(MicrosoftConfig.scope)}
    //TODO: convert local storage to redux store
    if(accessToken){localStorage.setItem('msal.access.token', accessToken)}
  }

  function handleMicrosoftAuthBrowse(idToken, accessToken) {
    var userAgentApplication = new UserAgentApplication(MicrosoftConfig.clientId, null, null,{
      redirectUri: MicrosoftConfig.browseOneDriveRedirect
    });
    if(idToken){ userAgentApplication.acquireTokenRedirect(MicrosoftConfig.scope)}
    //TODO: convert local storage to redux store
    if(accessToken){localStorage.setItem('msal.access.token', accessToken)}
  }

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
    dispatch(openLoginModal(`Password reset successful!`, 'You may continue to login.', 0));
  }).catch(function(error) {
    dispatch(closeResetPasswordModal());
    dispatch(openLoginModal(error.header, error.message, 1));
  });
};

export function getUrlParameters(parameter, staticURL, decode){
  var windowLocation = (window.location.search !== "")? window.location.search : window.location.hash;
  var currLocation = (staticURL && staticURL.length)? staticURL : windowLocation;

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

export function getHashParameters(parameter, decode){
  var windowLocation = window.location.hash;

  if(windowLocation !== ""){
    var parArr = windowLocation.split("&");
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