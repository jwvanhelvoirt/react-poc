import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary';
import { Nav } from 'reactstrap';
import Tab from '../../components/Content/Tab/Tab';
import { tabsConfigLeft, tabsConfigRight } from '../../config/Tabs/TabsCrm';
import TabContentOrganisation from '../../components/Content/TabContent/Organisation/Organisation';
import { clickHandlerTab, getTabComponent } from '../../classes/tabs.js';

class ModCrm extends Component {
  state = { // Dit moet straks naar REDUX omdat je natuurljk niet wilt dat de tab recht veranderd, als je links op een andere tab klikt.
    activeTabLeft: 'organisation',
    activeTabRight: 'correspondence'
  };

  render() {
    const contentLeft = getTabComponent(this.state.activeTabLeft, tabsConfigLeft);
    const contentRight = getTabComponent(this.state.activeTabRight, tabsConfigRight);

    const linksLeft = tabsConfigLeft.map((tabItem) => {
      return <Tab
        key={tabItem.id}
        tabItem={tabItem}
        activeTab={this.state.activeTabLeft}
        clicked={() => clickHandlerTab('activeTabLeft', this.state.activeTabLeft, tabItem.id, this)} />
    });

    const linksRight = tabsConfigRight.map((tabItem) => {
      return <Tab
        key={tabItem.id}
        tabItem={tabItem}
        activeTab={this.state.activeTabRight}
        clicked={() => clickHandlerTab('activeTabRight', this.state.activeTabRight, tabItem.id, this)} />
    });

    return (
    <div className="ContentWindow">
      <div>
        <Nav tabs>
          {linksLeft}
        </Nav>
        {contentLeft}
      </div>
      <div>
        <Nav tabs>
          {linksRight}
        </Nav>
        {contentRight}
      </div>
    </div>
    );
  }

}

export default ModCrm;
