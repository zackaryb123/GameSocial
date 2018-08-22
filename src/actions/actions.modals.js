import {Modal, NewVideoObj, FeedItemObj} from './models';
import * as firebase from 'firebase';

export const LOGIN_MODAL = 'LOGIN_MODAL';
export const loginModal = (content) => ({
  type: LOGIN_MODAL,
  payload: content
});

export const FORGOT_PASSWORD_MODAL = 'FORGOT_PASSWORD_MODAL';
export const forgotPasswordModal = (content) => ({
  type: FORGOT_PASSWORD_MODAL,
  payload: content

});

export const RESET_PASSWORD_MODAL = 'RESET_PASSWORD_MODAL';
export const resetPasswordModal = (content) => ({
  type: RESET_PASSWORD_MODAL,
  payload: content
});

export const UPLOAD_MODAL = 'UPLOAD_MODAL';
export const uploadModal = (content) => ({
  type: UPLOAD_MODAL,
  payload: content
});

export const FEEDBACK_MODAL = 'FEEDBACK_MODAL';
export const feedbackModal = (content) => ({
  type: FEEDBACK_MODAL,
  payload: content
});

/******Open Modal Actions********/
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

export function openUploadModal(header, message, status, isLoading){
  return function (dispatch) {
    let newModal = new Modal(true, isLoading, false,false, message, header, status);
    dispatch(uploadModal(newModal));
  }
}

export function openFeedbackModal(header, message, status){
  return function (dispatch) {
    let newModal = new Modal(true, false, false,false, message, header, status);
    dispatch(feedbackModal(newModal));
  }
}


/******Close Modals Actions********/
export function closeLoginModal(){
  return function (dispatch) {
    let newModal = new Modal(false, false, false,false, '', '', null);
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

export function closeUploadModal(){
  return function (dispatch) {
    let newModal = new Modal(false, false, false, false, '', '', null);
    dispatch(uploadModal(newModal));
  }
}

export function closeFeedbackModal(){
  return function (dispatch) {
    let newModal = new Modal(false, false, false, false, '', '', null);
    dispatch(feedbackModal(newModal));
  }
}

/******Modal Services********/
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

export const upload = (data, file) => dispatch => {
  return new Promise((resolve) => {
    const upload = new NewVideoObj(data, file);
    const postId = firebase.database().ref().child('uploads').push().key;
    upload.id = postId;

    const updates = {};
    updates[`uploads/${postId}`] = upload;
    updates[`users/${data.publisher.id}/uploads/${postId}`] = upload;
    updates[`users/${data.publisher.id}/feed/${postId}`] = upload;
    firebase.database().ref().update(updates);

    // firebase.database().ref(`users/${data.publisher.id}/feed/count`).once('value', snapshot => {
    //   const newCount = snapshot.val() + 1;
    //   firebase.database().ref(`users/${data.publisher.id}/feed/count`).set(newCount);
    // });

    resolve(true);
  }).then((res) => {if(res){
    dispatch(closeUploadModal());
    dispatch(openFeedbackModal('Congrats!','Upload is complete.', 0, false))}
  }).catch(error => {
    dispatch(closeFeedbackModal());
    dispatch(openUploadModal(error.code, error.message, 1, false))
  });
};

