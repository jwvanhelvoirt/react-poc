import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary';
import { Nav } from 'reactstrap';
import Tab from '../../components/Content/Tab/Tab';
import { tabsConfigLeft, tabsConfigRight } from '../../config/Tabs/TabsCrm';
import TabContentOrganisation from '../../components/Content/TabContent/Organisation/Organisation';
import { clickHandlerTab } from '../../classes/tabs.js';

class ModCrm extends Component {
  state = {
    activeTabLeft: 'organisation',
    activeTabRight: 'correspondence'
  };

  render() {
    let contentLeft = null;
    switch (this.state.activeTabLeft) {
      case 'organisation':
        contentLeft = <TabContentOrganisation />;
        break;
      case 'person':
        contentLeft = <div>Persoon</div>;
        break;
      case 'project':
        contentLeft = <div>Project</div>;
        break;
      case 'task':
        contentLeft = <div>Taak</div>;
        break;
    }

    let contentRight = null;
    switch (this.state.activeTabRight) {
      case 'correspondence':
        contentRight = <div>Correspondentie</div>;
        break;
      case 'email':
        contentRight = <div>Email</div>;
        break;
      case 'organigram':
        contentRight = <div>Organigram</div>;
        break;
    }

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
