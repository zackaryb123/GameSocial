import * as firebase from 'firebase';
import axios from "axios";
import { setOneDriveVideoFileId, setOneDriveXboxFileId, xboxVideos, setFacebook } from "./actions.auth";
import {openOneDriveModal} from "./actions.modals";
import {XboxDvrObj} from './models';

export const storeOneDriveVideoId = (authId, id) => {
  firebase.database().ref(`users/${authId}/oneDrive/videoFileId`).set(id);
};

export const storeOneDriveXboxId = (authId, id) => {
  firebase.database().ref(`users/${authId}/oneDrive/xboxFileId`).set(id);
};

export const storeToggleBrowse = (authId, bool) => {
  firebase.database().ref(`users/${authId}/oneDrive/isBrowse`).set(bool);
};

export const storeToggleLink = (authId, bool) => {
  firebase.database().ref(`users/${authId}/oneDrive/isLink`).set(bool);
};

export const storeXboxDvrList = (authId, list) => {
  _.forEach(list, item => {
    let dvrObj = new XboxDvrObj(item);
    console.log(dvrObj.downloadUrl);
    firebase.database().ref(`users/${authId}/oneDrive/xboxDvr/${item.id}`).set(dvrObj)
  })
};

export const linkXboxDVR = (authId, accessToken) => dispatch => {
  //TODO: modal feedback informing facebook/PNS account successfully linked or no shared xbox dvr videos
  var bearer = `Bearer ${accessToken}`;
  const url = `https://graph.microsoft.com/v1.0/me/drive/special/videos`;
  var options = {
    method: 'get',
    url: url,
    headers: {
      'Accept': 'application/json',
      'Authorization': bearer,
      'Access-Control-Allow-Origin': '*'
    }
  };

  axios(options)
    .then(res => {
      storeOneDriveVideoId(authId, res.data.id);
      dispatch(setOneDriveVideoFileId(res.data.id));
      const url = `https://graph.microsoft.com/v1.0/me/drive/items/${res.data.id}/children?select=name,id`;
      var options = {
        method: 'get',
        url: url,
        headers: {
          'Accept': 'application/json',
          'Authorization': bearer,
          'Access-Control-Allow-Origin': '*'
        }
      };
      axios(options)
        .then(res => {
          _.forEach(res.data.value, item => {
            if(item.name === 'Xbox Game DVR'){
              storeOneDriveXboxId(authId, item.id);
              dispatch(setOneDriveXboxFileId(item.id));
            }
          });
        }).catch(err => console.log(err));
    }).catch(err => {console.log(err)});
};

export const updateXboxDVR = (accessToken, xboxId, authId) => dispatch => {
  //TODO: modal feedback informing Microsoft/oneDrive account updated
  var bearer = `Bearer ${accessToken}`;
  const url = `https://graph.microsoft.com/v1.0/me/drive/items/${xboxId}/children`;
  var options = {
    method: 'get',
    url: url,
    headers: {
      'Accept': 'application/json',
      'Authorization': bearer,
      'Access-Control-Allow-Origin': '*'
    }
  };
  axios(options)
    .then(res => {
      console.log(res);
      if(res.data.value){
        storeXboxDvrList(authId, res.data.value);
        dispatch(xboxVideos(res.data.value));
        dispatch(openOneDriveModal(null, null, null, res.data.value));
      }
      else{console.log('no videos in Xbox DVR')}
    }).catch(err => console.log(err));
};

export const linkFacebookDVR = (auth) => dispatch => {
  var provider = new firebase.auth.FacebookAuthProvider();
  // auth.currentUser.unlink('facebook.com');
  provider.addScope('user_videos');
  firebase.auth().currentUser.linkWithPopup(provider).then(function(result) {
    //TODO: modal feedback informing facebook/PNS account successfully linked
    var token = result.credential.accessToken;
    dispatch(setFacebook(result.additionalUserInfo.profile));
    localStorage.setItem('fb.access.token', token);
    firebase.database().ref(`users/${auth.currentUser.uid}/facebook`).set(result.additionalUserInfo.profile);
  });
};


export const updateFacebookDVR = (auth, email) => dispatch => {
  //TODO: set feedback informing that facebook creds dont match and either log out of facebook or login to current linked user
  //TODO: or dvr updated
  var provider = new firebase.auth.FacebookAuthProvider();
  provider.addScope('user_videos');
  firebase.auth().currentUser.linkWithPopup(provider).then(function(result) {
    if(email !== result.additionalUserInfo.profile.email) {
      auth.currentUser.unlink('facebook.com')
      //TODO: inform user accounts dont match => fix then retry
    } else {
      var token = result.credential.accessToken;
      localStorage.setItem('fb.access.token', token);
      const url1 = `https://graph.facebook.com/v3.1/${result.additionalUserInfo.profile.id}/videos`;
      const url2 = `https://graph-video.facebook.com?redirect=false&access_token=${token}`;

      const options = {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        method: 'get',
        url: url1
      };
      axios(options)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }).catch(err => console.log(err));
};