import React, { Component } from 'react';
import Screen from '../../components/Parsers/ScreenParser/ScreenParser';
import { tabsConfig } from '../../config/Tabs/TabsCrm';

class ModCrm extends Component {
  render() {
    return (
      <Screen tabsConfig={tabsConfig} />
    );
  }
}

export default ModCrm;
