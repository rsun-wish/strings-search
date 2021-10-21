import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/root';
import { composeWithDevTools } from "redux-devtools-extension";
import promise from 'redux-promise-middleware';
export default function configureStore(initialState = {
  app: {}
}) {
  return createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(promise, thunk)),
  );
}