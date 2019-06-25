import React from "react";
import tnpbase from "../api/tnpbase";
import { connect} from "react-redux";
import {
  ActionInput,
  Select,
  SelectActionInput,
  Input,
  ModifiedMultiSelect,
} from "./ui_utils";

import { fetchDrives } from "../actions/"
import { Field, reduxForm } from "redux-form";

const data = [
  {
    name: "CSE",
    value: "5"
  },
  {
    name: "IT",
    value: "12"
  },
  {
    name: "ECE",
    value: "4"
  },
  {
    name: "EEE",
    value: "2"
  },
  {
    name: "CIVIL",
    value: "1"
  },
  {
    name: "MECH",
    value: "3"
  }
];

class FilterStudents extends React.Component {
  state = {
    driveToAdd: "", filteredStudents : []
  };

  componentDidUpdate = () => {
    this.props.fetchDrives("upcoming");
  }

  submitFilterDetails = formValues => {
    console.log(formValues);
    const data = {
      btech_score: parseInt(formValues.btechScore),
      btech_score_type: formValues.btechScoreType,
      branch: formValues.selectedBranches,
      backlogs: parseInt(formValues.backlogs),
      class12_score: parseInt(formValues.class12Score),
      class12_score_type: formValues.class12ScoreType,
      class10_score: parseInt(formValues.class10Score) ,
      class10_score_type: formValues.class10ScoreType,
      eamcet_rank: parseInt(formValues.eamcetRank) || Infinity ,
      gender: formValues.gender,
      isSelected: formValues.allowSelected,
      year_of_passing: parseInt(formValues.yop)
    };
    tnpbase
      .post("/students/filter", { data })
      .then(res => {
        this.setState({ filteredStudents: res.data.result });
      })
      .catch(err => console.log(err));
  };

  showFilteredStudents = () => {
    return this.state.filteredStudents.map((student, i) => {
      return (
        <tr key={i}>
          <td>{i + 1}</td>
          <td>{student.HTNO}</td>
          <td>{student.NAME}</td>
          <td>{student.class10_score}</td>
          <td>{student.class12_score}</td>
          <td>{student.EAMCET_RANK}</td>
          <td>{student.btech_score}</td>
          <td>{student.BTECH_BACKLOGS}</td>
          <td>{student.BRANCH_CODE}</td>
          <td>{student.GENDER}</td>
          <td>{student.YOP_BTECH}</td>
          <td>{student.selection_status}</td>
          <td>{student.PARENT_MOBILE}</td>
          <td>{student.EMAIL}</td>
        </tr>
      );
    });
  };

  addToDrive = () => {
    const data = {
      driveToAdd: this.state.driveToAdd,
      students: this.state.filteredStudents
    };
    tnpbase
      .post("/students/addToDrive", {
        data
      })
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div className="ui container">
        <h2 className="ui header center aligned">Filter Students</h2>
        <div className="ui form">
          <div className="two fields">
            <Field
              name="btechScore"
              type="number"
              label="Btech Score"
              component={ActionInput}
              placeholder="Btech Score"
            >
              <Field
                name="btechScoreType"
                component={SelectActionInput}
                className="menu"
                style={{ width: "100px" }}
              >
                <option className="item" value="cgpa">
                  CGPA
                </option>
                <option className="item" value="percentage">
                  Percentage
                </option>
              </Field>
            </Field>
            <Field
              label="Backlogs"
              name="backlogs"
              type="number"
              placeholder="Backlogs"
              component={Input}
            />
          </div>
          <div className="three fields">
            <Field
              name="class12Score"
              type="number"
              label="class 12 Score"
              component={ActionInput}
              placeholder="Btech Score"
            >
              <Field
                name="class12ScoreType"
                component={SelectActionInput}
                className="menu"
                style={{ width: "100px" }}
              >
                <option className="item" value="cgpa">
                  CGPA
                </option>
                <option className="item" value="percentage">
                  Percentage
                </option>
              </Field>
            </Field>
            <Field
              name="class10Score"
              type="number"
              label="Class 10 Score"
              component={ActionInput}
              placeholder="Class 10 Score"
            >
              <Field
                name="class10ScoreType"
                component={SelectActionInput}
                className="menu"
                style={{ width: "100px" }}
              >
                <option className="item" value="cgpa">
                  CGPA
                </option>
                <option className="item" value="percentage">
                  Percentage
                </option>
              </Field>
            </Field>

            <Field
              label="Eamcet Rank"
              name="eamcetRank"
              type="number"
              placeholder="Eamcet Rank"
              component={Input}
            />
          </div>
          <div className="three fields">
            <Field name="gender" component={Select} label="Gender">
              <option value="all">All</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </Field>
            <Field
              label="Year of Passing"
              name="yop"
              type="number"
              placeholder="YOP"
              required
              component={Input}
            />
            <Field
              name="allowSelected"
              component={Select}
              label="Allow Selected Students?"
            >
              <option value="yes">Yes</option>
              <option value="no">NO</option>
            </Field>
          </div>
          <div className="two fields">
            <Field
              name="selectedBranches"
              component={ModifiedMultiSelect}
              data={data}
              label="Branch"
            />
            <div className="field">
              <button
                className={`ui secondary button ${this.props.valid ? "" : "disabled"}`}
                style={{ marginTop: "23px" }}
                onClick={this.props.handleSubmit(this.submitFilterDetails)}
              >
                Filter
              </button>
            </div>
          </div>
        </div>
        <table className="ui blue celled structured striped compact table">
          <thead style={{ textAlign: "center" }}>
            <tr>
              <th rowSpan={2}>SNO</th>
              <th rowSpan={2}>Roll no.</th>
              <th rowSpan={2}>Student Name</th>
              <th colSpan={4}>Scores</th>
              <th rowSpan={2}>Backlogs</th>
              <th rowSpan={2}>Branch</th>
              <th rowSpan={2}>Gender</th>
              <th rowSpan={2}>YOP</th>
              <th rowSpan={2}>
                Already <br /> Selected?
              </th>
              <th rowSpan={2}>Phone No.</th>
              <th rowSpan={2}>Email</th>
            </tr>
            <tr>
              <th>Class 10</th>
              <th>Class 12</th>
              <th>Eamcet Rank</th>
              <th>Btech(L)</th>
            </tr>
          </thead>
          <tbody>
            {this.state.filteredStudents.length === 0 ? (
              <tr style={{ textAlign: "center" }}>
                <td colSpan={14}>
                  <b>It's Lonely here!</b>
                </td>
              </tr>
            ) : (
              this.showFilteredStudents()
            )}
          </tbody>
          <tfoot
            className="full-width"
            style={{
              display: this.state.filteredStudents.length === 0 ? "none" : ""
            }}
          >
            <tr>
              <th colSpan={7}>
                <form className="ui form">
                  <div className="field">
                    <label>Select Drive</label>
                    <select
                      className="ui dropdown"
                      value={this.state.driveToAdd}
                      onChange={e =>
                        this.setState({ driveToAdd: e.target.value })
                      }
                    >
                      <option value="">Select Drive</option>
                      {this.props.allDrives.map((drive, someKey) => {
                        return (
                          <option value={drive.drive_id} key={someKey}>
                            {drive.company} -{" "}
                            {new Date(drive.date_of_drive).toLocaleDateString(
                              "en-GB"
                            )}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </form>
              </th>
              <th colSpan={7}>
                <button
                  className={`ui small primary labeled icon button ${
                    this.state.driveToAdd === "" ? "disabled" : ""
                  }`}
                  onClick={this.addToDrive}
                  style={{ margin: "0 auto", display: "block" }}
                >
                  <i className="user icon" /> Add to Drive
                </button>
              </th>
            </tr>
          </tfoot>
        </table>
        <br />
        <br />
      </div>
    );
  }
}

const validate = formValues => {
  const errors = {};
  if((!(formValues.btechScore >= 5 && formValues.btechScore<=10)) && formValues.btechScoreType==="cgpa" ) {
    errors.btechScore = "CGPA must be between 5 and 10"
  }
  if((!(formValues.btechScore >= 50 && formValues.btechScore<=100)) && formValues.btechScoreType==="percentage" ) {
    errors.btechScore = "Percentage must be between 5 and 10"
  }
  if((!(formValues.class12Score >= 5 && formValues.class12Score<=10)) && formValues.class12ScoreType==="cgpa" ) {
    errors.class12Score = "CGPA must be between 5 and 10"
  }
  if((!(formValues.class12Score >= 50 && formValues.class12Score<=100)) && formValues.class12ScoreType==="percentage" ) {
    errors.class12Score = "Percentage must be between 5 and 10"
  }
  if((!(formValues.class10Score >= 5 && formValues.class10Score<=10)) && formValues.class10ScoreType==="cgpa" ) {
    errors.class10Score = "CGPA must be between 5 and 10"
  }
  if((!(formValues.class10Score >= 50 && formValues.class10Score<=100)) && formValues.class10ScoreType==="percentage" ) {
    errors.class10Score = "Percentage must be between 5 and 10"
  }
  if(!formValues.yop) {
    errors.yop = "Please enter YOP"
  }
  if(formValues.selectedBranches) {
    if(formValues.selectedBranches.length === 0) {
      errors.selectedBranches = "Please select atleast one branch"
    }
  }
  return errors;
}

const mapStateToProps = state => {
  return{
    allDrives: state.drives
  };
}

export default connect(
  mapStateToProps,
  { fetchDrives}
)(
  reduxForm({
    form: "filterStudents",
    initialValues: {
      btechScoreType: "cgpa",
      class10ScoreType: "cgpa",
      class12ScoreType: "cgpa",
      btechScore: 0,
      class10Score: 0,
      class12Score: 0,
      selectedBranches: [],
      gender: "all",
      allowSelected: "yes"
    },
    validate
  })(FilterStudents)
);

// export default connect(mapStateToProps, {fetchDrives} )(reduxForm({
//   form: "filterStudents",
 
//   },
//   validate
// }))(FilterStudents);
