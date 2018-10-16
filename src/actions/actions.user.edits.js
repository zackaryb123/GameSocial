import * as firebase from "firebase";
import {getUserOnce} from '../actions/actions.user';

export const editAvatar = (authId, file) => dispatch => {
  firebase.database().ref(`users/${authId}/profile/avatar`).set(file.secure_url);
  firebase.database().ref(`users/${authId}/uploads`).once('value', snap => {
    const uploads = snap.val();
    _.forEach(uploads, upload => {
      firebase.database().ref(`uploads/${upload.id}/publisher/avatar`).set(file.secure_url);
      firebase.database().ref(`featured/${upload.id}`).once('value', snap => {
        if(!!snap.val()){
          firebase.database().ref(`featured/${upload.id}/publisher/avatar`).set(file.secure_url);
        }
      })
    });
  });
  dispatch(getUserOnce(authId));
};

export const editProfile = (authId, values) => {

};