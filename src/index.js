import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.scss';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import axios from 'axios';

import { createStore, combineReducers, compose } from 'redux';
import reducer from './store/Reducer';
import reducerCrm from './store/ReducerCrm';
import { Provider } from 'react-redux';

// axios.defaults.baseURL = 'https://ez2xs-4bf38.firebaseio.com/';
axios.defaults.baseURL = 'http://localhost:3050/api/';

// Configure interceptor for handling requests globally.
//axios.interceptors.request.use(request => {
//	//console.log(request);
//	return request; // To prevent blocking the request.
//}, error => {
//	//console.log(error);
//	return Promise.reject(error); // To prevent blocking local error handling with the catch method.
//	});

//// Configure interceptor for handling responses globally.
//axios.interceptors.response.use(response => {
//	//console.log(response);
//	return response; // To prevent blocking the response.
//}, error => {
//	//console.log(error);
//	return Promise.reject(error); // To prevent blocking local error handling with the catch method.
//});

const rootReducer = combineReducers({
	redMain: reducer,
	redCrm: reducerCrm
});

const store = createStore(
	rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const app = (
	<Provider store={store}>
		<BrowserRouter>
			<App/>
		</BrowserRouter>
	</Provider>
);

ReactDOM.render(app, document.getElementById('wrapper'));
registerServiceWorker();
