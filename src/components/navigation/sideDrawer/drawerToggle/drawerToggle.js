import React from 'react';
import ToolbarIcons from '../../toolbar/toolbarIcons/toolbarIcons';
import * as trans from '../../../../libs/translates';

const drawerToggle = (props) => {
  const icons = [
    { index: 'menu', icon: 'bars', label: trans.KEY_MENU, clicked: props.clicked }
  ];

  return (
    <ToolbarIcons navIcons={icons} />
  );
};

export default drawerToggle;
