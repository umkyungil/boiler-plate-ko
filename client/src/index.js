import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux'; 
import 'antd/dist/antd.css';
import { applyMiddleware, createStore } from  'redux';
import promiseMiddleware from 'redux-promise'
import ReduxThunk from 'redux-thunk';
import Reducer from './_reducers'; // ./_reducers/index.js를 의미한다

// store 생성(함수 및 프로미스를 받을수 있는)
const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore)

ReactDOM.render(
  // redux를 App에 연결하면서 작성한 store 및 Reducer를 대입
  <Provider 
    store={createStoreWithMiddleware(Reducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )}
  >
    <App />
  </Provider>
  , document.getElementById('root'));

