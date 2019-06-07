import React from "react";
import { Link } from "react-router-dom";

const Navbar = props => {
  return (
    <div className="ui inverted blue menu " style={{ borderRadius: 0.5 }}>
      <a className="item" onClick={props.handleMenuClick} href="#">
        <i className="sidebar icon" />
        Menu
      </a>
      <Link to="/" className="item">
        Home
      </Link>
      <div className="right menu">
        <a className="ui item" href="#">
          Logout
        </a>
      </div>
    </div>
  );
};

export default Navbar;
