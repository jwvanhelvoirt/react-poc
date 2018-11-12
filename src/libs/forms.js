/**
* @brief  We need a custom function to convert an array of objects (retrieve) to an object structure based on id (save).
* FOR INSTANCE:
*         Retrieve structure:
*         [
*           {
*              id: '1348432',
*              standaard: '1',
*              refteltype: '568766',
*              naam: 'maaldering.health@klm.com'
*           },
*           {
*              id: '1348433',
*              standaard: '0',
*              refteltype: '568767',
*              naam: '+31634081524'
*           },
*         ]
*
*         Send structure:
*         {
*            1348432: {
*              standaard: '1',
*              refteltype: '568766',
*              naam: 'maaldering.health@klm.com'
*            },
*            1348433: {
*              standaard: '0',
*              refteltype: '568767',
*              naam: '+31634081524'
*            }
*          }
* @params  data         All response data of a particular entity (f.i. a person, an organisation, a project).
* @params  input        Name of the attribute that contains the object structure to be saved (f.i. cominfo or niveau4).
* @params  attributes   Attributes to be saved.
*/
export const convertInitialDataFromArrayToObject = (data, input, attributes) => {
  const returnValue = {};

  data[input].forEach((item) => {
    const object = {};

    attributes.forEach((attribute) => {
      object[attribute] = item[attribute];
    });

    returnValue[item.id] = { ...object };
  });

  return returnValue;
};
