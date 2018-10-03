import React from 'react';
import ReactTooltip from 'react-tooltip';

const tooltip = (props) => {
  return (
    <ReactTooltip id={props.id} place="bottom" type="dark" effect="solid">
      {props.children}
    </ReactTooltip>
  );
};

export default tooltip;
