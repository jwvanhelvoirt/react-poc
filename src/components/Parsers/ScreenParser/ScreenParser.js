import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import * as types from '../../../store/actions';
import { Nav } from 'reactstrap';
import { getTabComponent, getTabRow } from '../../../libs/tabs.js';
import Button from '../../ui/button/button';
import { Large, Medium, Small } from '../../../libs/responsive';
import Aux from '../../../hoc/auxiliary';
import { propercase } from '../../../libs/generic';
import { callServer } from '../../../api/api';
import classes from './screenParser.scss';

class Screen extends Component {

  constructor(props) {
    super(props);

    // Store active tabs per pane in an object.
    const activeTabs = {};
    this.props.tabsConfig.panes.forEach((pane) => {
      activeTabs[pane.content.id] = pane.content.activeTab;
    });

    this.state = {
      activeTabs,
      followUpScreenData: '',
      tabsConfig: cloneDeep(this.props.tabsConfig)
    };
  };

  componentWillMount = () => {
    // Initialize the route data in the store.
    this.props.storeRoute('');

    const { searchIdIn } = this.props.tabsConfig; // the api to search the id for.
    const { id } = this.props.match.params; // id on the url.

    if (searchIdIn) {
      // In a follow-up screen we need information from the record selected in the previous screen. Fetch it!
      callServer('get', '/' + searchIdIn + '/read/' + id, this.successGetSingleHandler, this.errorGetSingleHandler);
    }
  };

  componentDidMount = () => {
    // We need to store route data in the store as input for the follow-up screen.
    // Via this route we inform the viewParser that a click on a row should change the url.
    this.props.storeRoute(this.props.tabsConfig.route);
  };

  successGetSingleHandler = (response) => {
    // // Item succssfully loaded from the server. Store a particular property (as configured in screenConfig) in the store.
    // this.props.storeFollowUpScreenId(response.data[this.props.tabsConfig.searchIdFor]); // If we want to print it in the <View> component.

    // For the time being we print the identifying data from the selection in the previous screen, behind the breadcrumb.
    this.setState({ followUpScreenData: response.data[this.props.tabsConfig.searchIdFor] });
  };

  errorGetSingleHandler = (error) => {
    console.log(error);
  };

  togglePane = (id) => {
    // Toggles the panes that are configured as 'toggleable' from visible to hidden and vice versa.

    // Clone the state.
    const updatedTabsConfig = cloneDeep(this.state.tabsConfig);

    const arrayRecords = Object.keys(updatedTabsConfig.panes);

    arrayRecords.forEach((index) => {
      let updatedTabsConfigElement = {
        ...updatedTabsConfig.panes[arrayRecords[index]]
      }

      if (updatedTabsConfigElement.id === id) {
        updatedTabsConfigElement.show = !updatedTabsConfigElement.show;
        updatedTabsConfig.panes[arrayRecords[index]] = updatedTabsConfigElement;
      }
    });

    // Modify the state.
    this.setState({
      tabsConfig: updatedTabsConfig
    });
  }

  getHtml = (display) => {
    const tabsConfig = this.state.tabsConfig.panes.filter((pane) => {
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
        const links = getTabRow(this.state.activeTabs[pane.content.id], pane.content.tabs, pane.content.id, this);
        const content = getTabComponent(this.state.activeTabs[pane.content.id], pane.content.tabs);

        const toggle = pane.toggle ? (pane.show ? buttonHide : "") : "";

        let upperZone = (
          <div className={classes.TabBar}>
            {toggle}
            <Nav tabs>{links}</Nav>
          </div>
        );

        // Check if we should display a breadcrumb zone instead of a tab zone.
        if (this.state.tabsConfig.showTabs === false) {

          // First breadcrumb is a link to the dashboard.
          let breadcrumb = (
            <NavLink to='/dashboard'>
              {propercase('home')}
            </NavLink>
          );

          // Via the URL we calculate the other breadcrumbs.
          // The URL might have params in it, for instance /project/document/5b7fb7c6495a102ff856dc3
          // The path of such URL might be something like: /project/document/:id
          // The :id part and it's predecessor are treated as ONE breadcrumb.
          let prevItem = '';
          let arrayUrlParts = [];
          let lastItem = '';

          this.props.match.path.split('/').forEach((item) => {

            if (prevItem) {
              if (item.indexOf(':') === 0) {
                const param = item.replace(':', '');
                breadcrumb = this.extendBreadcrumb(breadcrumb, prevItem, arrayUrlParts, param);
              } else {
                breadcrumb = this.extendBreadcrumb(breadcrumb, prevItem, arrayUrlParts);
              }
            }

            if (item) {
              lastItem = prevItem = item.indexOf(':') === 0 ? '' : item;
              arrayUrlParts.push(item);
            }

          });

          if (lastItem) {
            breadcrumb = this.extendBreadcrumb(breadcrumb, lastItem, arrayUrlParts);
          }

          const followUpScreenData = this.state.followUpScreenData ? <span>{' (' + this.state.followUpScreenData + ')'}</span> : null;

          // Print breadcrumb zone.
          upperZone = (
            <div className={classes.Header}>
              <div>{breadcrumb}</div>
              {followUpScreenData}
            </div>
          );
        }

        html = (
          <div className={classes.Pane}>
            {upperZone}
            <div className={classes.ListviewContainer}>
              {content}
            </div>
          </div>
        );

      }

      const PaneWrapper = <div key={indexPane} className={classes.PaneWrapper}>{html}</div>

      html = html === '' ? (pane.toggle ? buttonShow : '') : PaneWrapper;

      return html;
    });

    return result;
  };

  extendBreadcrumb = (breadcrumb, item, arrayUrlParts, param) => {
      const addParam = param ? '/' + this.props.match.params[param] : '';

      return (
      <Aux>
        {breadcrumb}
        <NavLink to={'/' + arrayUrlParts.join('/') + addParam}>
          {' > ' + propercase(item)}
        </NavLink>
      </Aux>
    );
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
    // storeFollowUpScreenId: (followUpScreenData) => dispatch( {type: types.FOLLOW_UP_SCREEN_ID_STORE, followUpScreenData } ),
    storeRoute: (route) => dispatch( {type: types.ROUTE_STORE, route } )
  }
};

export default withRouter(connect(null, mapDispatchToProps)(Screen));
