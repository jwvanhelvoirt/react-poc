import React from 'react';
import ToolbarIcons from '../../toolbar/toolbarIcons/toolbarIcons';
import * as icons from '../../../../libs/icons';
import * as trans from '../../../../libs/translates';

const drawerToggle = (props) => {
  const toolbarIcons = [
    { index: 'menu', icon: icons.ICON_BARS, label: trans.KEY_MENU, clicked: props.clicked }
  ];

  return (
    <ToolbarIcons navIcons={toolbarIcons} />
  );
};

export default drawerToggle;
