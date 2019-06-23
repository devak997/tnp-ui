import React from "react";
import { connect } from "react-redux";
import AddDriveForm from "./AddDriveForm";
import "react-datepicker/dist/react-datepicker.css";
import tnpbase from "../../api/tnpbase";

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
      round8: ""
    }
  };

  submitForm = e => {
    e.preventDefault();
    const roundNames = [];
    for (let i = 0; i < this.state.noOfRounds; i++) {
      roundNames.push(this.state.selectedRounds[`round${i + 1}`]);
    }
    const data = {
      company: this.state.companyName,
      date_of_drive: this.state.date.toLocaleDateString("en-GB"),
      type_of_drive: this.state.onCampus ? "ON Campus" : "OFF Campus",
      remarks: this.state.remarks,
      no_of_rounds: this.state.noOfRounds,
      round_id: roundNames
    };

    tnpbase
      .post("/drives/add", { data })
      .then(() => console.log("data submitted"))
      .catch(err => console.log(err));
  };

  isFormValid = () => {
    let allRoundsSelect = true;
    for (let i = 0; i < this.state.noOfRounds; i++) {
      if (this.state.selectedRounds[`round${i + 1}`] === "") {
        allRoundsSelect = false;
        break;
      }
    }
    if (this.state.companyName === "" || !allRoundsSelect) {
      return false;
    } else return true;
  };

  render() {
    return (
      <div className="ui container">
        <AddDriveForm />
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
