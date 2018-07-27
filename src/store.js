import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import {composeWithDevTools} from 'redux-devtools-extension';

//TODO: Learn
// import { persistStore, persistReducer } from 'redux-persist';

import rootReducer from "./reducers";

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(promise,thunk))
);

//persistStore(store);

export default store;