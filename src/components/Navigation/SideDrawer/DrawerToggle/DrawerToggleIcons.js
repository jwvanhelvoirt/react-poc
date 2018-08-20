import React from 'react';
import ToolbarIcons from '../../Toolbar/ToolbarIcons/ToolbarIcons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const drawerToggleIcons = (props) => {
  const icons = [
    { index: 'other', icon: 'ellipsis-v', label: 'Other', clicked: props.clicked }
  ];
  return (
    <ToolbarIcons navIcons={icons} />
  );
}

export default drawerToggleIcons;
