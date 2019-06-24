import React from "react";
import DatePicker from "react-datepicker";

export const DatePickerNew = ({ input, required, label, defaultValue }) => {
  return (
    <div className={`${required ? "required" : ""} field`}>
      <label>{label}</label>
      <DatePicker
        dateFormat="dd/MM/yyyy"
        selected={input.value || new Date(defaultValue)}
        onChange={value => input.onChange(value)}
      />
    </div>
  );
};
