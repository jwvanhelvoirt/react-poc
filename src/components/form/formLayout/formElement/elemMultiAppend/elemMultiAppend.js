import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import View from '../../../../parsers/viewParser/viewParser';
import Button from '../../../../ui/button/button';
import Aux from '../../../../../hoc/auxiliary';
import * as icons from '../../../../../libs/constIcons';
import * as trans from '../../../../../libs/constTranslates';
import classes from './elemMultiAppend.scss';

const elemMultiAppend = (props) => {
  const { configInput, removeMultiValueItem, inputId, showModal } = props;
  const { value, lookupFieldForDisplay, lookupTitle, lookup } = configInput;

  const multiLineItems = value.map((item, index) => {
    const valueId = item.id;
    return (
      <div key={index} className={classes.Multiline}>
        <div className={classes.MultilineRemove} onClick={() => removeMultiValueItem(inputId, valueId)}>
          <FontAwesomeIcon icon={['far', icons.ICON_TIMES_CIRCLE]} />
        </div>
        <div className={classes.DisplayValue}>{item[lookupFieldForDisplay]}</div>
      </div>
    );
  });

  const multiLines = (
    <div className={classes.MultilineWrapper}>
      {multiLineItems}
    </div>
  );

  return (
    <Aux>
      <Button clicked={() => showModal('showModalLookup', 'ModalMedium', [trans.KEY_SELECT, lookupTitle], 'info',
        <View viewConfig={lookup} lookup={true} lookupBindedInputId={inputId} />, 'butOkCancel')}
        color="primary" labelText={[trans.KEY_PLUS, lookupTitle]}
      />
      {multiLines}
    </Aux>
  );
};

export default elemMultiAppend;
