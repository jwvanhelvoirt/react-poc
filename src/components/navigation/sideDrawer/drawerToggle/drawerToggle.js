import React from 'react';
import ToolbarIcons from '../../toolbar/toolbarIcons/toolbarIcons';

const drawerToggle = (props) => {
  const icons = [
    { index: 'menu', icon: 'bars', label: 'keyMenu', clicked: props.clicked }
  ];

  return (
    <ToolbarIcons navIcons={icons} />
  );
};

export default drawerToggle;
