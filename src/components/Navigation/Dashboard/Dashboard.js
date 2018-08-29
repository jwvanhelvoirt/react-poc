import React from 'react';
import { navItems } from '../../../config/Navigation/ConfigNavigationItems';
import Portal from './Portal/Portal';
import classes from './Dashboard.scss';

const dashboard = () => {
  const portals = navItems.map((item) => item.dashboard ? <Portal portal={item} /> : null);

  return (
    <div className={classes.Wrapper}>
      <div className={classes.Dashboard}>
        {portals}
      </div>
    </div>
  );
}

export default dashboard;
