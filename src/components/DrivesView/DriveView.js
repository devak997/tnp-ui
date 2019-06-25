import React from "react";
import { connect } from "react-redux";
import tnpbase from "../../api/tnpbase";
import DriveViewForm from "./DriveViewForm";
import { fetchDrives, setEditDriveAction, setAddRoundAction } from "../../actions";

class DriveView extends React.Component {
  deleteRound = (drive_id, round_id, noOfRounds, driveYear) => {
    const data = { drive_id, round_id, noOfRounds };
    tnpbase
      .post("/drives/rounds/delete", { data })
      .then(() => {
        this.props.fetchDrives(driveYear);
      })
      .catch(err => console.log(err));
  };

  deleteDrive = (drive, driveYear) => {
    tnpbase
      .post("/drives/delete", { data: drive })
      .then(() => {
        this.props.fetchDrives(driveYear);
      })
      .catch(err => console.log(err));
  };

  submitData = (formValues, drive_id, year) => {
    const roundIds = [];
    const reqKeys = Object.keys(formValues).filter(key =>
      key.startsWith("round")
    );
    for (let i = 0; i < reqKeys.length; i++) {
      roundIds.push(parseInt(formValues[reqKeys[i]]));
    }
    if (formValues.newRound) {
      roundIds.push(parseInt(formValues.newRound));
    }
    const data = {
      date: formValues.date.toLocaleDateString("en-GB"),
      roundIds,
      drive_id
    };
    tnpbase
      .post("/drives/modify", { data })
      .then(() => {
        this.props.fetchDrives(year);
        this.props.setAddRoundAction(-1);
        this.props.setEditDriveAction(-1);
      })
      .catch(err => console.log(err));
  };
  render() {
    return (
      <div>
        <DriveViewForm
          deleteRound={this.deleteRound}
          submitData={this.submitData}
          deleteDrive={this.deleteDrive}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    rounds: state.roundsList
  };
};

export default connect(
  mapStateToProps,
  { fetchDrives, setAddRoundAction,setEditDriveAction }
)(DriveView);
