import React from 'react';
import ToolbarIcons from '../../Toolbar/ToolbarIcons/ToolbarIcons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './DrawerToggle.scss';

const drawerToggle = (props) => {
  const icons = [
    { index: 'menu', icon: 'bars', label: 'Menu', clicked: props.clicked }
  ];
  return (
    <ToolbarIcons navIcons={icons} />
  );
}

export default drawerToggle;

// <ul className={classes.ToolbarIcons}><ToolbarIcon id='menu' clicked={props.clicked} label='Menu'><FontAwesomeIcon icon='bars' /></ToolbarIcon></ul>
