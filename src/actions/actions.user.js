import * as firebase from "firebase";
import _ from 'lodash';

export const USER_REQUEST = 'USER_REQUEST';
export const userRequest = () => ({
  type: USER_REQUEST,
});

export const USER_GET = 'USER_GET_SUCCESS';
export const userGet = (data) => ({
  type: USER_GET,
  data
});

export const USER_ERROR = 'USER_ERROR';
export const userError = error => ({
  type: USER_ERROR,
  error
});

export const getUserOnce = userId => dispatch => {
  dispatch(userRequest());
  return firebase.database().ref(`users/${userId}/`).once('value', (data) => {
    dispatch(userGet(data.val()));
  }).catch(error => dispatch(userError(error)));
};