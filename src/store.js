import { createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers/rootReducer';

const persistConfig = {
  key: 'root',
  storage
};

const intialState = {};
// const store = createStore(
//   rootReducer,
//   intialState,
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );

// export default store;

const persistedReducer = persistReducer(persistConfig, rootReducer);

// export default () => {
//   const store = createStore(
//     persistedReducer,
//     intialState,
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//   );
//   const persistor = persistStore(store);
//   return { store, persistor };
// };

const store = createStore(
  persistedReducer,
  intialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
const persistor = persistStore(store);
export default { store, persistor };
