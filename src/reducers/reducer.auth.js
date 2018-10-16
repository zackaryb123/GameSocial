import {
  SET_AUTH_TOKEN,
  CLEAR_AUTH,
  AUTH_REQUEST,
  AUTH_GET,
  AUTH_ERROR,
  SET_ONEDRIVE_VIDEO_FILE_ID,
  SET_ONEDRIVE_XBOX_FILE_ID,
  LINK_XBOX_DVR,
  BROWSE_XBOX_DVR,
  XBOX_VIDEOS,
  SET_FACEBOOK
} from "../actions/actions.auth";

const initialState = {
  // authToken: null, // authToken !== null does not mean it has been validated
  xboxVideos: null,
  videoFileId: null,
  xboxFileId: null,
  linkXboxDVR: null,
  browseXboxDVR: null,
  currentUser: null,
  loading: false,
  error: null
};

export default function reducer(state = initialState, action) {
  if (action.type === SET_AUTH_TOKEN) {
    return Object.assign({}, state, {
      authToken: action.authToken
    });
  } else if (action.type === CLEAR_AUTH) {
    return Object.assign({}, state, {
      authToken: null,
      currentUser: null
    });
  } else if(action.type === SET_FACEBOOK){
    return Object.assign({}, state, {
      facebook: action.facebook
    });
  } else if(action.type === XBOX_VIDEOS){
    return Object.assign({}, state, {
      xboxVideos: action.xboxVideos
    });
  } else if(action.type === SET_ONEDRIVE_VIDEO_FILE_ID){
    return Object.assign({}, state, {
      videoFileId: action.videoFileId
    });
  } else if(action.type === SET_ONEDRIVE_XBOX_FILE_ID){
    return Object.assign({}, state,{
      xboxFileId: action.xboxFileId
    });
  } else if(action.type === LINK_XBOX_DVR){
    return Object.assign({}, state, {
      linkXboxDVR: action.linkXboxDVR
    });
  } else if(action.type === BROWSE_XBOX_DVR){
    return Object.assign({}, state,{
      browseXboxDVR: action.browseXboxDVR
    });
  } else if (action.type === AUTH_REQUEST) {
    return Object.assign({}, state, {
      loading: true,
      error: null
    });
  } else if (action.type === AUTH_GET) {
    return Object.assign({}, state, {
      loading: false,
      currentUser: action.currentUser
    });
  } else if (action.type === AUTH_ERROR) {
    return Object.assign({}, state, {
      loading: false,
      error: action.error
    });
  }
  return state;
}