/**
* @brief  We need a custom function to convert response data for all communication info to a value that will be send when the form is saved.
*
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
* @params  data     All response data for a particular instance that contains communication data (f.i. a company or a person).
*/
export const convertInitialCommunicationData = (data) => {
  const returnValue = {};

  data.cominfo.forEach((item) => {
    const object = {};

    object.standaard = item.standaard;
    object.refteltype = item.refteltype;
    object.naam = item.naam;

    returnValue[item.id] = { ...object };
  });

  return returnValue;
}
