import React from 'react';
import { navItems } from '../../../config/navigation/configNavigationItems';
import Portal from './portal/portal';
import classes from './dashboard.scss';

const dashboard = () => {
  const portals = navItems.map((item, index) => item.dashboard ? <Portal key={index} portal={item} /> : null);

  return (
    <div className={classes.Wrapper}>
      <div className={classes.Dashboard}>
        {portals}
      </div>
    </div>
  );
};

export default dashboard;
