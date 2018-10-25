import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Label from '../../../ui/label/label';
import classes from './navigationItem.scss';

const navigationItem = (props) => {

  const showLabelClass = props.showLabel ? classes.LabelShow : classes.LabelHide;
  const labelClass = [classes.Label, showLabelClass].join(' ');

  return (
    <li className={classes.NavigationItemWrapper}>
      <NavLink
        className={classes.NavigationItem}
        to={props.link}
        exact
        activeStyle={{
          background: 'linear-gradient(to bottom, #009fd0 0%, #0963af 100%)'
        }}>
        <div className={classes.NavItemWrapper}>
          <div className={classes.Icon}>
            <FontAwesomeIcon icon={['far', props.icon]} />
          </div>
          <div className={labelClass}>
            <Label labelKey={props.label} convertType={'propercase'} />
          </div>
        </div>
      </NavLink>
    </li>
  );
};

export default navigationItem;
