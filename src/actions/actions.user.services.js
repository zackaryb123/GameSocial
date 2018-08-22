import * as firebase from "firebase";
import _ from "lodash";
import {uploadsRequest, uploadsGet, uploadsError } from "./actions.uploads";

const LOAD_COUNT = 20;
const ORDER_DATE = 'created_at';
const ORDER_INDEX = 'index';

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
            dispatch(uploadsGet(loadArray, date, page, total));
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
            dispatch(uploadsGet(loadArray, date, page, total));
          });
      });
  }).catch(error => dispatch(uploadsError(error)));
};


//////////// Playlist///////////////////
export const getUserPlaylistOnce = (
  userId,
  start,
  page,
  count,
  activeMenu
) => dispatch => {
  dispatch(uploadsRequest);

  return new Promise((resolve, reject) => {
    return firebase
      .database()
      .ref(`users/${userId}/playlist/${activeMenu}`)
      .orderByChild(ORDER_INDEX)
      .startAt(start)
      .limitToFirst(count)
      .once("value", snapshot => {
        const load = snapshot.val();

        console.log('load:', load);

        let loadArray = [];
        _.forEach(load, item => {
          loadArray.push(item);
        });

        loadArray.sort((a, b) => {
          return a.index - b.index;
        });

        console.log('Array:', loadArray);
        // loadArray.reverse();
        // console.log('Array rev:', loadArray);

        firebase
          .database()
          .ref(`users/${userId}/playlist/${activeMenu}`)
          .once("value", snap => {
            let total = snap.numChildren()-1;
            console.log(total);
            const data = {start: start, page: 1, total: total };

            resolve(data);
            dispatch(uploadsGet(loadArray, start, page, total));
          });
      });
  }).catch(error => dispatch(uploadsError(error)));
};

export const getNextUserPlaylistOnce = (
  authId,
  start,
  page,
  count,
  activeMenu
) => dispatch => {
  dispatch(uploadsRequest);

  return new Promise((resolve, reject) => {
    return firebase
      .database()
      .ref(`users/${authId}/playlist/${activeMenu}`)
      .orderByChild(ORDER_INDEX)
      .endAt(start)
      .limitToLast(count)
      .once("value", snapshot => {
        const load = snapshot.val();

        console.log('load:',load);

        let loadArray = [];
        _.forEach(load, item => {
          if (item.index >= start) {
            loadArray.push(item);
          }
        });

        loadArray.sort((a, b) => {
          return a.index - b.index;
        });

        // loadArray.reverse();
        // loadArray.shift();

        firebase
          .database()
          .ref(`users/${authId}/playlist/${activeMenu}`)
          .once("value", snap => {
            let total = snap.numChildren()-1;
            const data = { start: start, page: page + 1, total: total };
            resolve(data);
            dispatch(uploadsGet(loadArray, start, page, total));
          });
      });
  }).catch(error => dispatch(uploadsError(error)));
};

export const getPrevUserPlaylistOnce = (
  authId,
  start,
  page,
  count,
  activeMenu
) => dispatch => {
  dispatch(uploadsRequest);

  return new Promise((resolve, reject) => {
    return firebase
      .database()
      .ref(`users/${authId}/playlist/${activeMenu}`)
      .orderByChild(ORDER_INDEX)
      .startAt(start)
      .limitToFirst(count)
      .once("value", snapshot => {
        const load = snapshot.val();

        console.log('load:',load);

        let loadArray = [];
        _.forEach(load, item => {
          if (item.index >= start) {
            loadArray.push(item);
          }
        });

        loadArray.sort((a, b) => {
          return a.index - b.index;
        });

        // loadArray.reverse();
        // loadArray.pop();

        firebase
          .database()
          .ref(`users/${authId}/playlist/${activeMenu}`)
          .once("value", snap => {
            let total = snap.numChildren()-1;

            const data = { start: start, page: page - 1, total: total };

            resolve(data);
            dispatch(uploadsGet(loadArray, start, page, total));
          });
      });
  }).catch(error => dispatch(uploadsError(error)));
};