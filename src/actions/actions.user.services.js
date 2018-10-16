import * as firebase from "firebase";
import _ from "lodash";
import {uploadsTotalGet} from '../actions/actions.uploads';

export const getPlaylistTotal = (userId, state) => dispatch => {
  return firebase.database().ref(`users/${userId}/playlist/${state}`).once('value', snap => {
    let count = snap.numChildren();
    dispatch(uploadsTotalGet(count));
  })
};

export const getUserUploadsTotal = (userId, state) => dispatch => {
  return firebase.database().ref(`users/${userId}/${state}`).once('value', snap => {
    let count = snap.numChildren();
    dispatch(uploadsTotalGet(count));
  })
};

export const setFeed = (authId) => dispatch => {
  let feedList = {};
  return firebase
    .database()
    .ref(`users/${authId}/following`)
    .once("value", snap => {
      let following = snap.val() === null ? {} : snap.val();
      following[authId] = {id: authId};

      _.forEach(following, item => {
        firebase
          .database()
          .ref(`users/${item.id}/uploads`)
          .once("value", snap => {
            let uploads = snap.val();
            _.forEach(uploads, i => {
              feedList[i.id] = {id: i.id, created_at: i.created_at};
              firebase.database().ref(`users/${authId}/feed`).set(feedList);
            });
          });
      });
    });
};
