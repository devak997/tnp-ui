import React from "react";

const renderError = ({ error, touched }) => {
  if (touched && error) {
    return true;
  }
  return false;
};

export const Select = ({ children, input, required, label, meta }) => {
  const showError = renderError(meta);
  return (
    <div
      className={`${required ? "required" : ""} field ${
        showError ? "error" : ""
      }`}
    >
      <label>{label}</label>
      <select {...input}>{children}</select>
      <div style={{ display: showError ? "" : "none" }}>{meta.error}</div>
    </div>
  );
};
