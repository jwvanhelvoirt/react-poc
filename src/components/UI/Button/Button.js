/**
* @brief   Returns a button.
* @params  clicked      Callback function to trigger if the user clicks the button.
* @params  color        String indicating the color of the button.
*                       (can be primary (blue), secondary (grey), success (green), info (kobaltblue), warning (orange) and danger (red))
* @params  dataTip      String containing a string that is necessary, because <ReactTooltip /> finds the tooltip via this attribute.
* @params  disabled     Boolean indicating if the button should be disabled or not.
* @params  id           String containing an id to connect the button DOM element with the tooltip DOM element.
* @params  outline      Boolean indicating the button should be of outline type.
* @params  labelIcon    String with the FontAwesomeIcon to display in the button.
*                       If both labelIcon and labelText are passed, labelIcon will be used.
* @params  labelText    String with the text to display in the button.
* @params  tooltip      String containing the text to be used as tooltip when the users hovers the mouse over the Button.
*/

import React from 'react';

import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTooltip from 'react-tooltip';
import Aux from '../../../hoc/Auxiliary';
import classes from './Button.scss';

const button = (props) => {
  // Get the label html for the button.
  const label = props.labelIcon ? <FontAwesomeIcon icon={props.labelIcon} /> : (props.labelText ? props.labelText : '');

  // Is there an outline property?
 let opts = {};
 if (props.outline) {
   opts['outline'] = true;
 }

  // Get the button and tooltip html.
  let button = (
    <Button
      size='sm'
      {...opts}
      className={classes.Button}
      color={props.color}
      onClick={props.clicked}
      disabled={props.disabled}>
      {label}
    </Button>
  );

  let reactTooltip = null;
  if (props.tooltip) {
    button = (
      <Button
        size='sm'
        {...opts}
        className={classes.Button}
        color={props.color}
        onClick={props.clicked}
        disabled={props.disabled}
        data-tip={props.dataTip}
        data-for={props.id}>
        {label}
      </Button>
    );

    reactTooltip = (
      <ReactTooltip id={props.id} place="bottom" type="dark" effect="solid">
        <span>{props.tooltip}</span>
      </ReactTooltip>
    );
  }

  return (
    <Aux>
      {button}
      {reactTooltip}
    </Aux>
  );
}

export default button;
