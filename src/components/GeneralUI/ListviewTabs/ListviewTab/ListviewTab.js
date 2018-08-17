import React from 'react';
import { NavLink } from 'react-router-dom';

const listviewTab = (props) => (
	<li><NavLink to={props.to} exact>{props.label}</NavLink></li>
);

export default listviewTab;