import React from 'react';
import ToolbarIcons from '../../toolbar/toolbarIcons/toolbarIcons';

const drawerToggleIcons = (props) => {
  const icons = [
    { index: 'other', icon: 'ellipsis-v', label: 'Other', clicked: props.clicked }
  ];
  return (
    <ToolbarIcons navIcons={icons} />
  );
}

export default drawerToggleIcons;
