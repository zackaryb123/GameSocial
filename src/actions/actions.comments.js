import * as firebase from  'firebase';
import {CommentObj} from './models';

export const COMMENTS_REQUEST = 'COMMENTS_REQUEST';
export const commentsRequest = () => ({
  type: COMMENTS_REQUEST,
});

export const COMMENTS_GET = 'COMMENTS_GET';
export const commentsGet = (comment) => ({
  type: COMMENTS_GET,
  comment
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

    _.forEach(comments, comment => {
      firebase.database().ref(`users/${comment.publisher.id}/profile`).once('value', snap => {
        let publisher = snap.val();
        comment.publisher = publisher;
        console.log(comment);
        dispatch(commentsGet(comment))
      })
    });
  })
};

//SERVICES
export const addComment = (auth, uploadId, values) => dispatch => {
  const commentId = firebase.database().ref(`/comments/${uploadId}`).push().key;
  const commentRef = firebase.database().ref(`/comments/${uploadId}/${commentId}`);
  const commentObj = new CommentObj(uploadId, commentId, auth, values);
  commentRef.set(commentObj);
};