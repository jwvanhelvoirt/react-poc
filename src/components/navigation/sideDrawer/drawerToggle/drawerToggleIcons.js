import React from 'react';
import ToolbarIcons from '../../toolbar/toolbarIcons/toolbarIcons';
import * as icons from '../../../../libs/icons';
import * as trans from '../../../../libs/translates';

const drawerToggleIcons = (props) => {
  const iconsNav = [
    { index: 'other', icon: icons.ICON_ELLIPSIS_V, label: trans.KEY_OTHER, clicked: props.clicked }
  ];

  return (
    <ToolbarIcons navIcons={iconsNav} />
  );
};

export default drawerToggleIcons;
