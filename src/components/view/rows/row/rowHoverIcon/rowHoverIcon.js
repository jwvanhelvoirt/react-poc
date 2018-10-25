import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Label from '../../../../ui/label/label';
import Tooltip from '../../../../ui/tooltip/tooltip';

const rowHoverIcon = (props) => {
  const { index, action, _this, id } = props;
  const { callback, labelIcon } = action;
  return (
    <div>
      <div onClick={(event) => executeAction(event, _this, callback, id)}
        data-tip='React-tooltip' data-for={index}>
        <FontAwesomeIcon icon={['far', labelIcon]} />
      </div>
      <Tooltip id={index}>
        <Label labelKey={action.tooltip} convertType={'propercase'} />
      </Tooltip>
    </div>
  );
};

const executeAction = (event, _this, callback, id) => {
  event.stopPropagation();

  _this.setState({ selectedListItems: [id] });

  // Small timeout to give 'state' time to update properly.
  setTimeout(() => {callback(_this)}, 100);
};

export default rowHoverIcon;
