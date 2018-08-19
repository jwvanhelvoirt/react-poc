import React, { Component } from 'react';
import Responsive from 'react-responsive';
import { Nav } from 'reactstrap';
import { getTabComponent, getTabRow } from '../../../classes/tabs.js';
import classes from './ScreenParser.scss';

class Screen extends Component {
  Large = props => <Responsive {...props} minWidth={1280} />;
  Medium = props => <Responsive {...props} minWidth={768} maxWidth={1279} />;
  Small = props => <Responsive {...props} maxWidth={767} />;

  constructor(props) {
    super(props);

    this.state = {};
    this.props.tabsConfig.forEach((pane) => {
      pane.blocks.forEach((block) => {
        this.state[block.id] = block.activeTab;
      });
    });
  }

  getHtml = (display) => {
    const tabsConfig = this.props.tabsConfig.filter((pane) => {
      return pane[display];
    });

    const result = tabsConfig.map((pane, indexPane) => {
      const html = pane.blocks.map((block, indexBlock) => {
        const links = getTabRow(this.state[block.id], block.tabs, block.id, this);
        const content = getTabComponent(this.state[block.id], block.tabs);
        return (
          <div key={indexBlock} className={classes.Listview}>
            <div className={classes.ListviewBar}>
              <Nav tabs>{links}</Nav>
            </div>
            <div className={classes.ListviewContent}>
              {content}
            </div>
          </div>
        );
      });
      return <div key={indexPane} className={classes.ListviewWrapper}>{html}</div>;
    });

    return result;
  }

  render() {
    // TODO : Laadt ze nu allemaal in, eigenlijk wil je alleen laden, wat nodig is. Uitzoeken...
    const large = this.getHtml('displayLarge');
    const medium = this.getHtml('displayMedium');
    const small = this.getHtml('displaySmall');

    return (
      <div>
        <this.Large>{large}</this.Large>
        <this.Medium>{medium}</this.Medium>
        <this.Small>{small}</this.Small>
      </div>
    );
  }
}

export default Screen;
