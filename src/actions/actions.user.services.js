import * as firebase from "firebase";
import _ from "lodash";
import {uploadsRequest, uploadsGet, uploadsError } from "./actions.uploads";

const LOAD_COUNT = 20;
const ORDER_DATE = 'created_at';

// Favorites //
export const getUserUploadsOnce = (
  userId,
  date,
  page,
  count,
  activeMenu
) => dispatch => {
  dispatch(uploadsRequest);

  return new Promise((resolve, reject) => {
    return firebase
      .database()
      .ref(`users/${userId}/${activeMenu}`)
      .orderByChild(ORDER_DATE)
      .startAt(date)
      .limitToLast(count)
      .once("value", snapshot => {
        const load = snapshot.val();

        let loadArray = [];
        _.forEach(load, item => {
          loadArray.push(item);
        });
        loadArray.reverse();

        firebase
          .database()
          .ref(`users/${userId}/${activeMenu}`)
          .once("value", snap => {
            let total = snap.numChildren();
            console.log(total);
            const data = { page: 1, date: date, total: total };

            resolve(data);
            dispatch(uploadsGet(loadArray, date, page, total));
          });
      });
  }).catch(error => dispatch(uploadsError(error)));
};

export const getNextUserUploadsOnce = (
  authId,
  date,
  page,
  count,
  activeMenu
) => dispatch => {
  dispatch(uploadsRequest);

  return new Promise((resolve, reject) => {
    return firebase
      .database()
      .ref(`users/${authId}/${activeMenu}`)
      .orderByChild(ORDER_DATE)
      .endAt(date)
      .limitToLast(count + 1)
      .once("value", snapshot => {
        const load = snapshot.val();

        let loadArray = [];
        _.forEach(load, item => {
          loadArray.push(item);
        });
        loadArray.reverse();
        loadArray.shift();

        firebase
          .database()
          .ref(`users/${authId}/${activeMenu}`)
          .once("value", snap => {
            let total = snap.numChildren();
            const data = { page: page + 1, date: date, total: total };
            resolve(data);
            dispatch(uploadsGet(loadArray, date, total));
          });
      });
  }).catch(error => dispatch(uploadsError(error)));
};

export const getPrevUserUploadsOnce = (
  authId,
  date,
  page,
  count,
  activeMenu
) => dispatch => {
  dispatch(uploadsRequest);

  return new Promise((resolve, reject) => {
    return firebase
      .database()
      .ref(`users/${authId}/${activeMenu}`)
      .orderByChild(ORDER_DATE)
      .startAt(date)
      .limitToFirst(count + 1)
      .once("value", snapshot => {
        const load = snapshot.val();

        let loadArray = [];
        _.forEach(load, item => {
          loadArray.push(item);
        });

        loadArray.reverse();
        loadArray.pop();

        firebase
          .database()
          .ref(`users/${authId}/${activeMenu}`)
          .once("value", snap => {
            let total = snap.numChildren();

            const data = { page: page - 1, date: date, total: total };

            resolve(data);
            dispatch(uploadsGet(loadArray, date, total));
          });
      });
  }).catch(error => dispatch(uploadsError(error)));
};