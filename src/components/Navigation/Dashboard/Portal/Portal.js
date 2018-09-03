import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import Label from '../../../UI/Label/Label';
import classes from './Portal.scss';

const portal = (props) => {
  const { icon, label, url } = props.portal;
  return (
    <NavLink to={url} exact activeStyle={{color: 'red'}}>
      <div className={classes.Portal}>
        <div className={classes.Icon}><FontAwesomeIcon icon={icon} /></div>
        <div className={classes.Label}><Label labelKey={label} convertType={'propercase'} /></div>
      </div>
    </NavLink>
  );
}

export default portal;
