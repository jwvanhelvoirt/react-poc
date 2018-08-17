import React, { Component } from 'react';

import { Nav } from 'reactstrap';
import { tabsConfigLeft, tabsConfigRight } from '../../config/Tabs/TabsCrm';
import { getTabComponent, getTabRow } from '../../classes/tabs.js';

class ModCrm extends Component {
  state = {
    // TODO : Dit moet straks naar REDUX omdat je natuurljk niet wilt dat de tab rechts verandert, als je links op een andere tab klikt.
    activeTabLeft: 'organisation',
    activeTabRight: 'correspondence'
  };

  render() {
    const contentLeft = getTabComponent(this.state.activeTabLeft, tabsConfigLeft);
    const contentRight = getTabComponent(this.state.activeTabRight, tabsConfigRight);

    const linksLeft = getTabRow(this.state.activeTabLeft, tabsConfigLeft, 'activeTabLeft', this);
    const linksRight = getTabRow(this.state.activeTabRight, tabsConfigRight, 'activeTabRight', this);

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
