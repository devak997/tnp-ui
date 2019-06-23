import React from "react";

export const Select = ({ children, input, required, label }) => {
  return (
    <div className={`${required ? "required" : ""} field`}>
      <label>{label}</label>
      <select {...input}>{children}</select>
    </div>
  );
};
