import React, { Component } from 'react';
import FormTab from './formTab/formTab';
import FormTabContent from './formTabContent/formTabContent';
import classes from './formTabs.scss';

class FormTabs extends Component {

  constructor(props) {
    super(props);

    // By default the initial active tab is the first tab,
    let activeTab = props.tabs[0].label; //
    // This default initial active tab can be overwritten if you set the setting activeTab to 'true'.
    props.tabs.forEach((tab) => activeTab = tab.activeTab ? tab.label : activeTab);

    this.state = { activeTab };
  };

  onClickTabItem = (activeTab) => {
    this.setState({ activeTab });
  };

  render = () => {
    // Tabs: rows>cols>rows>inputs

    const { activeTab } = this.state;
    const { tabs, inputs, defaultFocus, changed, keyUp, configForm, showModal, removeMultiValueItem } = this.props;

    const tabsOutput = tabs.map((tab, index) =>
      <FormTab key={index} label={tab.label} activeTab={activeTab} click={() => this.onClickTabItem(tab.label)}/>
    );

    let tabContent = null;
    tabs.forEach((tab) => {
      if (tab.label === activeTab) {
        tabContent = (
          <FormTabContent tab={tab} inputs={inputs} defaultFocus={defaultFocus} changed={changed} keyUp={keyUp}
            configForm={configForm} showModal={showModal} removeMultiValueItem={removeMultiValueItem} />
        );
      }
    });

    return (
      <div>
        <div className={classes.FormTabs}>
          {tabsOutput}
        </div>
        {tabContent}
      </div>
    );

  };
}

export default FormTabs;
