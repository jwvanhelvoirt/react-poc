import React from 'react';
import ToolbarIcons from '../../toolbar/toolbarIcons/toolbarIcons';
import * as icons from '../../../../libs/constIcons';
import * as trans from '../../../../libs/constTranslates';

const drawerToggle = (props) => {
  const toolbarIcons = [
    { index: 'menu', icon: icons.ICON_BARS, iconHide: icons.ICON_TIMES, label: trans.KEY_MENU, clicked: props.clicked }
  ];

  return (
    <ToolbarIcons navIcons={toolbarIcons} showSideDrawer={props.showSideDrawer} />
  );
};

export default drawerToggle;
