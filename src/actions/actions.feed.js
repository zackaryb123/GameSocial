import * as firebase from 'firebase';
import _ from 'lodash';

// GET Action
export const FEED_REQUEST = 'FEED_REQUEST';
export const feedRequest = () => ({
  type: FEED_REQUEST
});

export const FEED_GET = 'FEED_SUCCESS';
export const feedGet = (data) => ({
  type: FEED_GET,
  data
});

export const FEED_ERROR = 'FEED_ERROR';
export const feedError = error => ({
  type: FEED_ERROR,
  error
});


export const getFeedOnce = (authId, following) => dispatch => {
  return new Promise((resolve) => {
  dispatch(feedRequest);
    const feed = [];
      _.map(following, followee => {
        return firebase.database().ref(`users/${followee.id}/uploads`).once('value', snapshot => {
          const dataArray = snapshot.val();
          _.forEach(dataArray, data => {
            feed.push(data);
          });
        });
      });

      return firebase.database().ref(`users/${authId}/uploads`).once('value', snapshot => {
        const dataArray = snapshot.val();
        _.forEach(dataArray, data => {
          feed.push(data);
        });
        resolve(feed);
        feed.sort((a,b) => {return a.created_at - b.created_at});
        feed.reverse();
        dispatch(feedGet(feed))
      });
    }).catch(error => dispatch(feedError(error)))
};

