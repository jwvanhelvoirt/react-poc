export const getViewActions = (actions, show, selectedListItems) => {
  let actionsPrimary = actions.filter((action) => action[show]);

  // For actions we display on row hover, we don't check for the number of selected listItems.
  if (show !== 'showOnRowHover') {
    // Actions have two attributes called 'zeroDoc' and 'multiDoc' that hide actions depending on the listView selection.
    switch (selectedListItems.length) {
      case 0:
        actionsPrimary = actionsPrimary.filter((item) => item.zeroDoc);
        break;
      case 1:
        // Only filter at zero listItems or multiple listItems selected.
        break;
      default:
        actionsPrimary = actionsPrimary.filter((item) => item.multiDoc);
    };
  }

  // Actions have an order attribute, so they have a consistent order in every listView. Sort the actions.
  return actionsPrimary.sort((action1, action2) => action1.order - action2.order);
};
