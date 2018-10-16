import jwtDecode from 'jwt-decode';
import {SubmissionError} from 'redux-form';
import * as firebase from 'firebase';
const MicrosoftConfig  = require('MicrosoftConfig');
import {normalizeResponseErrors} from './utils';
import {saveAuthToken, clearAuthToken} from '../local-storage';
import {NewUserObject} from './models';
import {closeLoginModal, openLoginModal} from "./actions.modals";

export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN';
export const setAuthToken = authToken => ({
  type: SET_AUTH_TOKEN,
  authToken
});

export const SET_FACEBOOK = 'SET_FACEBOOK';
export const setFacebook = (facebook) => ({
  type: SET_FACEBOOK,
  facebook
});

export const SET_ONEDRIVE_VIDEO_FILE_ID = 'SET_ONEDRIVE_VIDEO_FILE_ID';
export const setOneDriveVideoFileId = (videoFileId) => ({
  type: SET_ONEDRIVE_VIDEO_FILE_ID,
  videoFileId: videoFileId
});

export const SET_ONEDRIVE_XBOX_FILE_ID = 'SET_ONEDRIVE_XBOX_FILE_ID';
export const setOneDriveXboxFileId = (xboxFileId) => ({
  type: SET_ONEDRIVE_XBOX_FILE_ID,
  xboxFileId: xboxFileId
});

export const XBOX_VIDEOS = 'XBOX_VIDEOS';
export const xboxVideos = (xboxVideos) => ({
  type: XBOX_VIDEOS,
  xboxVideos: xboxVideos
});


export const LINK_XBOX_DVR = 'LINK_XBOX_DVR';
export const linkXboxDVR = (linkXboxDVR) => ({
  type: LINK_XBOX_DVR,
  linkXboxDVR: linkXboxDVR
});

export const BROWSE_XBOX_DVR = 'BROWSE_XBOX_DVR';
export const browseXboxDVR = (browseXboxDVR) => ({
  type: BROWSE_XBOX_DVR,
  browseXboxDVR: browseXboxDVR
});

export const CLEAR_AUTH = 'CLEAR_AUTH';
export const clearAuth = () => ({
  type: CLEAR_AUTH
});

export const AUTH_REQUEST = 'AUTH_REQUEST';
export const authRequest = () => ({
  type: AUTH_REQUEST
});

export const AUTH_GET = 'AUTH_GET';
export const authGet = currentUser => ({
  type: AUTH_GET,
  currentUser
});

export const AUTH_ERROR = 'AUTH_ERROR';
export const authError = error => ({
  type: AUTH_ERROR,
  error
});

/**********Firebase Actions************/
export const loginFirebase = (email, password) => dispatch => {
  dispatch(authRequest());
  return new Promise((resolve, reject) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
      .then(auth => {
        if(auth.user.emailVerified) {
          firebase.database().ref(`/users/${auth.user.uid}`).once('value', snapshot => {
            const user = snapshot.val();
            // auth.updateProfile({photoURL: user.profile.avatar.url});
            if(!_.isEmpty(user.oneDrive)){
              dispatch(user.oneDrive.videoFileId, user.onDrive.xboxFileId)
            }
            auth.user.isAdmin = user.isAdmin
          });
          dispatch(authGet(auth.user));
          dispatch(closeLoginModal(3));
          resolve(auth.user);
        }
      }).catch(error => {
        dispatch(authError(error));
        dispatch(openLoginModal(error.code, error.message, 1));
      })
  })
};

export const registerFirebase = (values) => dispatch => {
  return firebase.auth().createUserWithEmailAndPassword(values.email, values.password)
    .then(auth => {
      const newUser = new NewUserObject(auth.user, values);

      firebase.auth().currentUser.updateProfile({displayName: values.username});
      firebase.database().ref('users/').child(auth.user.uid).set(newUser);

      firebase.auth().currentUser.sendEmailVerification().then(function() {
        dispatch(openLoginModal('Verification Email Sent!', 'Please verify your email address.', 0));
      })
    }).catch((error) => {
      dispatch(authError(error));
      dispatch(openLoginModal(error.code, error.message, 1));
    });
};

export const signOut = () => dispatch => {
  dispatch(authRequest());
  return firebase.auth().signOut().then(() =>{
    console.log('Sign Out Successful');
    dispatch(clearAuth());
    dispatch(openLoginModal('Sign out Successful!', '', 0));
  }).catch(error =>{
    dispatch(authError(error));
  });
};

/**********mLab Actions************/
export const loginMlab = (email, password) => dispatch => {
  dispatch(authRequest());
  return fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  })
  // Reject any requests which don't return a 200 status, creating
  // errors which follow a consistent format
    .then(res => normalizeResponseErrors(res))
    .then(res => res.json())
    .then(({authToken}) => storeAuthInfo(authToken, dispatch))
    .catch(err => {
      const {code} = err;
      const message =
        code === 401
          ? 'Incorrect email or password'
          : 'Unable to login, please try again';
      dispatch(authError(err));
      alert(code);
      // Could not authenticate, so return a SubmissionError for Redux-Form
      return Promise.reject(
        new SubmissionError({
          _error: message
        })
      );
    });
};

export const registerMlab = (user) => dispatch => {
  return fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(user)
  })
    .then(res => normalizeResponseErrors(res))
    .then(res => res.json())
    .catch(err => {
      const {reason, message, location} = err;
      if (reason === 'ValidationError') {
        // Convert ValidationErrors into SubmissionErrors for Redux Form
        return Promise.reject(
          new SubmissionError({
            [location]: message
          })
        );
      }
    });
};

export const storeAuthInfo = (authToken, dispatch) => {
  const decodedToken = jwtDecode(authToken);
  dispatch(setAuthToken(authToken));
  dispatch(authGet(decodedToken.user)); //changed user to username then removed username
  saveAuthToken(authToken);
};

export const refreshAuthToken = () => (dispatch, getState) => {
  dispatch(authRequest());
  const authToken = getState().auth.authToken;
  return fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  })
    .then(res => normalizeResponseErrors(res))
    .then(res => res.json())
    .then(({authToken}) => storeAuthInfo(authToken, dispatch))
    .catch(err => {
      dispatch(authError(err));
      dispatch(clearAuth());
      clearAuthToken(authToken);
    });
};