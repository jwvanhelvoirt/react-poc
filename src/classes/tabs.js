import React, { Component } from 'react';

/**
 * @brief   Sets the state of the selected tab to the tab the user click on.
 * @params  _this     This context of the current module.
 * @params  activeTab Index of the currently active tab.
 * @params  tabIndex  Index of the tab the user clicks on.
 * @params  tabPos    On which tab pane to set the active tab (i.e. activeTabLeft, activeTabRight).
 */
export const clickHandlerTab = (tabPos, activeTab, tabIndex, _this) => {
  if (activeTab !== tabIndex) {
    _this.setState({
      [tabPos]: tabIndex
    });
  }
}

/**
 * @brief   Returns the component to be rendered after the user clicks on a tab.
 * @params  activeTab     String containing the id of the currently active tab.
 * @params  tabConfig     Array of objects containing config of all tabs user could click on.
 *                        One of the config items is the component to be returned.
 */
export const getTabComponent = (activeTab, tabConfig) => {
  const component = tabConfig.filter((item) => {
    return item.id === activeTab;
  });
  return component[0].component;
}
