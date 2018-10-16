import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import {
  loginModalReducer,
  forgotPasswordReducer,
  resetPasswordReducer,
  uploadModalReducer,
  feedbackModalReducer,
  linksModalReducer,
  oneDriveModalReducer
} from "./reducer.modal";
import authReducer from "./reducer.auth";
import userReducer from "./reducer.user";
import favoritesReducer from "./reducer.favoirites";
import viewsReducer from "./reducer.count.views";
import uploadReducer from "./reducer.upload";
import uploadsReducer from "./reducer.uploads";
import feedReducer from "./reducer.feed";
import commentsReducer from "./reducer.comments";
import followersReducer from "./reducer.followers";
import followingReducer from "./reducer.following";
import featuredReducer from "./reducer.featured";
import playlistReducer from "./reducer.playlist";

const rootReducer = combineReducers({
  form: formReducer,
  auth: authReducer,
  user: userReducer,
  favorites: favoritesReducer,
  viewsCount: viewsReducer,
  upload: uploadReducer,
  uploads: uploadsReducer,
  feed: feedReducer,
  comments: commentsReducer,
  followers: followersReducer,
  following: followingReducer,
  featured: featuredReducer,
  playlist: playlistReducer,
  loginModal: loginModalReducer,
  forgotPasswordModal: forgotPasswordReducer,
  resetPasswordModal: resetPasswordReducer,
  uploadModal: uploadModalReducer,
  feedbackModal: feedbackModalReducer,
  linksModal: linksModalReducer,
  oneDriveModal: oneDriveModalReducer
});

export default rootReducer;
