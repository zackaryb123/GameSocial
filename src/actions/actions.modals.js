import { Modal } from './models';
import * as firebase from 'firebase';


export const LOGIN_MODAL = 'LOGIN_MODAL';
export const RESET_PASSWORD_MODAL = 'RESET_PASSWORD_MODAL';
export const FORGOT_PASSWORD_MODAL = 'FORGOT_PASSWORD_MODAL';


/******Action Modals********/
export function loginModal(content){
  return {
    type: LOGIN_MODAL,
    payload: content
  }
}

export function forgotPasswordModal(content){
  return {
    type: FORGOT_PASSWORD_MODAL,
    payload: content
  }
}

export function resetPasswordModal(content){
  return {
    type: RESET_PASSWORD_MODAL,
    payload: content
  }
}

/******Open Modals********/
export function openLoginModal(header, message, status){
  return function (dispatch) {
    let newModal = new Modal(true, false, false, false, message, header, status);
    dispatch(loginModal(newModal));
  }
}

export function openForgotPasswordModal(header, message, status){
  return function (dispatch) {
    let newModal = new Modal(true, false, false,false, message, header, status);
    dispatch(forgotPasswordModal(newModal));
  }
}

export function openResetPasswordModal(header, message, status){
  return function (dispatch) {
    let newModal = new Modal(true, false, false,false, message, header, status);
    dispatch(resetPasswordModal(newModal));
  }
}

/******Close Modals********/
export function closeLoginModal(){
  return function (dispatch) {
    let newModal = new Modal(false, false, false,false, '', '');
    dispatch(loginModal(newModal));
  }
}

export function closeForgotPasswordModal(){
  return function (dispatch) {
    let newModal = new Modal(false, false, false,false, '', '', null);
    dispatch(forgotPasswordModal(newModal));
  }
}


export function closeResetPasswordModal(){
  return function (dispatch) {
    let newModal = new Modal(false, false, false, false, '', '', null);
    dispatch(resetPasswordModal(newModal));
  }
}

// Actions
export const sendResetPassEmail = (email) => dispatch => {
  return firebase.auth().sendPasswordResetEmail(email)
    .then(function(data) {
      console.log('Send reset password email succeed', data);
      dispatch(closeForgotPasswordModal());
      dispatch(openLoginModal('Reset password email sent!', 'Please escalate to your email and click the link provided.', 0))
    }).catch(function(error) {
      console.log('Send Reset Password Email Failed');
      dispatch(openForgotPasswordModal(error.code, error.message, 1))
  });
};