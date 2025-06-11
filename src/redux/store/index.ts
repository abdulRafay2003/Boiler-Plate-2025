// import * as storage from "redux-storage";
// import { createLogger } from "redux-logger";
// import filter from "redux-storage-decorator-filter";
// import { legacy_createStore as createStore, applyMiddleware } from "redux";
// import createEngine from "redux-storage-engine-reactnativeasyncstorage";

// const isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent;

// const logger = createLogger({
//   predicate: () => isDebuggingInChrome,
//   collapsed: true,
//   duration: true,
//   diff: true,
// });

// export default function configureStore(reducers, onComplete: Function) {
//   const engine = filter(
//     createEngine("AppTree"),
//     [
//     ],
//     []
//   );

//   const store = createStore(
//     storage.reducer(reducers)
//   );

//   if (isDebuggingInChrome) {
//     window.store = store;
//   }

//   const load = storage.createLoader(engine);
//   load(store)
//     .then(onComplete)
//     .catch(() =>{
//         console.log("Failed to load previous state @ configureStore.js#44")
//     }

//     );

//   return store;
// }

import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from 'redux';
import userReducer from '../slice/UserSlice/userSlice';
import authReducer from '../slice/AuthSlice/authSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'user'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // Important for redux-persist
    }),
});

export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const dispatchToStore = (action: any) => store.dispatch(action);
