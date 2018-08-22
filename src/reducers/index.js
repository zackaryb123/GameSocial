import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import {
  loginModalReducer,
  forgotPasswordReducer,
  resetPasswordReducer,
  uploadModalReducer,
  feedbackModalReducer
} from "./reducer.modal";
import authReducer from "./reducer.auth";
import userReducer from "./reducer.user";
import feedReducer from "./reducer.feed";
import favoritesReducer from "./reducer.favoirites";
import viewsReducer from "./reducer.count.views";
import uploadReducer from "./reducer.upload";
import uploadsReducer from "./reducer.uploads";
import commentsReducer from "./reducer.comments";
import followersReducer from "./reducer.followers";
import followingReducer from "./reducer.following";
import featuredReducer from "./reducer.featured";
import playlistReducer from "./reducer.playlist";
//import lazyFeedReducer from "./reducer.lazy.feed";

const rootReducer = combineReducers({
  form: formReducer,
  auth: authReducer,
  user: userReducer,
  feed: feedReducer,
  favorites: favoritesReducer,
  viewsCount: viewsReducer,
  upload: uploadReducer,
  uploads: uploadsReducer,
  comments: commentsReducer,
  followers: followersReducer,
  following: followingReducer,
  featured: featuredReducer,
  playlist: playlistReducer,
  // lazyFeed: lazyFeedReducer,
  loginModal: loginModalReducer,
  forgotPasswordModal: forgotPasswordReducer,
  resetPasswordModal: resetPasswordReducer,
  uploadModal: uploadModalReducer,
  feedbackModal: feedbackModalReducer
});

export default rootReducer;
