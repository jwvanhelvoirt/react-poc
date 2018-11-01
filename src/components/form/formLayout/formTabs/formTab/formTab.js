import React from 'react';
import classes from './formTab.scss';

const formTab = (props) => {
  const { label, activeTab, click } = props;
  const classTab = label === activeTab ? [classes.FormTab, classes.ActiveTab].join(' ') : classes.FormTab;
  const classActive = label === activeTab ? classes.Active : null;

  return (
    <div>
      <div className={classTab} onClick={click}>{label}</div>
      <div className={classActive}></div>
    </div>
  );
};

export default formTab;
