import * as firebase from 'firebase';

export const FEATURED_REQUEST = 'FEATURED_REQUEST';
export const featuredRequest = () => ({
  type: FEATURED_REQUEST,
});

export const FEATURED_GET = 'FEATURED_GET';
export const featuredGet = (data) => ({
  type: FEATURED_GET,
  data
});

export const FEATURED_ERROR = 'FEATURED_ERROR';
export const featuredError = error => ({
  type: FEATURED_ERROR,
  error
});

//*** ACTIONS **//
export const getFeaturedOnce = () => dispatch => {
  dispatch(featuredRequest());
  return firebase.database().ref(`featured`).once('value', (snapshot) => {
    let featured = snapshot.val();
    dispatch(featuredGet(featured));
  }).catch(error => dispatch(featuredError(error)));
};

//*** SERVICES ***//
export const getInitFeaturedState = (uploadId) => dispatch => {
  return new Promise((resolve, reject) => {
    return firebase.database().ref(`featured/${uploadId}`).once('value', snapshot => {
        console.log(snapshot.val());
        let isFeatured = !!snapshot.val();
        resolve(isFeatured);
      });
  })
};

export const addFeatured = (upload) => dispatch => {
  firebase.database().ref(`featured/${upload.id}`).set(upload);
};

export const removeFeatured = (uploadId) => dispatch => {
  firebase.database().ref(`featured/${uploadId}`).remove();
};