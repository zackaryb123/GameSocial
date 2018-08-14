import * as firebase from  'firebase';

export const COMMENTS_REQUEST = 'COMMENTS_REQUEST';
export const commentsRequest = () => ({
  type: COMMENTS_REQUEST,
});

export const COMMENTS_GET = 'COMMENTS_GET';
export const commentsGet = (data) => ({
  type: COMMENTS_GET,
  data
});

export const COMMENTS_ERROR = 'COMMENTS_ERROR';
export const commentsError = error => ({
  type: COMMENTS_ERROR,
  error
});

// ACTIONS

export const getCommentsOnce = (uploadId) => dispatch => {
  dispatch(commentsRequest());
  return firebase.database().ref(`/comments/${uploadId}`).once('value', snapshot => {
    const comments = snapshot.val();
    dispatch(commentsGet(comments));
  }).catch(error => dispatch(commentsError(error)))
};

export const getComments = (uploadId) => dispatch => {
  dispatch(commentsRequest());
  return firebase.database().ref(`/comments/${uploadId}`).on('value', snapshot => {
    const comments = snapshot.val();
    dispatch(commentsGet(comments));
  })
};

export const getCommentsPromise = (uploadId) => dispatch => {
  dispatch(commentsRequest());
  return new Promise((resolve, reject) => {
    firebase.database().ref(`/comments/${uploadId}`).once('value', data => {
      const comments = data.val();
      dispatch(commentsGet(comments));
      resolve(comments);
    }).catch(error => dispatch(error))
  })
};

//SERVICES
export const addComment = (auth, uploadId, values) => dispatch => {
  const commentId = firebase.database().ref(`/comments/${uploadId}`).push().key;
  const commentRef = firebase.database().ref(`/comments/${uploadId}/${commentId}`);
  // commentRef.child('/profile/avatar/url').set(auth.photoURL);
  commentRef.child('/comment').set(values.comment);
  commentRef.child('/uploadId').set(uploadId);
  commentRef.child('/commentId').set(commentId);
  commentRef.child('/profile/username').set(auth.displayName);
  commentRef.child('profile/id').set(auth.uid);

  // const userRef = firebase.database().ref(`/users/${auth.uid}/comments/${uploadId}/${commentId}`);
  // userRef.child('/uploadId').set(uploadId);
  // userRef.child('/commentId').set(commentId);
};