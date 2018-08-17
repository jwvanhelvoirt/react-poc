import React, { Component } from 'react';

/**
 * @brief   Sets the state of the selected tab to the tab the user click on.
 * @params  tabPos    On which tab pane to set the active tab (i.e. activeTabLeft, activeTabRight).
 * @params  activeTab Index of the currently active tab.
 * @params  tabIndex  Index of the tab the user clicks on.
 * @params  _this     This context of the current module.
 */
export const clickHandlerTab = (tabPos, activeTab, tabIndex, _this) => {
    if (activeTab !== tabIndex) {
    _this.setState({
      [tabPos]: tabIndex
    });
  }
}
