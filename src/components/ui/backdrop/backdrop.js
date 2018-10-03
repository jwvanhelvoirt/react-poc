/**
 * @brief   Returns a backdrop for blocking all interaction with underlying HTML DOM elements.
 * @params  clicked   Callback to remove the backdrop.
 */

import React from 'react';
import classes from './backdrop.scss';

const backdrop = (props) => {
  const { messageBox1, messageBox2 } = props;

  // Complex construction for multiple MessageBoxes on screen.
  // Complexity is the positioning and z-index of the modal and the backdrop.
  // We have support up to three message boxes now.
  const classNames = messageBox1 ?
    [classes.Backdrop, classes.Pos2].join(' ') :
    (messageBox2 ? [classes.Backdrop, classes.Pos3].join(' ') :
      [classes.Backdrop, classes.Pos1].join(' '));

  return (
    props.show ?
      <div className={classNames} onClick={props.clicked} onContextMenu={(event) => rightMouseClick(event)}></div> :
      null
  );
};

const rightMouseClick = (event) => event.preventDefault();

export default backdrop;
