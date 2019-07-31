import React from "react";
import SuccessMessage from "./ui_utils/SuccessMessage";
import ErrorDisplay from "./ui_utils/ErrorDisplay";
import tnpbase from "../api/tnpbase";
import DatePicker from "react-datepicker";

class AddTest extends React.Component {
  state = {
    testName: "",
    noOfSubjects: 2,
    selectedSubjects: [],
    allSubjects: [],
    date: new Date(),
    loading: false,
    error: "",
    message: "",
    submitted: false,
    showMsg: false
  };

  fetchSubjects = () => {
    tnpbase
      .get("/subjects")
      .then(res => {
        this.setState({ allSubjects: res.data.result });
      })
      .catch(err => console.log(err));
  };

  handleXClick = () => {
    this.setState({ showMsg: false });
  };

  displayStatus = () => {
    if (this.state.showMsg) {
      if (this.state.submitted) {
        if (this.state.loading) {
          return <h1>Loading. . .</h1>;
        } else if (this.state.error !== "") {
          return (
            <ErrorDisplay
              headerData={this.state.error}
              message={this.state.message}
              showTry={false}
              handleXClick={this.handleXClick}
            />
          );
        } else {
          return (
            <SuccessMessage
              message={this.state.message}
              handleXClick={this.handleXClick}
            />
          );
        }
      }
    }
  };

  
  addTest = e => {
    this.setState({ showMsg: true ,loading:true,submitted:true});
    e.preventDefault();
    const data = {
      test_name: this.state.testName,
      date_of_test: this.state.date.toLocaleDateString("en-GB"),
      no_of_subjects: this.state.noOfSubjects,
      subjects: this.state.selectedSubjects
      
    };
    tnpbase
      .post("/tests/add", { data })
      .then(res =>{
        if (res.status === 200) {
          this.setState({
            loading: false,
            message: res.data.status,
            error: ""
          });
        } else {
          this.setState({
            loading: false,
            error: res.data.status,
            message: res.data.error
          });
        }

      })
      .catch(err => {
        console.log(err);
        this.setState({
          loading: false,
          error: "Unable to submit data",
          message: err.message
        });
      })
  };

  displaySelectSubjects = () => {
    let tempArray = [];
    for (let j = 0; j < this.state.noOfSubjects; j++) {
      tempArray.push(j);
    }
    return tempArray.map((num, i) => {
      return (
        <div className="field" key={i}>
          <label>{`Subject ${num + 1}`}</label>
          <select
            value={this.state.selectedSubjects[i]}
            onChange={e => {
              const temp = this.state.selectedSubjects;
              temp[i] = e.target.value;
              this.setState({ selectedSubjects: temp });
            }}
          >
            <option value="">Select Subject</option>
            {this.state.allSubjects.map((subject, j) => {
              return (
                <option key={j} value={subject.id}>
                  {subject.sub_name}
                </option>
              );
            })}
          </select>
        </div>
      );
    });
  };

  componentWillMount = () => {
    this.fetchSubjects();
  };

  render() {
    return (
      <div className="ui container">
        <h2 className="ui center aligned  header" id="student-header">
          Add Test
        </h2>
        <form className="ui form">
          <div className="field">
            <label>Test Name</label>
            <input
              type="text"
              placeholder="Name"
              value={this.state.testName}
              onChange={e =>
                this.setState({ testName: e.target.value.toUpperCase() })
              }
            />
          </div>
          <div className="field">
            <label>Date</label>
            <DatePicker
              selected={this.state.date}
              dateFormat="dd/MM/yyyy"
              onChange={val => this.setState({ date: val })}
            />
          </div>
          <div className="field">
            <label>No. Of Subjects</label>
            <input
              type="number"
              placeholder="Subjects"
              value={this.state.noOfSubjects}
              onChange={e => {
                let value = e.target.value;
                if (value > 8) {
                  value = 8;
                }
                this.setState({ noOfSubjects: value });
              }}
            />
          </div>
          <div className="two fields">{this.displaySelectSubjects()}</div>
          <button className="ui secondary button" onClick={this.addTest}>
            Add Test
          </button>
        </form>
        <div style={{ marginTop: "55px" }}>{this.displayStatus()}</div>
      </div>
    );
  }
}

export default AddTest;
