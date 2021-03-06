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
* @params  labelText    Array with translate keys for text to display in the button.
* @params  tooltip      String containing the text to be used as tooltip when the users hovers the mouse over the Button.
*/

import React from 'react';
// import { Button } from 'reactstrap'; //TODO : DEZE COMPONENT STRAKS GEHEEL RESTYLEN MET DE INPUT VAN FRANK. GEEN TRANSITION EFFECT!!! WANT DAN WERKT DE TRAPFOCUS NIET MEER!!
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from '../../ui/tooltip/tooltip';
import Label from '../../ui/label/label';
import Aux from '../../../hoc/auxiliary';
import classes from './button.scss';

const button = (props) => {
  // Get the label html for the button.
  let labelText = '';
  if (props.labelText) {
    labelText = props.labelText.map((item, index) => {
      return index === 0 ?
      <Label key={index} labelKey={item} convertType={'propercase'} trailingSpace={true} /> :
        <Label key={index} labelKey={item} />
    });
  }

  const label = props.labelIcon ? <FontAwesomeIcon icon={['far', props.labelIcon]} /> : labelText;

  // Is there an outline property?
  let opts = {};
  if (props.outline) {
    opts['outline'] = true;
  }

  const classButtonColor = props.color === 'success' ?
    (props.disabled ? 'ButtonOkDisabled' : 'ButtonOk') :
    (props.disabled ? 'ButtonCancelDisabled' : 'ButtonCancel');
  const classesButton = [classes.Button, classes[props.buttonsClass], classes[classButtonColor]].join(' ');

  // Get the button and tooltip html.
  let button = (
    <button
      autoFocus={props.autoFocus}
      size='sm'
      {...opts}
      className={classesButton}
      onClick={props.clicked}
      disabled={props.disabled}>
      {label}
    </button>
  );

  let reactTooltip = null;
  if (props.tooltip) {
    button = (
      <button
        size='sm'
        {...opts}
        className={classesButton}
        onClick={props.clicked}
        disabled={props.disabled}
        data-tip={props.dataTip}
        data-for={props.id}>
        {label}
      </button>
    );

    reactTooltip = (
      <Tooltip id={props.id}>
        <Label labelKey={props.tooltip} convertType={'propercase'} />
      </Tooltip>
    );
  }

  return (
    <Aux>
      {button}
      {reactTooltip}
    </Aux>
  );
};

  export default button;
