import React from "react";
import DatePicker from "react-datepicker";
import { FetchUpcomingDrives } from "../actions/";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";

class DriveView extends React.Component {
  state = { editForm: false };

  componentDidMount = () => {
    this.props.FetchUpcomingDrives();
  }
  render() {
    return (
      <div className="ui container">
        <h3 className="ui center aligned icon header">
          <i className="chart bar icon" />
          <div className="content">
            View Drive
            <div className="sub header">Manage Drives</div>
          </div>
        </h3>
        <div className="ui form">
          <div className="required field">
            <label>
              <i className="calendar alternate outline icon" />
              Drive Date
            </label>
            <div className="ui fluid action input">
              <select>
                <option>Upcoming drives</option>
                <option>Completed drives - Current Year</option>
                <option>2018</option>
              </select>
              <button className="ui secondary button">Get Drives</button>
            </div>
          </div>
        </div>
        <br />
        <button
          className="ui right floated secondary button"
          style={{ margin: "10px" }}
        >
          Edit
        </button>
        <table className="ui blue compact table">
          <thead>
            <tr>
              <td>SNo.</td>
              <td>Company Name</td>
              <td>Date</td>
              <td>No of Rounds</td>
              <td>Rounds</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>TCS</td>
              <td>
                <form className="ui form">
                {this.state.editForm ? (
                  <div className="ui input">
                    <DatePicker />
                  </div>
                ) : (
                  "26-11-2019"
                )}
                </form>
              </td>
              <td>4</td>
              <td>
                <ol className="ui list">
                  <li>Written Test</li>
                  <li>Technical</li>
                  <li>GD</li>
                  <li>HR</li>
                </ol>
              </td>
              <td>
                <div className="ui basic icon buttons">
                  <button className="ui button" onClick={() => this.setState({editForm: !this.state.editForm})}>
                    <i className="edit icon" />
                  </button>
                  <button className="ui button" onClick={() => {}}>
                    <i className="trash icon" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    upcomingDrives = state.upcomingDrives
  };
}

export default connect(mapStateToProps,{ FetchUpcomingDrives})(DriveView);
