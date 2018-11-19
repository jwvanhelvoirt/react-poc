import axios from 'axios';

const callServer = (type, url, successCallback, errorCallback, postData, language, hash, queryParams) => {
  // TODO: url uitbreiden met #hash en ?queryparams en queryparamsvalues
  //https://ez2xs.ez2xs.com/portal/call/api.document.downloadDocument?MAGIC=64daistc7qrn4jjlao47o5vla3&id=1250793
  //https://ez2xs.ez2xs.com/portal/call/api.document.downloadDocument?MAGIC=ni6rgc70ok3u4f15mqcaaot136&id=1250792&

  // If applicable add queryParams to the url.
  if (queryParams) {
    let queryParamsOnUrl = '?';
    queryParams.forEach((queryParam) => {
        queryParamsOnUrl += queryParam.paramName + '=' + queryParam.paramValue + '&';
    });
    url = url + queryParamsOnUrl;
    url = language ? url + 'LANG=' + language : url;
  } else {
    // If applicable, add language as query parameter to the url.
    url = language ? url + '?LANG=' + language : url;
  }

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

    case "open":
    window.open(axios.defaults.baseURL + url);
    break;

    default:
    break;

  }
};

export { callServer };
