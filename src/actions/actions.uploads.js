import  * as firebase from "firebase";
import { feedGet } from "./actions.feed";

// GET Action
export const UPLOADS_REQUEST = 'UPLOADS_REQUEST';
export const uploadsRequest = () => ({
  type: UPLOADS_REQUEST
});

export const UPLOADS_GET = 'UPLOADS_GET';
export const uploadsGet = (data, date, page, total) => ({
  type: UPLOADS_GET,
  data: data,
  date: date,
  page: page,
  total: total
});

export const UPLOADS_ERROR = 'UPLOADS_ERROR';
export const uploadsError = error => ({
  type: UPLOADS_ERROR,
  error
});

// Variables
const LOAD_COUNT = 20;
const ORDER_DATE = 'created_at';

// Actions
export const getUploadsOnce = (date, page, count) => dispatch => {
  dispatch(uploadsRequest());
  return new Promise ((resolve, reject) => {
    return firebase.database().ref('uploads/')
      .orderByChild(ORDER_DATE)
      .startAt(date)
      .limitToLast(count)
      .once('value', snapshot => {
        const data = snapshot.val();

        let uploadsArray = [];
        _.forEach(data, i => {
          uploadsArray.push(i);
        });
        uploadsArray.reverse();

        firebase.database().ref('uploads').once('value', snap => {
          let total = snap.numChildren();
          const data = { page: 1, date: date, total: total };

          resolve(data);
          dispatch(uploadsGet(uploadsArray, date, page, total))
        });
      })
  }).catch(error => dispatch(uploadsError(error)))
};

export const getNextUploadsOnce = (date, page, count) => dispatch => {
  dispatch(uploadsRequest());
  return new Promise ((resolve, reject) => {
    return firebase.database().ref('uploads/')
      .orderByChild(ORDER_DATE)
      .endAt(date)
      .limitToLast(count+1)
      .once('value', snapshot => {
        const data = snapshot.val();

        let uploadsArray = [];
        _.forEach(data, i => {
          uploadsArray.push(i);
        });
        uploadsArray.reverse();
        uploadsArray.shift();

        return firebase.database().ref('uploads').once('value', snap => {
          let total = snap.numChildren();
          const data = { page: page+1, date: date, total: total };

          resolve(data);
          dispatch(uploadsGet(uploadsArray, date, page, total))
        });
      })
  }).catch(error => dispatch(uploadsError(error)))
};

export const getPrevUploadsOnce = (date, page, count) => dispatch => {
  dispatch(uploadsRequest());

  return new Promise ((resolve, reject) => {
    return firebase.database().ref('uploads/')
      .orderByChild(ORDER_DATE)
      .startAt(date)
      .limitToFirst(count+1)
      .once('value', snapshot => {
        const data = snapshot.val();

        let uploadsArray = [];
        _.forEach(data, i => {
          uploadsArray.push(i);
        });

        uploadsArray.reverse();
        uploadsArray.pop();

        firebase.database().ref('uploads').once('value', snap => {
          let total = snap.numChildren();
          const data = { page: page-1, date: date, total: total };

          resolve(data);
          dispatch(uploadsGet(uploadsArray, date, page, total))
        });
      })
  }).catch(error => dispatch(uploadsError(error)))
};