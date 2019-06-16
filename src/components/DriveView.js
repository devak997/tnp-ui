import React from "react";
import DatePicker from "react-datepicker";
import { FetchUpcomingDrives } from "../actions/";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import tnpbase from "../api/tnpbase";

class DriveView extends React.Component {
  state = {
    editForm: false,
    upcomingDrivesStatus: [],
    date: null,
    showAddRound: false
  };

  deleteDrive = drive => {
    tnpbase
      .post("/drives/delete", { data: drive })
      .then(() => console.log("" + drive + " is deleted"))
      .catch(err => console.log(err));
  };

  componentDidMount = () => {
    this.props.FetchUpcomingDrives();
  };

  componentWillUpdate = () => {
    this.setState({ upcomingDrivesStatus: [] });
    for (let i = 0; i < this.props.upcomingDrives.length; i++) {
      this.state.upcomingDrivesStatus.push({ editable: false });
    }
  };

  displayDrives = () => {
    if (this.state.upcomingDrivesStatus.length === 0) {
      return (
        <tr>
          <td colSpan={5}>It's Lonely Here</td>
        </tr>
      );
    }
    return this.props.upcomingDrives.map((drive, i) => {
      return (
        <tr key={i}>
          <td>{i + 1}</td>
          <td>{drive.company}</td>
          <td>
            {this.state.upcomingDrivesStatus[i].editable ? (
              <form className="ui form">
                <DatePicker
                  value={this.state.date}
                  onChange={date => this.setState({ date: date })}
                />
              </form>
            ) : (
              drive.date_of_drive
            )}
          </td>
          <td>{drive.no_of_rounds}</td>
          <td>
            {this.state.upcomingDrivesStatus[i].editable ? (
              <div />
            ) : (
              <ol className="ui list">
                {drive.rounds.map((rounds, i) => {
                  return <li key={i}>{rounds}</li>;
                })}
                <li style={{ display: this.state.showAddRound ? "" : "none" }}>
                  <form className="ui form">
                    <select style={{ padding: "1px", width: "130px" }}>
                      <option value="">Select Round</option>
                      {this.props.rounds.map((round, i) => {
                        return (
                          <option key={i} value={round.id}>
                            {round.round_name}
                          </option>
                        );
                      })}
                    </select>
                  </form>
                </li>
              </ol>
            )}
          </td>
          <td>
            <div className="ui basic icon buttons">
              <button
                className=" ui button"
                onClick={() =>
                  this.setState({ showAddRound: !this.state.showAddRound })
                }
              >
                <i className="add icon" />
              </button>
              <button
                className="ui button"
                onClick={() => {
                  let ups = this.state.upcomingDrivesStatus;
                  ups[i].editable = !ups[i].editable;
                  this.setState({ upcomingDrivesStatus: ups });
                }}
              >
                <i className="edit icon" />
              </button>
              <button
                className="ui button"
                onClick={() => this.deleteDrive(drive)}
              >
                <i className="trash icon" />
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };
  render() {
    // console.log("Upcoming drives status:", this.state.upcomingDrivesStatus);
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
          <tbody>{this.displayDrives()}</tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    upcomingDrives: state.upcomingDrives,
    rounds: state.roundsList
  };
};

export default connect(
  mapStateToProps,
  { FetchUpcomingDrives }
)(DriveView);
