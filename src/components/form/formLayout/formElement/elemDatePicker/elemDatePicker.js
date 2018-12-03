import React from 'react';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

const datePicker = (props) => {
  console.log(props);

  const { configInput, changed, inputId } = props;
  const date = configInput.value ? configInput.value : null;

  return (
    <DatePicker
      selected={date}
      onChange={(date) => changed(null, inputId, date )}
      showYearDropdown
      dateFormatCalendar="MMMM"
      dateFormat="dd-MM-yyyy"
      scrollableYearDropdown
      yearDropdownItemNumber={50}
    />
  );
};

export default datePicker;
