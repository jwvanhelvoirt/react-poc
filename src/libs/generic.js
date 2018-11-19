import { callServer } from '../api/api';

/**
* @brief   Calculates the display value. Handles translation and conversion.
* @params  displayValue            String containing value to be displayed. This might be a translate key.
* @params  convertDisplayValues    String containing the conversion type ('lowercase, uppercase or propercase').
* @params  translateDisplayValues  Boolean indicating if the displayValue is a translate key and therefore should be translated.
* @params  translates              Object containing all translate keys with the corresponding values.
*/
export const getDisplayValue = (displayValue, convertDisplayValues, translateDisplayValues, translates) => {

  let value = translateDisplayValues ? (translates[displayValue] ? translates[displayValue] : displayValue) : displayValue;

  switch (convertDisplayValues) {

    case 'propercase':
    value = propercase(value);
    break;

    case 'uppercase':
    value = value.toUpperCase();
    break;

    case 'lowercase':
    value = value.toLowerCase();
    break;

    default:
    break;

  }

  return value;
};

/**
* @brief   Convert a string to propercase.
* @params  label     String containing value to be converted to propercase.
*/
export const propercase = (label) => {
  return label.charAt(0).toUpperCase() + label.substr(1).toLowerCase();
};

export const leftString = (string, searchValue) => {
  const pos = string.indexOf(searchValue, 0);
  return string.substring(0, pos);
}

/**
* @brief   Creates a nested object based on an array and assigns a value to the most deep nested object.
* @params  obj
* @params  keyPath
* @params  value
*/
export const assignObject = (obj, keyPath, value) => {
  const lastKeyIndex = keyPath.length-1;
  for (var i = 0; i < lastKeyIndex; ++ i) {
    const key = keyPath[i];
    if (!(key in obj))
    obj[key] = {}
    obj = obj[key];
  }
  obj[keyPath[lastKeyIndex]] = value;
  return obj;
}

export const isEqual = (value, other) => {
  // Get the value type
  var type = Object.prototype.toString.call(value);

  // If the two objects are not the same type, return false
  if (type !== Object.prototype.toString.call(other)) return false;

  // If items are not an object or array, return false
  if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

  // Compare the length of the length of the two items
  var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
  var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) return false;

  // Compare two items
  var compare = function (item1, item2) {

    // Get the object type
    var itemType = Object.prototype.toString.call(item1);

    // If an object or array, compare recursively
    if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
      if (!isEqual(item1, item2)) return false;
    }

    // Otherwise, do a simple comparison
    else {

      // If the two items are not the same type, return false
      if (itemType !== Object.prototype.toString.call(item2)) return false;

      // Else if it's a function, convert to a string and compare
      // Otherwise, just compare
      if (itemType === '[object Function]') {
        if (item1.toString() !== item2.toString()) return false;
      } else {
        if (item1 !== item2) return false;
      }

    }
  };

  // Compare properties
  if (type === '[object Array]') {
    for (var i = 0; i < valueLen; i++) {
      if (compare(value[i], other[i]) === false) return false;
    }
  } else {
    for (var key in value) {
      if (value.hasOwnProperty(key)) {
        if (compare(value[key], other[key]) === false) return false;
      }
    }
  }

  // If nothing failed, return true
  return true;
};

// Converts selected image to a base64 string.
export const getBase64 = (file, onLoadCallback) => {
    return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        reader.onload = function() { resolve(reader.result); };
        reader.onerror = reject;
        if (file) {
          reader.readAsDataURL(file); // Is assynchronous, so this method returns a promise.
        }
    });
};

export const downloadAttachment = (id) => {
  const queryParams = [
    { paramName: 'MAGIC', paramValue: localStorage.getItem('magic') },
    { paramName: 'id', paramValue: id }
  ];

  callServer('open', 'portal/call/api.document.downloadDocument', null, null, null, null, null, queryParams);

};
