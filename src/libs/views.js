import React from 'react';
import Moment from 'react-moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const getViewActions = (actions, show, selectedListItems) => {
  let actionsPrimary = actions.filter((action) => action[show]);

  // For actions we display on row hover, we don't check for the number of selected listItems.
  if (show !== 'showOnRowHover') {
    // Actions have two attributes called 'zeroRow' and 'multiRow' that hide actions depending on the listView selection.
    switch (selectedListItems.length) {
      case 0:
        actionsPrimary = actionsPrimary.filter((item) => item.zeroRow);
        break;
      case 1:
        // Only filter at zero listItems or multiple listItems selected.
        break;
      default:
        actionsPrimary = actionsPrimary.filter((item) => item.multiRow);
    };
  }

  // Actions have an order attribute, so they have a consistent order in every listView. Sort the actions.
  return actionsPrimary.sort((action1, action2) => action1.order - action2.order);
};

export const getColumnClasses = (column, defaultClasses, classes) => {
  // Calculate column classes. We can configure columns to show only on particular screen sizes.
  let arrayClassesScreen = [];

  if (column.columnClasses) {
    arrayClassesScreen = column.columnClasses.map((className) => {
      return classes[className];
    });
  }

  const arrayClasses = [
    ...arrayClassesScreen,
    ...defaultClasses
  ];

  return arrayClasses.join(' ');
};

export const getContent = (contentProp, listItem, classes, columnProps) => {
  let listItemColumnContent = null;

  if (typeof contentProp === 'string') {
    // Printing a single attribute.
    listItemColumnContent = formatValue(listItem[contentProp], columnProps);
  } else {
    // Printing concatenated attributes or multiple lines.

    // Loop through all lines.
    listItemColumnContent = contentProp.lines.map((line, index) => {

      // Loop through all parts of data to be printed on a single line.
      const lineParts = line.lineData.map((part, index) => {
        let additionalClasses = null;
        if (part.classes) {
          const arrayAdditionalClasses = part.classes.map((className) => {
            return classes[className];
          });
          additionalClasses = arrayAdditionalClasses.join(' ');
        }

        // Check if the value is based on conditions.
        const value = part.value.conditions ?
          getValueBasedOnConditions(part.value.conditions, listItem) :
          part.value;

        // Check if there's a color property. And if so if it's value is based on conditions.
        const color = part.color && part.color.conditions ?
          getValueBasedOnConditions(part.color.conditions, listItem) :
          part.color ? listItem[part.color] : 'inherit';

        switch (part.type) {

          case 'prop':
          return <span key={index} className={additionalClasses}>{formatValue(listItem[value], columnProps)}</span>;

          case 'icon':
          return (
            <span key={index} style={{ color: color }} className={additionalClasses}>
              <FontAwesomeIcon icon={['far', value]} />
            </span>
          );

          default:
          return <span key={index} className={additionalClasses}>{value}</span>;

        }
      });

      return <div key={index}>{lineParts}</div>
    });

  }

  return listItemColumnContent;

};

const getValueBasedOnConditions = (conditions, listItem) => {
    const fieldValue = listItem[conditions.field];

  let returnVal = '';
  conditions.check.forEach((item) => {
    if (Array.isArray(item.checkValue)) {
      // Values to be compared with the field value are collected in an array.
      item.checkValue.forEach((checkVal) => {
        if (checkVal === fieldValue) {
          returnVal = item.value;
        }
      });
    } else {
      if (item.checkValue === fieldValue) {
        returnVal = item.value;
      }
    }

  });

  return returnVal;
};

const formatValue = (value, columnProps) => {
  let returnValue = value;

  if (columnProps && columnProps.date) {

    switch (columnProps.dateType) {

      case 'datetime':
      returnValue = <Moment format="DD-MM-YYYY HH:mm">{value}</Moment>;
      break;

      case 'date':
      default:
      returnValue = <Moment format="DD-MM-YYYY">{value}</Moment>;
      break;

      case 'fromNow':
      returnValue = <Moment fromNow>{value}</Moment>;
      break;

    }

  }

  return returnValue;
};
