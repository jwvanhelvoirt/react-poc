import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getDisplayValue } from '../../../libs/generic';
import * as icons from '../../../libs/constIcons';
import * as trans from '../../../libs/constTranslates';
import Aux from '../../../hoc/auxiliary';
import classes from './breadcrumb.scss';

const navigateBackwards = (props) => {
  props.history.goBack();
};

const extendBreadcrumb = (props, breadcrumb, item, arrayUrlParts, param, active) => {
  // The breadcrumb part can be configured via screenConfig.breadcrumb.
  // TODO: waarschijnlijk is deze constructie niet houdbaar voor een portal met 3 ipv 2 geneste schermen. Hij pakt nu immers alleen de actieve.
  const transBreadcrumb = (active && props.breadcrumb) ? props.breadcrumb : trans['KEY_' + item.toUpperCase()];

  // Extends the current breadcrumb.
  const addParam = param ? '/' + props.match.params[param] : '';

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
            {getDisplayValue(transBreadcrumb, 'propercase', true, props.translates)}
          </span>
        </NavLink>
      </div>
    </Aux>
  );
};

const breadcrumb = (props) => {

  // First breadcrumb is a link to the dashboard.
  let breadcrumb = (
    <Aux>
      <div className={classes.BackIcon} onClick={() => navigateBackwards(props)}>
        <FontAwesomeIcon icon={['far', icons.ICON_LONG_ARROW_LEFT]} />
      </div>
      <NavLink to='/dashboard' className={classes.HomeIcon}>
        <FontAwesomeIcon icon={['far', icons.ICON_HOME]} />
      </NavLink>
    </Aux>
  );

  // Via the URL we calculate the other breadcrumbs.
  // The URL might have params in it, for instance /document/1/5b7fb7c6495a102ff856dc3
  // The path of such URL might be something like: /document/1/:id
  // The :id part and it's predecessor are treated as ONE breadcrumb.
  let prevItem = '';
  let arrayUrlParts = [];
  let lastItem = '';

  props.match.path.split('/').forEach((item, index) => {

    if (prevItem) {
      if (item.indexOf(':') === 0) {
        let active = false;
        const param = item.replace(':', '');
        if (index === props.match.path.split('/').length - 1) {
          active = true;
        }
        breadcrumb = extendBreadcrumb(props, breadcrumb, prevItem, arrayUrlParts, param, active);
      } else {
        breadcrumb = extendBreadcrumb(props, breadcrumb, prevItem, arrayUrlParts, null, false);
      }
    }

    if (item) {
      lastItem = prevItem = item.indexOf(':') === 0 ? '' : item;
      arrayUrlParts.push(item);
    }

  });

  if (lastItem) {
    breadcrumb = extendBreadcrumb(props, breadcrumb, lastItem, arrayUrlParts, null, true);
  }

  // Print identifying data from the row selected in the previous screen or not.
  const followUpScreenData = props.followUpScreenData ?
  <span>{props.followUpScreenData}</span> :
    null;

  // Print breadcrumb zone.
  return (
    <div className={classes.Header}>
      <div className={classes.BreadcrumbWrapper}>{breadcrumb}</div>
      {followUpScreenData}
    </div>
  );

};

const mapStateToProps = state => {
  const { translates } = state.redMain;
  return { translates };
};

export default withRouter(connect(mapStateToProps)(breadcrumb));
