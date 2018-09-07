import React from 'react';
import Tab from '../components/ui/tab/tab';

/**
 * @brief   Sets the state of the selected tab to the tab the user click on.
 * @params  _this       This context of the current module.
 * @params  activeTab   String containing the id of the currently active tab.
 * @params  tabIndex    String containing the id of the tab the user clicks on.
 * @params  tabPos      String containing which tab pane to set the active tab (i.e. activeTabLeft, activeTabRight).
 */
export const clickHandlerTab = (tabPos, activeTab, tabIndex, _this) => {
  if (activeTab !== tabIndex) {
    let activeTabsUpdated = { ..._this.state.activeTabs }
    const activeTabsKeys = Object.keys({ ..._this.state.activeTabs });

    activeTabsKeys.forEach((item) => {
      if (item === tabPos) {
        activeTabsUpdated[item] = tabIndex;
      }
    });

    _this.setState({
      activeTabs: activeTabsUpdated
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

/**
 * @brief   Returns a row of related tabs.
 * @params  _this         This context of the current module.
 * @params  activeTab     String containing the id of the currently active tab.
 * @params  tabConfig     Array of objects containing config of all tabs user could click on.
 * @params  tabPos        String containing which tab pane to set the active tab (i.e. activeTabLeft, activeTabRight).
 */
export const getTabRow = (activeTab, tabConfig, tabPos, _this) => {
  const tabRow = tabConfig.map((item) => {
    return <Tab
      key={item.id}
      tabItem={item}
      activeTab={activeTab}
      clicked={() => clickHandlerTab(tabPos, activeTab, item.id, _this)}
    />
  });
  return tabRow;
}
