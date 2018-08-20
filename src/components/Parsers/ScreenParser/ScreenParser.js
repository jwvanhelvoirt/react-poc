import React, { Component } from 'react';
import Responsive from 'react-responsive';
import { Nav } from 'reactstrap';
import { getTabComponent, getTabRow } from '../../../classes/tabs.js';
import Button from '../../UI/Button/Button';
import classes from './ScreenParser.scss';

class Screen extends Component {
  Large = props => <Responsive {...props} minWidth={1280} />;
  Medium = props => <Responsive {...props} minWidth={768} maxWidth={1279} />;
  Small = props => <Responsive {...props} maxWidth={767} />;

  constructor(props) {
    super(props);

    this.state = { tabsConfig: [...this.props.tabsConfig] };
    this.state.tabsConfig.forEach((pane) => {
      pane.blocks.forEach((block) => {
        this.state[block.id] = block.activeTab;
      });
    });
  }

  togglePane = (id) => {
    // Clone the state.
    const updatedTabsConfig = [
      ...this.state.tabsConfig
    ]

    const arrayRecords = Object.keys(updatedTabsConfig);
    arrayRecords.forEach((index) => {
      let updatedTabsConfigElement = {
        ...updatedTabsConfig[arrayRecords[index]]
      }

      if (updatedTabsConfigElement.id === id) {
        updatedTabsConfigElement.show = !updatedTabsConfigElement.show;
        updatedTabsConfig[arrayRecords[index]] = updatedTabsConfigElement;
      }
    });

    // Modify the state.
    this.setState({
      tabsConfig: updatedTabsConfig
    });
  }

  getHtml = (display) => {
    const tabsConfig = this.state.tabsConfig.filter((pane) => {
      return pane[display];
    });

    const result = tabsConfig.map((pane, indexPane) => {
      const buttonShow = <Button
        color="success"
        labelIcon="plus"
        clicked={() => this.togglePane(pane.id)}
      />

    const buttonHide = <Button
        color="secondary"
        outline="true"
        labelIcon="minus"
        clicked={() => this.togglePane(pane.id)}
      />

      let html = "";
      if (pane.show) {
        html = pane.blocks.map((block, indexBlock) => {
          const links = getTabRow(this.state[block.id], block.tabs, block.id, this);
          const content = getTabComponent(this.state[block.id], block.tabs);

          const toggle = pane.toggle ? (pane.show ? buttonHide : "") : "";

          return (
            <div key={indexBlock} className={classes.Listview}>
              <div className={classes.ListviewBar}>
                {toggle}
                <Nav tabs>{links}</Nav>
              </div>
              <div className={classes.ListviewContent}>
                {content}
              </div>
            </div>
          );
        });
      }

      const listviewWrapper = <div key={indexPane} className={classes.ListviewWrapper}>{html}</div>

      html = html === '' ? (pane.toggle ? buttonShow : '') : listviewWrapper;

      return html;
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
