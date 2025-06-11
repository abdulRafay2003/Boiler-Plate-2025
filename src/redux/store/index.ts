import * as storage from "redux-storage";
import { createLogger } from "redux-logger";
import filter from "redux-storage-decorator-filter";
import { legacy_createStore as createStore, applyMiddleware } from "redux";
import createEngine from "redux-storage-engine-reactnativeasyncstorage";

const isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent;

const logger = createLogger({
  predicate: () => isDebuggingInChrome,
  collapsed: true,
  duration: true,
  diff: true,
});

export default function configureStore(reducers, onComplete: Function) {
  const engine = filter(
    createEngine("AppTree"),
    [
    ],
    []
  );


  const store = createStore(
    storage.reducer(reducers)
  );

  if (isDebuggingInChrome) {
    window.store = store;
  }

  const load = storage.createLoader(engine);
  load(store)
    .then(onComplete)
    .catch(() =>{
        console.log("Failed to load previous state @ configureStore.js#44")
    }
    
    );

  return store;
}