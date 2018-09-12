import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.scss';
import App from './components/app/app';
import registerServiceWorker from './registerServiceWorker';
import axios from 'axios';
import { createStore, combineReducers } from 'redux';
import reducer from './store/reducer';
import reducerCrm from './store/reducerCrm';
import { Provider } from 'react-redux';

// axios.defaults.baseURL = 'https://ez2xs-4bf38.firebaseio.com/';
// axios.defaults.baseURL = 'http://localhost:3050/api/';
// axios.defaults.baseURL = 'http://172.16.18.167:3050/api/';
axios.defaults.baseURL = 'https://dev-janwillem.ez2xs.com/call/';

// react-poc-ez2xs

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

// For now we only use 'reducer', but just in case we want to use different reducers in the future, we use 'combineReducers'.
const rootReducer = combineReducers({
	redMain: reducer,
	redCrm: reducerCrm
});

// Create the Redux store. the REDUX_DEVTOOLS_EXTENSION part connects the Redux tab in the Chrome developer console to the store.
const store = createStore(
	rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// This piece of JSX renders the entire application.
const app = (
	<Provider store={store}>
		<BrowserRouter>
			<App/>
		</BrowserRouter>
	</Provider>
);

// The JSX is rendered into the DOM element with id 'wrapper', which can be found in /public/index.html
ReactDOM.render(app, document.getElementById('wrapper'));

registerServiceWorker(); // This is all about adding offline capabilities to the application. A kind of default in React.
