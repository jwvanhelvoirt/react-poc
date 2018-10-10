import React from 'react';
import FormElement from '../formElement/formElementN';
import classes from './formLayout.scss';

const formLayout = (props) => {
  console.log(props.configForm);

  const { configForm, changed, keyUp, showModal } = props;
  const { layout, defaultFocus, inputs, removeMultiValueItem } = configForm;

  const rows = layout.rows.map((row, index) => {

    const cols = row.cols.map((col, index) => {

      const colRows = col.rows.map((colRow, index) => {

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

      const classesCol = col.width ? [classes.Col, classes[col.width]].join(' ') : classes.Col;
      return <div key={index} className={classesCol}>{colRows}</div>;
    });

    return <div key={index} className={classes.Row}>{cols}</div>;
  });


  return (
    <div>{rows}</div>
  );
};

export default formLayout;
