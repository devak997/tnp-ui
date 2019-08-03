import React from "react";
import SuccessMessage from "./ui_utils/SuccessMessage";
import ErrorDisplay from "./ui_utils/ErrorDisplay";
import tnpbase from "../api/tnpbase";
import TestUpload from "./TestUpload";

class NewTestDisplay extends React.Component {
  state = {
    file: [],
    loading: false,
    error: "",
    message: "",
    submitted: false,
    showMsg: false,
    tests: [],
    test_id: '',
    subjects: [],
    testNames: {},
    year: "",
    yop: []
  };

  selectFiles = files => {
    this.setState({ file: files });
  };

  getYears = () => {
    tnpbase.post("/tests/years").then(res => {
      if (res.data.result.length !== 0) {
        this.setState({ yop: res.data.result });
      } else {
        window.alert("No details");
        this.setState({ yop: [] });
      }
    });
  };

  getTestNames = year => {
    let data = { year: year };
    tnpbase
      .post("/tests", data)
      .then(res => {
        if (res.data.tests.length === 0) {
          window.alert("No tests");
          this.setState({ testNames: [] });
        } else {
          this.setState({ testNames: res.data.tests });
        }
      })
      .catch(err => {
        console.log(err);
        window.alert("Error" + err);
      });
  };

  getSubjectDetails = (test_id) =>{
    let data = {test_id : test_id};
    tnpbase
      .post('/newtest/subjects',data)
      .then((res)=>{
        if(res.data.result.length !==0){
          this.setState({subjects : res.data.result})
        }else {
          this.setState({subjects:[]})
        }
      })
      .catch(err =>{
        console.log(err);
      })
  }

  componentDidMount = () => {
    this.getYears();
  };

  handleXClick = () => {
    this.setState({ showMsg: false });
  };

  displayStatus = () => {
    if (this.state.showMsg) {
      if (this.state.submitted) {
        if (this.state.loading) {
          return (<div>
            <h1>Loading . . .</h1>
            <p>Don't refresh or perform any other activity</p>
          </div>);
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

  removeFile = i => {
    let ups = this.state.file;
    ups.splice(i, 1);
    this.setState({ file: ups });
  };

  displayFiles = () => {
    return this.state.file.map((file, i) => {
      return (
        <div className="item" key={i}>
          <div className="right floated content">
            <button
              className="ui button secondary"
              onClick={() => this.removeFile(i)}
            >
              Remove
            </button>
          </div>
          <i className="file icon" />
          <div className="content">{file.name}</div>
        </div>
      );
    });
  };

  enableMessage = () =>{
    this.setState({ showMsg: true ,loading:true,submitted:true});
  }

  submitData = () => {
    const formData = new FormData();
    Object.keys(this.state.file).forEach(key => {
      const file = this.state.file[key];
      formData.append(
        "file",
        new Blob([file], { type: file.type }),
        file.name || "file"
      );
      console.log(file.name);
    });
    formData.append("test_id",this.state.test_id);
    tnpbase
      .post("/test/addData", formData)
      .then(res => {
        console.log(res)
        this.setState({ submitted: true, loading: true });
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
        console.log(err.message,err.name);
        this.setState({
          loading: false,
          error: "Unable to submit data",
          message: err.message
        });
      });
  };

  yearDisplay = () => {
    return this.state.yop.map((year, i) => {
      return (
        <option key={i} value={year}>
          {year}
        </option>
      );
    });
  };

  subjectDetails = () =>{
    let subs = this.state.subjects;
    return subs.map((subject,index) => {
      return(
        <tr key ={index}>
          <td>{subject.id}</td>
          <td>{subject.sub_name}</td>
          <td>{subject.sub_code}</td>
        </tr>
      )
    })

  }

  render() {
    let tests = Object.values(this.state.testNames);
    let ids = Object.keys(this.state.testNames);
    let testDisplay = tests.map((test, index) => (
      <option key={index} value={ids[index]}>
        {test}
      </option>
    ));
    return (
      <div>
        <h2 className="ui center aligned icon header" id="student-header">
          <i className="circular users icon" />
          Import Test DB
        </h2>
        <div className="ui form">
          <div className="field">
            <label>Enter Year of Passing</label>
            <select
              value={this.state.year}
              placeholder="Enter Year of passing"
              onChange={e => {
                this.getTestNames(e.target.value);
                this.setState({ year: e.target.value });
              }}
            >
              <option value="">Select YOP</option>
              {this.yearDisplay()}
            </select>
          </div>
          <div className="field">
            <label>Select Test: </label>
            <select
              className="ui search dropdown"
              value={this.state.test_id}
              onChange={e => {
                this.getSubjectDetails(e.target.value);
                this.setState({ test_id: e.target.value });
              }}
            >
              <option value="">Select test</option>
              {testDisplay}
            </select>
          </div>
          <div>
            <table className="ui celled table">
              <thead>
                <tr>
                  <th>Subject ID</th>
                  <th>Subject Name</th>
                  <th>Subject Code</th>
                </tr>
              </thead>
              <tbody>
                {this.subjectDetails()}
              </tbody>
            </table>
          </div>
        </div>
        <br />
        <div className="ui centered grid">
          <div className="eight wide centered column">
            <TestUpload updateFile={this.selectFiles} />
          </div>
          <div className="eight wide column">
            <div style={{ overflowY: "scroll", height: "19em" }}>
              <h3 className="ui header">Selected File(s):</h3>
              <div className="ui middle aligned divided list">
                <p style={{ textAlign: "center" }}>
                  {this.state.file.length === 0
                    ? "Please select files to upload"
                    : ""}
                </p>
                {this.displayFiles()}
              </div>
            </div>
            <br />
            <p>
              Total number of files selected: <b>{this.state.file.length}</b>
            </p>
            <button
              className="ui blue labeled icon right floated  button"
              onClick={() => {
                if(this.state.test_id !== '')
                {
                  this.enableMessage();
                  this.submitData();
                } else {
                  window.alert("Select test");
                }
              }}
            >
              <i className="upload icon" />
              Upload
            </button>
            <div style={{ marginTop: "55px" }}>{this.displayStatus()}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default NewTestDisplay;
