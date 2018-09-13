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

    const activeTabs = {};
    this.props.screenConfig.panes.forEach((pane) => {
      pane.blocks.forEach((block) => {
        activeTabs[block.id] = block.activeTab;
      });
    });

    this.state = {
      activeTabs,
      followUpScreenData: '',
      screenConfig: cloneDeep(this.props.screenConfig)
    };
  };

  componentWillMount = () => {
    // Initialize the route data in the store.
    this.props.storeRoute('');

    const { searchIdIn } = this.props.screenConfig;
    const { id } = this.props.match.params;

    if (searchIdIn) {
      // In a follow-up screen we need information from the record selected in the previous screen. Fetch it!
      callServer('get', '/' + searchIdIn + '/read/' + id, this.successGetSingleHandler, this.errorGetSingleHandler);
    }
  };

  componentDidMount = () => {
    // We need to store route data in the store as input for the follow-up screen.
    this.props.storeRoute(this.props.screenConfig.route);
  };

  successGetSingleHandler = (response) => {
    // // Item succssfully loaded from the server. Store a particular property (as configured in screenConfig) in the store.
    // this.props.storeFollowUpScreenId(response.data[this.props.screenConfig.searchIdFor]);

    // For the time being we print the identifying data from the selection in the previous screen, behind the breadcrumb.
    this.setState({ followUpScreenData: response.data[this.props.screenConfig.searchIdFor] });
  };

  errorGetSingleHandler = (error) => {
    console.log(error);
  };

  togglePane = (id) => {
    // Clone the state.
    const updatedScreenConfig = cloneDeep(this.state.screenConfig);

    const arrayRecords = Object.keys(updatedScreenConfig.panes);

    arrayRecords.forEach((index) => {
      let updatedScreenConfigElement = {
        ...updatedScreenConfig.panes[arrayRecords[index]]
      }

      if (updatedScreenConfigElement.id === id) {
        updatedScreenConfigElement.show = !updatedScreenConfigElement.show;
        updatedScreenConfig.panes[arrayRecords[index]] = updatedScreenConfigElement;
      }
    });

    // Modify the state.
    this.setState({
      screenConfig: updatedScreenConfig
    });
  }

  getHtml = (display) => {
    const screenConfig = this.state.screenConfig.panes.filter((pane) => {
      return pane[display];
    });

    const result = screenConfig.map((pane, indexPane) => {
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
          if (this.state.screenConfig.showTabs === false) {

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
