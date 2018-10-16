import {
  FORGOT_PASSWORD_MODAL,
  RESET_PASSWORD_MODAL,
  LOGIN_MODAL,
  UPLOAD_MODAL,
  FEEDBACK_MODAL,
  LINKS_MODAL,
  ONEDRIVE_MODAL
} from "../actions/actions.modals";

const loginModalState = {
  openModal: false
};

const forgotPasswordModalState = {
  openModal: false
};

const resetPasswordModalState = {
  openModal: false
};

const uploadModalState = {
  openModal: false
};

const feedbackModalState = {
  openModal: false
};

const linksModalState = {
  openModal: false
};

const oneDriveModalState = {
  openModal: false,
  videos: null
};


export function forgotPasswordReducer(state = forgotPasswordModalState, action){
  switch(action.type){
    case FORGOT_PASSWORD_MODAL:
      // Update value and create new Object
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}

export function resetPasswordReducer(state = resetPasswordModalState, action){
  switch(action.type){
    case RESET_PASSWORD_MODAL:
      // Update value and create new Object
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}

export function loginModalReducer(state = loginModalState, action){
  switch(action.type){
    case LOGIN_MODAL:
      // Update value and create new Object
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}

export function uploadModalReducer(state = uploadModalState, action){
  switch(action.type){
    case UPLOAD_MODAL:
      // Update value and create new Object
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}

export function feedbackModalReducer(state = feedbackModalState, action){
  switch(action.type){
    case FEEDBACK_MODAL:
      // Update value and create new Object
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}

export function linksModalReducer(state = linksModalState, action){
  switch(action.type){
    case LINKS_MODAL:
      // Update value and create new Object
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}

export function oneDriveModalReducer(state = oneDriveModalState, action){
  switch(action.type){
    case ONEDRIVE_MODAL:
      // Update value and create new Object
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}