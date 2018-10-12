import React from 'react';
import FormContent from '../../formContent/formContent';
import Aux from '../../../../../hoc/auxiliary';

const formTabContent = (props) => {
  //rows>cols>rows>inputs
  // console.log('formTabContent')
  // console.log(props);
  // console.log('------------')

  const { tab, inputs, defaultFocus, changed, keyUp, configForm, showModal, removeMultiValueItem} = props;

  const rows = (
    <FormContent layout={tab} inputs={inputs} defaultFocus={defaultFocus} changed={changed} keyUp={keyUp}
      configForm={configForm} showModal={showModal} removeMultiValueItem={removeMultiValueItem}
    />
  );

  return (
    <Aux>{rows}</Aux>
  );
};

export default formTabContent;
