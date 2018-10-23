import React from 'react';

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

// getContent(column.content, listItem);

export const getContent = (contentProp, listItem, classes) => {
  let listItemColumnContent = null;

  if (typeof contentProp === 'string') {
    // Printing a single attribute.
    listItemColumnContent = listItem[contentProp];
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

        switch (part.type) {
          case 'prop':
            return <span key={index} className={additionalClasses}>{listItem[part.value]}</span>;
          default:
            return <span key={index} className={additionalClasses}>{part.value}</span>;
        }
      });

      return <div key={index}>{lineParts}</div>
    });

  }

  return listItemColumnContent;

};
