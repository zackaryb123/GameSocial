import * as firebase from 'firebase'
import {FeedItemObj} from './models';

export const FOLLOWING_REQUEST = 'FOLLOWING_REQUEST';
export const followingRequest = () => ({
  type: FOLLOWING_REQUEST,
});

export const FOLLOWING_GET = 'FOLLOWING_GET';
export const followingGet = (data) => ({
  type: FOLLOWING_GET,
  data
});

export const FOLLOWING_ERROR = 'FOLLOWING_ERROR';
export const followingError = error => ({
  type: FOLLOWING_ERROR,
  error
});

//*** ACTIONS ***//

export const getFollowingPromise = (userId) => dispatch => {
  dispatch(followingRequest());
  return new Promise((resolve, reject) => {
    firebase.database().ref(`users/${userId}/following`).once('value', (data) => {
      const following = data.val();
      resolve(dispatch(followingGet(following)));
    })
  })
};

export const getFollowingOnce = (userId) => dispatch => {
  dispatch(followingRequest());
  firebase.database().ref(`users/${userId}/following`).once('value', (data) => {
    dispatch(followingGet(data.val()));
  }).catch(error => dispatch(followingError(error)));
};

//*** SERVICES ***//
export const getInitFollowingState = (authId, publisherId) => dispatch => {
  return new Promise((resolve, reject) => {
    return firebase.database().ref(`users/${authId}/following/${publisherId}`).once('value', (snapshot) => {
      const isFollowed = !!snapshot.val();
      resolve(isFollowed);
    })
  })
};

export const getInitFollowing = (authId) => dispatch => {
  return new Promise((resolve, reject) =>  {
    return firebase.database().ref(`users/${authId}/following`).once('value', snapshot => {
      const followingList = snapshot.val();
      resolve(followingList)
    })
  })
};

export const addFollowing = (authId ,publisher) => dispatch => {
  const followingRef = firebase.database().ref(`users/${authId}/following`);
  followingRef.child(`${publisher.id}/id`).set(publisher.id);
  followingRef.child(`${publisher.id}/username`).set(publisher.username);
  // followingRef.child(`${publisher.id}/avatar/url`).set(publisher.avatar.url);

  firebase.database().ref(`users/${publisher.id}/uploads`).once('value', snapshot => {
    let newFeed = snapshot.val();
    let newFeedCount = snapshot.numChildren();

    // firebase.database().ref(`users/${authId}/feed/count`).once('value', snapshot => {
    //   const newCount = snapshot.val() + newFeedCount;
    //   firebase .database().ref(`users/${authId}/feed/count`).set(newCount);
    // });

    // _.forEach(newFeed, item => {
    //   // const feedItem = new FeedItemObj(item);
    //   firebase.database().ref(`users/${authId}/feed/${item.id}`).set(item);
    // });
  })
};

export const removeFollowing = (authId, publisherId) => dispatch => {
  firebase.database().ref(`users/${authId}/following/${publisherId}`).remove();


  firebase.database().ref(`users/${publisherId}/uploads`).once('value', snapshot => {
    let newFeed = snapshot.val();
    let newFeedCount = snapshot.numChildren();

    // firebase.database().ref(`users/${authId}/feed/count`).once('value', snapshot => {
    //   const newCount = snapshot.val() - newFeedCount;
    //   firebase.database().ref(`users/${authId}/feed/count`).set(newCount);
    // });

    // _.forEach(newFeed, item => {
    //   firebase.database().ref(`users/${authId}/feed/${item.id}`).remove();
    // });
  });
};