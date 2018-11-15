import React from 'react';
import FormContent from './formContent/formContent';
import Aux from '../../../hoc/auxiliary';

const formLayout = (props) => {
  const { configForm, changed, keyUp, showModal, removeMultiValueItem, data, dataOriginal } = props;
  const { layout, defaultFocus, inputs } = configForm;

  const rows = (
    <FormContent layout={layout} inputs={inputs} defaultFocus={defaultFocus} changed={changed} keyUp={keyUp}
      configForm={configForm} showModal={showModal} removeMultiValueItem={removeMultiValueItem} data={data}
      dataOriginal={dataOriginal}
    />
  );
//inputs, defaultFocus, changed, keyUp, configForm, showModal, removeMultiValueItem
  return (
    <Aux>{rows}</Aux>
  );
};

export default formLayout;
