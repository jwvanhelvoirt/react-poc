import axios from 'axios';
import withErrorHandler from '../hoc/withErrorHandler/withErrorHandler';

const callServer = (type, url, successCallback, errorCallback, postData, hash, queryParams, queryParamsValues) => {
	// TODO: url uitbreiden met #hash en ?queryparams en queryparamsvalues

	switch (type) {
		case "get":
			axios.get(url)
				.then(successCallback)
				.catch(errorCallback);
			break;
		case "post":
			axios.post(url, postData)
				.then(successCallback)
				.catch(errorCallback);
			break;
		case "put":
			axios.put(url, postData)
				.then(successCallback)
				.catch(errorCallback);
			break;
		case "delete":
			axios.delete(url)
				.then(successCallback)
				.catch(errorCallback);
			break;
	}
}

export { callServer };
