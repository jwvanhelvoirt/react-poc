import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import classes from './Portal.scss';

const portal = (props) => {
  console.log(props);
  const { icon, label, url } = props.portal;
  return (
    <NavLink to={url} exact activeStyle={{color: 'red'}}>
      <div className={classes.Portal}>
        <div className={classes.Icon}><FontAwesomeIcon icon={icon} /></div>
        <div className={classes.Label}>{label}</div>
      </div>
    </NavLink>
  );
}

export default portal;
