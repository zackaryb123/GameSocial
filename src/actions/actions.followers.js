import * as firebase from 'firebase';

export const FOLLOWERS_REQUEST = 'FOLLOWERS_REQUEST';
export const followersRequest = () => ({
  type: FOLLOWERS_REQUEST,
});

export const FOLLOWERS_GET = 'FOLLOWERS_GET';
export const followersGet = (data) => ({
  type: FOLLOWERS_GET,
  data
});

export const FOLLOWERS_ERROR = 'FOLLOWERS_ERROR';
export const followersError = error => ({
  type: FOLLOWERS_ERROR,
  error
});

//*** ACTIONS **//

export const getFollowersPromise = (userId) => dispatch => {
  dispatch(followersRequest());
  return new Promise((resolve, reject) => {
    return firebase.database().ref(`users/${userId}/followers`).once('value', (data) => {
      let followers = data.val();
      resolve(dispatch(followersGet(followers)));
    });
  })
};

export const getFollowersOnce = (userId) => dispatch => {
  dispatch(followersRequest());
  firebase.database().ref(`users/${userId}/followers`).once('value', (data) => {
    dispatch(followersGet(data.val()));
  }).catch(error => dispatch(followersError(error)));
};

//*** SERVICES ***//
export const getInitFollowersState = (authId, uploadId) => dispatch => {
  return new Promise((resolve, reject) => {
    return firebase.database().ref(`users/${authId}/favorites/${uploadId}`).once('value', (snapshot) => {
      const isFavorite = !!snapshot.val();
      resolve(isFavorite);
    })
  })
};


export const addFollowers = (auth, publisherId) => dispatch => {
  const followersRef = firebase.database().ref(`users/${publisherId}/followers/`);
  followersRef.child(`${auth.uid}/id`).set(auth.uid);
  followersRef.child(`${auth.uid}/username`).set(auth.displayName);
  // followersRef.child(`${auth.uid}/avatar/url`).set(auth.photoURL);
};

export const removeFollowers = (authId, publisherId) => dispatch => {
  firebase.database().ref(`users/${publisherId}/followers/${authId}`).remove()
};