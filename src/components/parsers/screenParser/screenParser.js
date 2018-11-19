import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import { storeRoute } from '../../../store/actions';
import { Nav } from 'reactstrap';
import { getTabComponent, getTabRow } from '../../../libs/tabs.js';
import Button from '../../ui/button/button';
import Breadcrumb from '../../navigation/breadcrumb/breadcrumb';
import { Large, Medium, Small } from '../../../libs/responsive';
import Aux from '../../../hoc/auxiliary';
import { getDisplayValue } from '../../../libs/generic';
import { callServer } from '../../../api/api';
import * as icons from '../../../libs/constIcons';
import * as trans from '../../../libs/constTranslates';
import classes from './screenParser.scss';

class Screen extends Component {

  constructor(props) {
    super(props);

    // Store active tabs per pane in an object.
    const activeTabs = {};
    this.props.screenConfig.panes.forEach((pane) => {
      activeTabs[pane.content.id] = pane.content.activeTab;
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

    const { id } = this.props.match.params; // id on the url.
    const { searchIdIn } = this.props.screenConfig; // the api to search the id for.

    if (searchIdIn) {
      // In a follow-up screen we need information from the record selected in the previous screen. Fetch it!
      const params = { MAGIC: localStorage.getItem('magic'), id };
      callServer('put', 'call/' + searchIdIn, this.successGetSingleHandler, this.errorGetSingleHandler, params);
    }
  };

  componentDidMount = () => {
    // We need to store route data in the store as input for the follow-up screen.
    // Via this route we inform the viewParser that a click on a row should change the url.
    this.props.storeRoute(this.props.screenConfig.route);
  };

  successGetSingleHandler = (response) => {
    // // Item succssfully loaded from the server. Store a particular property (as configured in screenConfig) in the store.
    // this.props.storeFollowUpScreenId(response.data[this.props.screenConfig.searchIdFor]); // If we want to print it in the <View> component.

    const { id } = this.props.match.params; // id on the url.

    // For the time being we print the identifying data from the selection in the previous screen, behind the breadcrumb.
    this.setState({ followUpScreenData: response.data[id][this.props.screenConfig.searchIdFor] });
  };

  errorGetSingleHandler = (error) => {
    console.log(error);
  };

  navigateBackwards = () => {
    this.props.history.goBack();
  }

  togglePane = (id) => {
    // Toggles the panes that are configured as 'toggleable' from visible to hidden and vice versa.

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
    // Create html for three different screen sizes (large, medium, small).

    // Filters the panes that are configured to be displayed on the applicable screen size.
    const screenConfig = this.state.screenConfig.panes.filter((pane) => {
      return pane[display];
    });

    const result = screenConfig.map((pane, indexPane) => {
      // Produce html for each pane.

      // Button to show a 'toggleable' pane.
      const buttonShow = (
        <Button
          key={indexPane}
          color="success"
          labelIcon={icons.ICON_PLUS}
          clicked={() => this.togglePane(pane.id)}
          />
      );

      // Button to hide a 'toggleable' pane.
      const buttonHide = (
        <Button
          color="secondary"
          outline="true"
          labelIcon={icons.ICON_MINUS}
          clicked={() => this.togglePane(pane.id)}
          />
      );

      let html = '';
      let upperZone = '';

      if (pane.show) {
        // Pane is NOT hidden ('toggleable' panes can be in 'display mode' or 'hide mode').

        // Check if we should display a breadcrumb zone instead of a tab zone.
        if (this.state.screenConfig.showTabs === false) {
          // Show breadcrumb.
          upperZone = <Breadcrumb followUpScreenData={this.state.followUpScreenData} breadcrumb={this.state.screenConfig.breadcrumb} />;

        } else {
          // Show tab bar

          // Get all tabs for this pane.
          const links = getTabRow(this.state.activeTabs[pane.content.id], pane.content.tabs, pane.content.id, this);

          // Should we show the toggle hide button?
          const toggle = pane.toggle ? buttonHide : "";

          // The tab bar.
          upperZone = (
            <div className={classes.TabBar}>
              {toggle}
              <Nav tabs>{links}</Nav>
            </div>
          );

        }

        // Get the content of the active tab (in breadcrumb modus there's the one tab is always active).
        const content = getTabComponent(this.state.activeTabs[pane.content.id], pane.content.tabs);

        // Return html for this pane.
        html = (
          <div className={classes.Pane}>
            <div className={classes.ListviewContainer}>
              {upperZone}
              {content}
            </div>
          </div>
        );

      }

      // Wrap the pane html in a div with a special class.
      const PaneWrapper = <div key={indexPane} className={classes.PaneWrapper}>{html}</div>

      // Should we show the toggle display button?
      html = html === '' ? (pane.toggle ? buttonShow : '') : PaneWrapper;

      return html;
    });

    // We might have to display a dropdown that could have been triggered from a form (modal) but should be (partially) displayed outside of the form.
    return (
      <Aux>
        {result}
        {this.props.dropdownHtml}
      </Aux>
    );
  };

  extendBreadcrumb = (breadcrumb, item, arrayUrlParts, param, active) => {
    // The breadcrumb part can be configured via screenConfig.breadcrumb.
    // TODO: waarschijnlijk is deze constructie niet houdbaar voor een portal met 3 ipv 2 geneste schermen. Hij pakt nu immers alleen de actieve.
    const transBreadcrumb = (active && this.state.screenConfig.breadcrumb) ? this.state.screenConfig.breadcrumb : trans['KEY_' + item.toUpperCase()];

    // Extends the current breadcrumb.
    const addParam = param ? '/' + this.props.match.params[param] : '';

    const classBreadcrumbWrapper = active ? [classes.BreadcrumbWrapper, classes.Active].join(' ') : classes.BreadcrumbWrapper;

    return (
      <Aux>
        {breadcrumb}
        <div className={classes.BreadcrumbDividerWrapper}>
          <div className={classes.BreadcrumbDivider}></div>
        </div>
        <div className={classBreadcrumbWrapper}>
          <NavLink to={'/' + arrayUrlParts.join('/') + addParam}>
            <span>
              {getDisplayValue(transBreadcrumb, 'propercase', true, this.props.translates)}
            </span>
          </NavLink>
        </div>
      </Aux>
    );
  };

  render = () => {
    // TODO : Berekent ze nu allemaal. Eigenlijk wil je alleen berekenen, wat nodig is. Uitzoeken...
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

const mapStateToProps = state => {
  const { dropdownHtml, translates } = state.redMain;
  return { dropdownHtml, translates };
};

const mapDispatchToProps = dispatch => {
  return {
    // storeFollowUpScreenId: (followUpScreenData) => dispatch( {type: types.FOLLOW_UP_SCREEN_ID_STORE, followUpScreenData } ),
    storeRoute: (route) => dispatch(storeRoute(route))
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Screen));
