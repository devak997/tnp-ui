import React from "react";

export const Input = ({ input, placeholder, type, required, label, customProps }) => {
  return (
    <div className={`${required ? "required" : ""} field`}>
      <label>{label}</label>
      <input
        {...input}
        {...customProps}
        type={type}
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="off"
      />
    </div>
  );
};

export const IconInput = ({
  input,
  placeholder,
  type,
  required,
  label,
  iconName,
  customProps
}) => {
  return (
    <div className={`${required ? "required" : ""} field`}>
      <label>{label}</label>
      <div className="ui left icon input">
        <input
          {...input}
          {...customProps}
          type={type}
          placeholder={placeholder}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="off"
        />
        <i className={`${iconName} icon`} />
      </div>
    </div>
  );
};
