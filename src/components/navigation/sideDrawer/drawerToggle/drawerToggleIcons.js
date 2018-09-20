import React from 'react';
import ToolbarIcons from '../../toolbar/toolbarIcons/toolbarIcons';
import * as trans from '../../../../libs/translates';

const drawerToggleIcons = (props) => {
  const icons = [
    { index: 'other', icon: 'ellipsis-v', label: trans.KEY_OTHER, clicked: props.clicked }
  ];

  return (
    <ToolbarIcons navIcons={icons} />
  );
};

export default drawerToggleIcons;
