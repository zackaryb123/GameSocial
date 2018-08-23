import * as firebase from 'firebase';
import {PlaylistObject} from './models';

export const PLAYLIST_REQUEST = 'PLAYLIST_REQUEST';
export const playlistRequest = () => ({
  type: PLAYLIST_REQUEST,
});

export const PLAYLIST_GET = 'PLAYLIST_GET';
export const playlistGet = (data) => ({
  type: PLAYLIST_GET,
  data
});

export const PLAYLIST_ERROR = 'PLAYLIST_ERROR';
export const playlistError = error => ({
  type: PLAYLIST_ERROR,
  error
});

//*** Actions ***//
export const getPlaylistOnce = (authId) => dispatch => {
  dispatch(playlistRequest());
  return firebase.database().ref(`users/${authId}/playlist`).once('value', (data) => {
    let playlist = data.val();
    dispatch(playlistGet(playlist));
  }).catch(error => dispatch(playlistError(error)));
};

//*** SERVICES ***//
export const getPlaylistOptions = (userId) => dispatch => {
  return new Promise((resolve, reject) => {
    return firebase.database().ref(`users/${userId}/playlist`)
      .once('value', snapshot => {
        const playlistList = snapshot.val();
        resolve(playlistList);
    })
  })
};

export const checkPlaylistNameExist = (name, authId) => dispatch => {
  return new Promise((resolve, reject) => {
    return firebase.database().ref(`users/${authId}/playlist`).orderByChild('name').equalTo(name)
      .once('value', snapshot => {
        const exist = !!snapshot.val();
        resolve(exist);
      })
  })
};

export const createPlaylist = (authId, playlistName) => dispatch => {
  firebase.database().ref(`users/${authId}/playlist/${playlistName}/name`).set(playlistName);
};

export const deletePlaylist = (authId, playlistName) => dispatch => {
  firebase.database().ref(`users/${authId}/playlist/${playlistName}`).remove()
};

export const addToPlaylist = (authId, upload, playlistName) => dispatch => {
  firebase.database().ref(`users/${authId}/playlist/${playlistName}`).once('value', snap => {
    const index = snap.numChildren() - 1;
    let playlistObject = new PlaylistObject(upload, playlistName);
    playlistObject.index = index;
    firebase.database().ref(`users/${authId}/playlist/${playlistName}/${upload.id}`).set(playlistObject);
  })
};