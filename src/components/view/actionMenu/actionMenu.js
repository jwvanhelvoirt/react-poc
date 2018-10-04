import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Backdrop from '../../ui/backdrop/backdrop';
import Label from '../../ui/label/label';
import * as icons from '../../../libs/constIcons';
import { getViewActions } from '../../../libs/views';
import Aux from '../../../hoc/auxiliary';
import classes from './actionMenu.scss';

const actionMenu = (props) => {
  const { show, actions, subActions, showType, selectedListItems, mousePosY, mousePosX, actionMenuClosed, _this } = props;
  let actionsMenuOutput = null;

  if (show) {
    const actionsOutput = getActions(actions, subActions, _this, false, mousePosY, mousePosX, showType, selectedListItems, 0, 0);

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

const closeActionMenu = (event, _this, callback) => {
  event.stopPropagation();
  _this.setState({ showMenu: false, subActions: [] });
  callback(_this);
};

const getActions = (actions, subActions, _this, subMenu, mousePosY, mousePosX, showType, selectedListItems,
  indexSubAction, subMenuLevel) => {
  // Recursive function that constructs HTML for all actions and it's subs.

  // If there are subActions passed process these instead of the actions.
  actions = subActions && subActions.length > 0 ? subActions : actions;

  const actionsMenu = getViewActions(actions, showType, selectedListItems, _this);

  const browserWidth = window.innerWidth || document.body.clientWidth;
  const browserHeight = window.innerHeight || document.body.clientHeight;

  // We take these out of actionsMenu.scss.
  const actionHeight = 50;
  const iconWidth = 40;
  const labelWidth = 190;
  const subMenuIndicatorWidth = 20;
  const subMenuIndent = 80;
  const menuWidth = iconWidth + labelWidth + subMenuIndicatorWidth;

  const actionMenuHeight = actionsMenu.length * actionHeight;

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

  const actionsOutput = actionsMenu.map((action, index) => {

    const classesMenuItem = action.subActions ? [classes.Action, classes.HasSubMenu].join(' ') : classes.Action;

    const subMenuIndicator = action.subActions ?
      <FontAwesomeIcon icon={icons.ICON_ANGLE_RIGHT} /> :
      null;

    const subMenuContainer = action.subActions ?
      getActions(action.subActions, null, _this, true, mousePosY, mousePosX, showType, selectedListItems,
        indexSubAction + index + 1, subMenuLevel + 1) :
      null;

    const callback = action.callback ? (event) => closeActionMenu(event, _this, action.callback) : null;

    return (
      <div key={index} className={classesMenuItem} style={dynamicStylesAction}
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
    );
  });

  const classesMenu = subMenu ? classes.SubMenu : classes.ActionMenu;
  const dynamicStylesActionMenu = subMenu ?
    {
      [subMenuOrientationY]: 45,
      [subMenuOrientationX]: subMenuIndent
    } :
    {
      top: menuTop,
      left: menuLeft
    };

  return (
    <div className={classesMenu} style={dynamicStylesActionMenu}>
      {actionsOutput}
    </div>
  );

};

export default actionMenu;
