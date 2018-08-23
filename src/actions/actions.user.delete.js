import * as firebase from "firebase";

export const removeFromPlaylist = (authId, uploadId, playlistName) => dispatch => {
  firebase.database().ref(`users/${authId}/playlist/${playlistName}/${uploadId}`).remove()
};

export const deleteUserUpload = (authId, uploadId, playlistName) => dispatch => {
  // uploads remove //
  firebase.database().ref(`uploads/${uploadId}`).remove();

  // user - uploads/feed //
  firebase.database().ref(`users/${authId}/uploads/${uploadId}`).remove();
  firebase.database().ref(`users/${authId}/feed/${uploadId}`).remove();

  // for each follower remove video from feed
  firebase.database().ref(`users/${authId}/followers`).once('value', snap => {
    let followers = snap.val();
    _.forEach(followers, followee => {
      firebase.database().ref(`users/${followee.id}/feed/${uploadId}`).remove();
    })
  });

  // if featured
  firebase.database().ref(`featured/${uploadId}`).once('value', snap => {
    const exist = !!snap.val();
    if(exist){firebase.database().ref(`featured/${uploadId}`).remove()}
  });

  // TODO: tracked favorites/playlist

};