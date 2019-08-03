import React from "react";

const SuccessMessage = props => {
  return (
    <div className="ui positive message" style={{ overflowX: "auto", 'display':'block' }}>
      <i className="close icon" onClick={props.handleXClick} />
      <div className="header">Submitted!</div>
      <p>{props.message}</p>
    </div>
  );
};

export default SuccessMessage;
