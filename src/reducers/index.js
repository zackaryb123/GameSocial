import { combineReducers } from 'redux'
import {reducer as formReducer} from "redux-form";
import {loginModalReducer, forgotPasswordReducer,
  resetPasswordReducer, uploadModalReducer, feedbackModalReducer} from "./reducer.modal";
import authReducer from './reducer.auth';
import userReducer from './reducer.user';
import feedReducer from './reducer.feed';
import likesReducer from './reducer.likes';

const rootReducer = combineReducers({
  form: formReducer,
  auth: authReducer,
  user: userReducer,
  feed: feedReducer,
  likes: likesReducer,
  loginModal: loginModalReducer,
  forgotPasswordModal: forgotPasswordReducer,
  resetPasswordModal: resetPasswordReducer,
  uploadModal: uploadModalReducer,
  feedbackModal: feedbackModalReducer
});

export default rootReducer;