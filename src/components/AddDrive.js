import React from "react";
import DatePicker from "react-datepicker";
import converter from "number-to-words";
import { connect } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import tnpbase from "../api/tnpbase";

class AddDrive extends React.Component {
  state = {
    companyName: "",
    date: new Date(),
    noOfRounds: 4,
    onCampus: true,
    remarks: "",
    selectedRounds: {
      round1: "",
      round2: "",
      round3: "",
      round4: "",
      round5: "",
      round6: "",
      round7: "",
      round8: "",
      round9: "",
      round10: ""
    }
  };

  submitForm = () => {
    tnpbase
      .post("/drives/add", { data: this.state })
      .then(() => console.log("data submitted"))
      .catch(err => console.log(err));
  };

  displaySelectRounds = () => {
    let tempArray = [];
    for (let i = 0; i < this.state.noOfRounds; i++) {
      tempArray.push(i);
    }
    return tempArray.map((num, i) => {
      return (
        <div className="field" key={i}>
          <label>{`Round ${num + 1}`}</label>
          <select
            className="ui dropdown fluid"
            placeholder="Select Round"
            value={this.state.selectedRounds[`round${i + 1}`]}
            onChange={e => {
              let temp = this.state.selectedRounds;
              temp[`round${i + 1}`] = e.target.value;
              this.setState({ selectedRounds: temp });
            }}
          >
            <option value="">Select Round</option>
            {this.props.rounds.map((round, i) => {
              return (
                <option value={round.id} key={i}>
                  {round.name}
                </option>
              );
            })}
          </select>
        </div>
      );
    });
  };

  render() {
    console.log(this.state);
    return (
      <div className="ui container">
        <form className="ui form">
          <h2 className="ui dividing header">Add Drive</h2>
          <div className="field">
            <label>Company Name</label>
            <input
              type="text"
              placeholder="Company Name"
              value={this.state.companyName}
              onChange={e => this.setState({ companyName: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Drive Date</label>
            <DatePicker
              onChange={date => this.setState({ date: date })}
              dateFormat="dd/MM/yyyy"
              selected={this.state.date}
            />
          </div>
          <div className="field">
            <label>No. of rounds</label>
            <input
              type="number"
              value={this.state.noOfRounds}
              min={0}
              max={10}
              onChange={e => this.setState({ noOfRounds: e.target.value })}
            />
          </div>
          <h4 className="ui dividing header">Select Rounds</h4>
          <div
            className={`${converter.toWords(
              this.state.noOfRounds
            )} wide fields`}
          >
            {this.displaySelectRounds()}
          </div>
          <div className="ui segment">
            <div className="field">
              <div
                className="ui toggle checkbox"
                onClick={() =>
                  this.setState({ isChecked: !this.state.isChecked })
                }
              >
                <input
                  type="checkbox"
                  tabIndex={0}
                  className="hidden"
                  checked={this.state.onCampus}
                  onChange={() => {}}
                />
                <label>
                  {this.state.onCampus ? "ON Campus" : "OFF Campus"}
                </label>
              </div>
            </div>
          </div>
          <div className="field">
            <label>Remarks</label>
            <input
              type="text"
              placeholder="Remarks"
              value={this.state.remarks}
              onChange={e => this.setState({ remarks: e.target.value })}
            />
          </div>
          <button
            className="large blue ui labeled icon button"
            onClick={this.submitForm}
          >
            <i className="paper plane icon" />
            Submit
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    rounds: state.roundsList
  };
};

export default connect(mapStateToProps)(AddDrive);
