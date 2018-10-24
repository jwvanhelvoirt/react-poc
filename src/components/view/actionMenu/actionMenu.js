import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Backdrop from '../../ui/backdrop/backdrop';
import Label from '../../ui/label/label';
import * as icons from '../../../libs/constIcons';
import { getViewActions, getContent } from '../../../libs/views';
import Aux from '../../../hoc/auxiliary';
import classes from './actionMenu.scss';

const actionMenu = (props) => {

  const { show, actions, actionMenuHeader, subActions, showType, listItems, selectedListItems, mousePosY, mousePosX,
    actionMenuClosed, _this, userInfo } = props;
  let actionsMenuOutput = null;

  if (show) {
    const actionsOutput = getActions(actions, subActions, actionMenuHeader, _this, false, mousePosY, mousePosX,
      showType, listItems, selectedListItems, 0, 0, userInfo);

    actionsMenuOutput = (
      <Aux>
        <Backdrop show={show} clicked={actionMenuClosed} />
        {actionsOutput}
      </Aux>
    );
  }

  return (
    <Aux>
      {actionsMenuOutput}
    </Aux>
  );
};

const closeActionMenu = (event, _this, callback, stopPropagation) => {
  if (stopPropagation) {
    event.stopPropagation();
  }

  _this.setState({ showMenu: false, subActions: [] });

  if (callback) {
    callback(_this);
  }
};

const getActions = (actions, subActions, actionMenuHeader, _this, subMenu, mousePosY, mousePosX, showType, listItems,
  selectedListItems, indexSubAction, subMenuLevel, userInfo) => {
  // Recursive function that constructs HTML for all actions and it's subs.

  // If there are subActions passed process these instead of the actions.
  actions = subActions && subActions.length > 0 ? subActions : actions;

  const actionsMenu = getViewActions(actions, showType, selectedListItems, _this);

  const browserWidth = window.innerWidth || document.body.clientWidth;
  const browserHeight = window.innerHeight || document.body.clientHeight;

  // We take these out of actionsMenu.scss.
  const headerHeight = 40;
  const actionHeight = 40;
  const iconWidth = 45;
  const labelWidth = 190;
  const subMenuIndicatorWidth = 20;
  const subMenuIndent = 40;
  const menuWidth = (iconWidth + 5) + labelWidth + subMenuIndicatorWidth;

  let actionMenuHeight = (actionsMenu.length * actionHeight);
  if (showType === 'showInRowMenu' || showType === 'showInPersonalMenu') {
    actionMenuHeight = (actionsMenu.length * actionHeight) + headerHeight;
  }

  // Prevent the menu from leaving the browser screen both horizontally and vertically.
  const menuTop = mousePosY + actionMenuHeight > browserHeight ? browserHeight - actionMenuHeight - 10 : mousePosY;
  const menuLeft = mousePosX + menuWidth > browserWidth ? browserWidth - menuWidth - 10 : mousePosX;

  // Prevent the submenu from leaving the browser screen both horizontally and vertically.
  const subMenuOrientationY = mousePosY + (actionHeight * indexSubAction) + actionMenuHeight > browserHeight ?
    'bottom' :
    'top';

  const subMenuOrientationX = mousePosX + (subMenuIndent * subMenuLevel) + menuWidth > browserWidth ?
    'right' :
    'left';

  const dynamicStylesAction = {
    height: actionHeight + 'px',
    minHeight: actionHeight + 'px'
  };

  const dynamicStylesIcon = {
    width: iconWidth + 'px',
    minWidth: iconWidth + 'px'
  };

  const dynamicStylesLabel = {
    width: labelWidth + 'px'
  };

  const dynamicStylesSubMenuIndicator = {
    width: subMenuIndicatorWidth + 'px'
  };

  let header = null;
  if (actionMenuHeader && (showType === 'showInRowMenu' || showType === 'showInPersonalMenu') && subMenuLevel === 0) {
    // Get the data of the selected row in an object.
    const listItem = showType === 'showInRowMenu' ?
      listItems.filter((item) => item.id === selectedListItems[0])[0] :
      userInfo;

    // Create the header label for the actions menu for identifying the selected row.
    const headerContent = getContent(actionMenuHeader, listItem, classes);

    const headerInlineStyle = headerHeight + 'px';

    header = (
      <div className={classes.HeaderWrapper} style={{minHeight: headerInlineStyle, maxHeight: headerInlineStyle}}>
        <div className={classes.Header}>{headerContent}</div>
      </div>
    );
  }

  const actionsOutput = actionsMenu.map((action, index) => {

    const classesMenuItem = action.subActions ? [classes.Action, classes.HasSubMenu].join(' ') : classes.Action;

    const subMenuIndicator = action.subActions ?
      <FontAwesomeIcon icon={icons.ICON_ANGLE_RIGHT} /> :
      null;

    const subMenuContainer = action.subActions ?
      getActions(action.subActions, null, null, _this, true, mousePosY, mousePosX, showType, listItems, selectedListItems,
        indexSubAction + index + 1, subMenuLevel + 1, userInfo) :
      null;

    const divider = action.divider ?
      <div className={classes.DividerWrapper}><div className={classes.Divider}></div></div> :
      null;

    const callback = action.callback ?
      (event) => closeActionMenu(event, _this, action.callback, true) :
      (event) => closeActionMenu(event, _this, null, false);

    const basicActionOutput = (
      <Aux>
        <div className={classesMenuItem} style={dynamicStylesAction}
          onClick={callback}>
          <div className={classes.Icon} style={dynamicStylesIcon}>
            <FontAwesomeIcon icon={action.labelIcon} />
          </div>
          <div className={classes.Label} style={dynamicStylesLabel}>
            <Label labelKey={action.label} convertType={'propercase'} />
          </div>
          <div className={classes.SubMenuIndicator} style={dynamicStylesSubMenuIndicator}>
            {subMenuIndicator}
          </div>
          {subMenuContainer}
        </div>
        {divider}
      </Aux>
    );

    const actionOutput = action.url ?
      <NavLink to={action.url} exact>{basicActionOutput}</NavLink> :
      basicActionOutput;

    return (
      <Aux key={index} >
        {actionOutput}
      </Aux>
    );
  });

  const classesMenu = subMenu ? classes.SubMenu : classes.ActionMenu;
  const dynamicStylesActionMenu = subMenu ?
    {
      [subMenuOrientationY]: actionHeight - 5,
      [subMenuOrientationX]: subMenuIndent
    } :
    {
      top: menuTop,
      left: menuLeft
    };

  return (
    <div className={classesMenu} style={dynamicStylesActionMenu}>
      {header}
      {actionsOutput}
    </div>
  );

};

const mapStateToProps = state => {
  const { userInfo } = state.redMain;
  return { userInfo };
};

export default connect(mapStateToProps)(actionMenu);
