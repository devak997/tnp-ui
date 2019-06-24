import React from "react";
import { connect } from "react-redux";
import tnpbase from "../../api/tnpbase";
import DriveViewForm from "./DriveViewForm";
import { fetchDrives } from "../../actions";

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

  submitData = (formValues, drive_id) => {
    const roundIds = [];
    const reqKeys = Object.keys(formValues).filter(key =>
      key.startsWith("round")
    );
    for (let i = 0; i < reqKeys.length; i++) {
      roundIds.push(formValues[reqKeys[i]]);
    }
    if (formValues.newRound) {
      roundIds.push(formValues.newRound);
    }
    const data = {
      date: formValues.date.toLocaleDateString("en-GB"),
      roundIds,
      drive_id
    };

    console.log(data);
    // tnpbase
    //   .post("/drives/modify", { data })
    //   .then(() => {
    //     this.setState({ showTickButtons: false });
    //     this.fetchUpcomingDrives();
    //   })
    //   .catch(err => console.log(err));
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
  { fetchDrives }
)(DriveView);
