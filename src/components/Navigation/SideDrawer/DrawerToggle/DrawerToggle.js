import React from 'react';
import ToolbarIcons from '../../Toolbar/ToolbarIcons/ToolbarIcons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const drawerToggle = (props) => {
  const icons = [
    { index: 'menu', icon: 'bars', label: 'Menu', clicked: props.clicked }
  ];
  return (
    <ToolbarIcons navIcons={icons} />
  );
}

export default drawerToggle;
