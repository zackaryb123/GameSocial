import { FORGOT_PASSWORD_MODAL, RESET_PASSWORD_MODAL, LOGIN_MODAL } from '../actions/actions.modals';

const loginModalState = {
  openModal: false
};

const forgotPasswordModalState = {
  openModal: false
};

const resetPasswordModalState = {
  penModal: false
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