import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as types from '../../../store/actions';
import { Nav } from 'reactstrap';
import { getTabComponent, getTabRow } from '../../../libs/tabs.js';
import Button from '../../ui/button/button';
import { Large, Medium, Small } from '../../../libs/responsive';
import Aux from '../../../hoc/auxiliary';
import { propercase } from '../../../libs/generic';
import classes from './screenParser.scss';

class Screen extends Component {

  constructor(props) {
    super(props);

    const activeTabs = {};
    this.props.tabsConfig.forEach((pane) => {
      pane.blocks.forEach((block) => {
        activeTabs[block.id] = block.activeTab;
      });
    });

    this.localData = {
      route: ''
    };

    this.state = {
      activeTabs,
      tabsConfig: [...this.props.tabsConfig]
    };
  };

  componentWillMount = () => {
    // Initialize the route data in the store.
    this.props.storeRoute('');
    // this.props.storeRouteBindedAttribute('');
  };

  componentDidMount = () => {
    this.props.storeRoute(this.localData.route);
  };

  togglePane = (id) => {
    // Clone the state.
    const updatedTabsConfig = [
      ...this.state.tabsConfig
    ];

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
        key={indexPane}
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
          const links = getTabRow(this.state.activeTabs[block.id], block.tabs, block.id, this);
          const content = getTabComponent(this.state.activeTabs[block.id], block.tabs);

          const toggle = pane.toggle ? (pane.show ? buttonHide : "") : "";

          let upperZone = (
            <div className={classes.TabBar}>
              {toggle}
              <Nav tabs>{links}</Nav>
            </div>
          );

          // Check if we should display a breadcrumb zone instead of a tab zone.
          if (block.showTabs === false) {

            // First breadcrumb is a link to the dashboard.
            let breadcrumb = (
              <NavLink to='/dashboard'>
                {propercase('home')}
              </NavLink>
            );

            // Via the URL we calculate the other breadcrumbs.
            // The URL might have params in it, for instance /project/document/5b7fb7c6495a102ff856dc3
            // The path of such URL might be something like: /project/document/:id
            // The :id part and it's predecessor is ONE breadcrumb.
            let prevItem = '';
            let arrayUrlParts = [];
            this.props.match.path.split('/').forEach((item) => {

              if (prevItem) {
                if (item.indexOf(':') === 0) {
                  const param = item.replace(':', '');
                  breadcrumb = (
                    <Aux>
                      {breadcrumb}
                      <NavLink to={'/' + arrayUrlParts.join('/') + '/' + this.props.match.params[param]}>
                        {' > ' + propercase(prevItem)}
                      </NavLink>
                    </Aux>
                  );
                } else {
                  breadcrumb = (
                    <Aux>
                      {breadcrumb}
                      <NavLink to={'/' + arrayUrlParts.join('/')}>
                        {' > ' + propercase(prevItem)}
                      </NavLink>
                    </Aux>
                  );
                }
              }

              if (item) {
                prevItem = item.indexOf(':') === 0 ? '' : item;
                arrayUrlParts.push(item);
              }

            });
            // Print breadcrumb zone.
            upperZone = (
              <div className={classes.Breadcrumb}>{breadcrumb}</div>
            );

            // We also need to store route data in the store as input for the follow-up screen.
            // We do this via localData, because React does not allow to update the store in the render method.
            // In the componentDidMount lifecycle we update the store.
            this.localData.route = block.route;
          }

          return (
            <div key={indexBlock} className={classes.Pane}>
              {upperZone}
              <div className={classes.ListviewContainer}>
                {content}
              </div>
            </div>
          );
        });
      }

      const PaneWrapper = <div key={indexPane} className={classes.PaneWrapper}>{html}</div>

      html = html === '' ? (pane.toggle ? buttonShow : '') : PaneWrapper;

      return html;
    });

    return result;
  };

  render = () => {
    // TODO : Laadt ze nu allemaal in, eigenlijk wil je alleen laden, wat nodig is. Uitzoeken...
    const large = this.getHtml('displayLarge');
    const medium = this.getHtml('displayMedium');
    const small = this.getHtml('displaySmall');

    return (
      <div>
        <Large>{large}</Large>
        <Medium>{medium}</Medium>
        <Small>{small}</Small>
      </div>
    );
  };

}

const mapDispatchToProps = dispatch => {
  return {
    storeRoute: (route) => dispatch( {type: types.ROUTE_STORE, route } )
  }
};

export default withRouter(connect(null, mapDispatchToProps)(Screen));
