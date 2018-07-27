import { combineReducers } from 'redux'
import {reducer as formReducer} from "redux-form";
import {loginModalReducer, forgotPasswordReducer, resetPasswordReducer} from "./reducer.modal";
import authReducer from './reducer.auth';

const rootReducer = combineReducers({
  form: formReducer,
  auth: authReducer,
  loginModal: loginModalReducer,
  forgotPasswordModal: forgotPasswordReducer,
  resetPasswordModal: resetPasswordReducer
});

export default rootReducer;