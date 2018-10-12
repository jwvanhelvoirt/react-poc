import React from 'react';
import { getColumnClasses } from '../../../../libs/views';
import FormElement from '../formElement/formElement';
import FormTabs from '../formTabs/formTabs';
import classes from './formContent.scss';

const formContent = (props) => {
  // console.log('formContent')
  // console.log(props);
  // console.log('------------')
  const { layout, inputs, defaultFocus, changed, keyUp, configForm, showModal, removeMultiValueItem } = props;

  const rows = layout.rows.map((row, index) => {

    const cols = row.cols.map((col, index) => {

      let colContent = null;

      if (col.tabs) {
        // Tabs: rows>cols>rows>inputs
        colContent = (
          <FormTabs tabs={col.tabs} inputs={inputs} defaultFocus={defaultFocus} changed={changed} keyUp={keyUp}
            configForm={configForm} showModal={showModal} removeMultiValueItem={removeMultiValueItem}
          />
        );
      } else {
        // No tabs: rows>inputs
        colContent = col.rows.map((colRow, index) => {

          const inputsDisplay = colRow.inputs.map((input, index) => {
            const formElement = {
              inputId: input.id,
              configInput: inputs[input.id]
            };

            const classesInput = input.width ? [classes.Elem, classes[input.width]].join(' ') : classes.Elem;

            return (
              <div key={index} className={classesInput}>
                <FormElement
                  inputId={input.id}
                  defaultFocus={defaultFocus}
                  changed={(event) => changed(event, input.id)}
                  keyUp={(event) => keyUp(event, formElement, configForm.id)}
                  configInput={formElement.configInput}
                  showModal={() => showModal()}
                  removeMultiValueItem={() => removeMultiValueItem()}
                  configForm={configForm}
                />
              </div>
            );
          });

          return <div key={index} className={classes.Row}>{inputsDisplay}</div>;
        });
      }


      // let arrayClassesScreen = [];
      // if (col.columnClasses) {
      //   arrayClassesScreen = col.columnClasses.map((className) => {
      //     return classes[className];
      //   });
      // }
      // console.log(arrayClassesScreen);

      // const classesCol = col.width ? [classes.Col, classes[col.width]].join(' ') : classes.Col;
      const classesCol = col.width ? [classes.Col, classes[col.width]] : [classes.Col];

      const columnClasses = getColumnClasses(col, classesCol, classes);


        return <div key={index} className={columnClasses}>{colContent}</div>;
        // return <div key={index} className={classesCol}>{colContent}</div>;
    });

    return <div key={index} className={classes.Row}>{cols}</div>;
  });

  return (
    <div>{rows}</div>
  );
};

export default formContent;
