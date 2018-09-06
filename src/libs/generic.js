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
}

/**
 * @brief   Convert a string to propercase.
 * @params  label     String containing value to be converted to propercase.
 */
export const propercase = (label) => {
  return label.charAt(0).toUpperCase() + label.substr(1).toLowerCase();
}
