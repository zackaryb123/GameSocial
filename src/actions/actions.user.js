import * as firebase from "firebase";
import _ from 'lodash';

export const USER_REQUEST = 'USER_REQUEST';
export const userRequest = () => ({
  type: USER_REQUEST,
});

export const USER_GET = 'USER_GET';
export const userGet = (data) => ({
  type: USER_GET,
  data
});

export const USER_CLEAR = 'USER_CLEAR';
export const userClear = (data) => ({
  type: USER_CLEAR,
  data
});

export const USER_ERROR = 'USER_ERROR';
export const userError = error => ({
  type: USER_ERROR,
  error
});

// Actions
export const getUserOnce = userId => dispatch => {
  dispatch(userRequest());
  return firebase.database().ref(`users/${userId}/`).once('value', (data) => {
    dispatch(userGet(data.val()));
  }).catch(error => dispatch(userError(error)));
};

export const clearUser = () => dispatch => {
  dispatch(clearUser())
};

// Services
export const getInitUser = userId => dispatch => {
  return new Promise((resolve, reject) => {
    return firebase.database().ref(`users/${userId}`).once('value', snapshot => {
      let user = snapshot.val();
      resolve(user);
    })
  }).catch(error => dispatch(userError(error)))
};