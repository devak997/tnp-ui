import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import tnpbase from "../api/tnpbase";

class DriveView extends React.Component {
  state = {
    editForm: false,
    upcomingDrivesStatus: [],
    drives: [],
    date: null,
    rounds: [],
    showTickButtons: false,
    newRound: "",
    years: [],
    selectedVal: "",
    isUpcoming: true
  };

  fetchYears = () => {
    tnpbase
      .get("/passing/year")
      .then(response => {
        let data = [];
        for (let i = 0; i < response.data.result.length; i++) {
          data.push(response.data.result[i].passing_out_year);
        }
        this.setState({ years: data });
      })
      .catch(err => console.log(err));
  };

  getDrives = () => {
    if(this.state.selectedVal === "") {
      this.setState({isUpcoming: true});
      this.fetchUpcomingDrives();
    } else {
      this.setState({isUpcoming: false, drives: []});
      this.fetchOldDrives();
    }
  }

  fetchOldDrives = () => {
    const data = { year: this.state.selectedVal};
    tnpbase.post("/drives/olddrive", {data}).then((response) => this.setState({drives: response.data.result})).catch(err =>console.log(err) )
  }

  deleteRound = (drive_id, round_id, noOfRounds) => {
    const data = { drive_id, round_id, noOfRounds };
    console.log(data);
    tnpbase
      .post("/drives/rounds/delete", { data })
      .then(() => {
        this.fetchUpcomingDrives();
      })
      .catch(err => console.log(err));
  };

  fetchUpcomingDrives = () => {
    tnpbase
      .get("/drives/upcoming")
      .then(response => {
        const status = [];
        for (let count = 0; count < response.data.result.length; count++) {
          status.push({ editable: false, showAddRound: false });
        }
        this.setState({
          drives: response.data.result,
          upcomingDrivesStatus: status
        });
      })
      .catch(err => console.log(err));
  };

  deleteDrive = drive => {
    tnpbase
      .post("/drives/delete", { data: drive })
      .then(() => {
        console.log("In delete");
        this.fetchUpcomingDrives();
      })
      .catch(err => console.log(err));
  };

  submitData = drive_id => {
    if (this.state.newRound !== "") {
      const final_rounds = this.state.rounds;
      final_rounds.push(this.state.newRound);
      this.setState({ rounds: final_rounds });
    }
    const data = {
      rounds: this.state.rounds,
      date: this.state.date.toLocaleDateString("en-GB"),
      drive_id: drive_id
    };
    console.log(data);
    tnpbase
      .post("/drives/modify", { data })
      .then(() => {
        this.setState({ showTickButtons: false });
        this.fetchUpcomingDrives();
      })
      .catch(err => console.log(err));
  };

  componentDidMount = () => {
    this.fetchUpcomingDrives();
    this.fetchYears();
  };

  displayDrives = () => {
    if (this.state.upcomingDrivesStatus.length === 0) {
      return (
        <tr>
          <td colSpan={5}>It's Lonely Here</td>
        </tr>
      );
    }
    return this.state.drives.map((drive, i) => {
      return (
        <tr key={i}>
          <td>{i + 1}</td>
          <td>{drive.company}</td>
          <td>
            {this.state.upcomingDrivesStatus[i].editable ? (
              <form className="ui form">
                <DatePicker
                  selected={this.state.date}
                  onChange={date => this.setState({ date: date })}
                  dateFormat="dd/MM/yyyy"
                />
              </form>
            ) : (
              new Date(drive.date_of_drive).toDateString()
            )}
          </td>
          <td>{drive.no_of_rounds}</td>
          <td>
            {this.state.upcomingDrivesStatus[i].editable ? (
              <ol className="ui list">
                {drive.rounds.map((drive_round, j) => {
                  return (
                    <li key={j}>
                      <select
                        className="ui dropdown"
                        value={this.state.rounds[j]}
                        style={{ padding: "2px", height: "25px" }}
                        onChange={e => {
                          let rounds = this.state.rounds;
                          rounds[j] = parseInt(e.target.value);
                          this.setState({ rounds: rounds });
                        }}
                      >
                        {this.props.rounds.map((round, i) => {
                          return (
                            <option value={round.id}>{round.round_name}</option>
                          );
                        })}
                      </select>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <ol className="ui list">
                {drive.rounds.map((round, i) => {
                  return (
                    <li key={i}>
                      {round.round_name}
                      <button
                        className="mini ui right floated icon button"
                        style={{ padding: 2.5 }}
                        onClick={() =>
                          this.deleteRound(
                            drive.drive_id,
                            round.id,
                            drive.rounds.length
                          )
                        }
                      >
                        <i className="trash icon" />
                      </button>
                    </li>
                  );
                })}
                <li
                  style={{
                    display: this.state.upcomingDrivesStatus[i].showAddRound
                      ? ""
                      : "none"
                  }}
                >
                  <form className="ui form">
                    <select
                      style={{ padding: "1px", width: "110px" }}
                      value={this.state.newRound}
                      onChange={e =>
                        this.setState({ newRound: parseInt(e.target.value) })
                      }
                    >
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
          <td>{drive.type_of_drive}</td>
          <td>{drive.remarks}</td>
          <td style={{display: this.state.isUpcoming ? "" : "none"}}>
            {this.state.showTickButtons ? (
              <div className="ui basic icon buttons">
                <button
                  className="ui button"
                  onClick={() => this.submitData(drive.drive_id)}
                >
                  <i className="check icon" />
                </button>
                <button
                  className="ui button"
                  onClick={() => {
                    let ups = this.state.upcomingDrivesStatus;
                    ups[i].showAddRound = false;
                    ups[i].editable = false;
                    this.setState({
                      upcomingDrivesStatus: ups,
                      showTickButtons: false
                    });
                  }}
                >
                  <i className="x icon" />
                </button>
              </div>
            ) : (
              <div className="ui basic icon buttons">
                <button
                  className=" ui button"
                  onClick={() => {
                    let ups = this.state.upcomingDrivesStatus;
                    ups[i].showAddRound = !ups[i].showAddRound;
                    let rounds = [];
                    for (let temp = 0; temp < drive.rounds.length; temp++) {
                      rounds.push(drive.rounds[temp].id);
                    }
                    this.setState({
                      upcomingDrivesStatus: ups,
                      date: new Date(drive.date_of_drive),
                      showTickButtons: true,
                      rounds: rounds
                    });
                  }}
                >
                  <i className="add icon" />
                </button>
                <button
                  className="ui button"
                  onClick={() => {
                    let ups = this.state.upcomingDrivesStatus;
                    ups[i].editable = !ups[i].editable;
                    let rounds = [];
                    for (let temp = 0; temp < drive.rounds.length; temp++) {
                      rounds.push(drive.rounds[temp].id);
                    }
                    this.setState({
                      upcomingDrivesStatus: ups,
                      date: new Date(drive.date_of_drive),
                      showTickButtons: true,
                      rounds: rounds
                    });
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
            )}
          </td>
        </tr>
      );
    });
  };
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
              <select
                value={this.state.selectedVal}
                onChange={e =>
                  this.setState({ selectedVal: parseInt(e.target.value) })
                }
              >
                <option value="">Upcoming drives</option>
                {this.state.years.map((year, i) => {
                  return (
                    <option key={i} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
              <button className="ui secondary button" onClick={this.getDrives}>Get Drives</button>
            </div>
          </div>
        </div>
        <br />
        <table className="ui blue celled striped compact table">
          <thead>
            <tr>
              <th>SNo.</th>
              <th>Company</th>
              <th>Date</th>
              <th>#Rounds</th>
              <th>Rounds</th>
              <th>Type</th>
              <th>Remarks</th>
              <th style={{display: this.state.isUpcoming ? "" : "none"}}>Action</th>
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
    rounds: state.roundsList
  };
};

export default connect(mapStateToProps)(DriveView);
