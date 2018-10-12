import React from 'react';
import classes from './formTab.scss';

const formTab = (props) => {
  const { label, activeTab, click } = props;
  const classesFormTab = label === activeTab ? [classes.FormTab, classes.Active].join(' ') : classes.FormTab;

  return <div className={classesFormTab} onClick={click}>{label}</div>;
};

export default formTab;
