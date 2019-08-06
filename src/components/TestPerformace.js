import React from "react";
import tnpbase from "../api/tnpbase";
import ErrorDisplay from "./ui_utils/ErrorDisplay";
import ExportCSV from "./ExportCSV"

class TestPerformance extends React.Component {
  state = {
    branch_code: "",
    years: [],
    testNames: [],
    testDetails: [],
    subj: "",
    subjects: [],
    yop: "",
    testData: [],
    searchData: [],
    loading: false,
    error: "",
    message: "",
    rollNumber: "",
    submitted: false,
    showTable: [],
    searchStat: false,
    maxPages: 0,
    fileName : "",
    csData : [],
    page: 1
  };

  componentDidMount = () => {
    this.getYears();
  };

  getSubjects = branch_code => {
    let data = { branch: branch_code, year: this.state.yop };
    tnpbase
      .post("/tests/subjects", data)
      .then(res => {
        if (res.data.subjects.length === 0) {
          window.alert("No subjects");
          this.setState({ subjects: [] });
        } else {
          this.setState({ subjects: res.data });
        }
      })
      .catch(err => {
        console.log(err);
        window.alert("Error" + err);
      });
  };

  getYears = () => {
    tnpbase.post("/tests/passing").then(res => {
      if (res.data.result.length !== 0) {
        this.setState({ years: res.data.result });
      } else {
        this.setState({ years: [] });
      }
    });
  };

  getTestDetails = () => {
    let data = {
      branch_code: this.state.branch_code,
      subject: this.state.subj,
      yop: this.state.yop
    };
    tnpbase
      .post("/tests/subs/include", data)
      .then(res => {
        this.setState({
          testDetails: res.data.subject_count,
          testNames: Object.keys(res.data.subject_count)
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  getData = () => {
    let data = {
      branch_code: this.state.branch_code,
      subject: this.state.subj,
      yop: this.state.yop
    };
    tnpbase
      .post("/display/testdata", data)
      .then(res => {
        this.setState({ submitted: true, loading: true });
        if (res.status === 200) {
          if (res.data.testData.length !== 0) {
            this.setState({
              testData: res.data.testData,
              page: 1,
              maxPages: Math.ceil(res.data.testData.length / 10),
              loading: false,
              message: res.data.status,
              error: "",
              showTable: data
            });
          } else {
            this.setState({
              testData: [],
              loading: false,
              error: res.data.status,
              message: res.data.error
            });
          }
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
          submitted: true,
          loading: false,
          message: err.message,
          error: "Unable to send data"
        });
      });
  };

  yearDisplay = () => {
    return this.state.years.map((year, i) => {
      return (
        <option key={i} value={year}>
          {year}
        </option>
      );
    });
  };

  displayMessage = () => {
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
            handleXclick={this.handleXclick}
          />
        );
      }
    }
  };

  enableContents = () => {
    this.setState({ submitted: true, loading: true });
  };

  tableData = () => {
    if (this.state.submitted === false) {
      return (
        <tr>
          <td colSpan={2}>Submit to view</td>
        </tr>
      );
    } else {
      if (this.state.testData.length === 0) {
        return (
          <tr>
            <td colSpan={2}>No records found</td>
          </tr>
        );
      }
      let studentData = [];
      if (this.state.searchStat) {
        studentData = this.state.searchData;
      } else {
        studentData = this.state.testData;
      }
      let page = this.state.page;
      return studentData.map((data, index) => {
        if (index >= (page - 1) * 10 && index < page * 10) {
          return (
            <tr key={index}>
              <td style={{}}>{data.rollNumber}</td>
              {this.displayMarks(data)}
              <td >{data.avg}</td>
            </tr>
          );
        }
      });
    }
  };

  displayMarks = values => {
    let tests = Object.keys(values);
    tests.pop();
    tests.splice(0, 1);
    let scores = Object.values(values);
    scores.pop();
    scores.splice(0, 1);
    scores = scores[0];
    let temp = [];
    let subs = this.state.showTable.subject;
    let itr = 0;
    if (subs === "all") {
      for (let i = 0; i < this.state.testNames.length; i++) {
        for (let j = 0; j < Object.values(this.state.testDetails)[i].length; j++) {
          if (typeof values[this.state.testNames[i]] !== "undefined") {
            if (
              typeof values[this.state.testNames[i]][
                this.state.subjects.subjects[j]
              ] === "undefined"
            ) {
              temp.push(<td key={itr++}>0</td>);
            } else {
              temp.push(
                <td key={itr++}>
                  {
                    values[this.state.testNames[i]][
                      this.state.subjects.subjects[j]
                    ]
                  }
                </td>
              );
            }
          } else {
            temp.push(<td key={itr++}>Absent</td>);
          }
        }
      }
      return temp.map(val => {
        return val;
      });
    } else {
      for (let i = 0; i < this.state.testNames.length; i++) {
        // console.log(this.state.testNames[i],this.state.testDetails , typeof values[this.state.testNames[i]])
        if (typeof values[this.state.testNames[i]] !== "undefined") {
          if (
            typeof values[this.state.testNames[i]][
              this.state.showTable.subject
            ] === "undefined"
          ) {
            temp.push(<td key={itr++}>0</td>);
          } else {
            temp.push(
              <td key={itr++} colSpan={1}>
                {values[this.state.testNames[i]][this.state.showTable.subject]}
              </td>
            );
          }
        } else {
          temp.push(<td key={itr++}>Absent</td>);
        }
      }
      return temp.map(val => {
        return val;
      });
    }
  };

  testsDisplay = () => {
    if (this.state.submitted !== true) {
      return;
    } else {
      let tests = Object.keys(this.state.testDetails);
      let val = Object.values(this.state.testDetails);
      let subj = this.state.showTable.subject;
      if (val.length !== 0 && subj === "all") {
        return tests.map((test, i) => {
          return (
            <th key={i} colSpan={val[i].length}>
              {test}
            </th>
          );
        });
      } else {
        return tests.map((test, i) => {
          if (val[i].includes(subj)) {
            return (
              <th key={i} colSpan={1}>
                {test}
              </th>
            );
          }
        });
      }
    }
  };

  subjDisplay = () => {
    if (this.state.submitted !== true) {
      return;
    } else {
      let tests = Object.keys(this.state.testDetails);
      let val = Object.values(this.state.testDetails);
      let subj = this.state.showTable.subject;
      let list = [];
      let sub_itr = 0;
      if (subj === "all" && val.length !== 0) {
        for (let i = 0; i < tests.length; i++) {
          for (let j = 0; j < val[i].length; j++) {
            list.push(
              <th key={sub_itr++} colSpan={1}>
                {val[i][j]}
              </th>
            );
          }
        }
        return list.map(ele => {
          return ele;
        });
      } else {
        let list = [];
        let i = 0;
        if (val.length !== 0) {
          for (i = 0; i < this.state.testNames.length; i++) {
            if (val[i].includes(subj))
              list.push(
                <th key={i} colSpan={1}>
                  {this.state.showTable.subject}
                </th>
              );
          }
        }
        return list.map(ele => {
          return ele;
        });
      }
    }
  };

  subjectDisplay = () => {
    let list = this.state.subjects;
    if (list.length !== 0) {
      return list.subjects.map((val, i) => {
        return (
          <option value={val} key={i}>
            {val}
          </option>
        );
      });
    }
  };

  enablePage = pageNo => {
    this.setState({ page: pageNo });
  };

  pageCount = () => {
    if (this.state.testData.length === 0 || this.state.searchStat) {
      return (
        <a key={0} className="disabled item">
          {1}
        </a>
      );
    } else {
      let temp = [];
      let maxPage = Math.ceil(this.state.testData.length / 10);
      for (let i = 1; i <= maxPage; i++) {
        if (i === this.state.page) {
          temp.push(
            <a key={i} className="active item">
              {i}
            </a>
          );
        } else {
          temp.push(
            <a
              key={i}
              className="item"
              onClick={() => {
                this.enablePage(i);
              }}
            >
              {i}
            </a>
          );
        }
      }
      return temp.map(page => {
        return page;
      });
    }
  };

  getStudentData = () => {
    const data = this.state.testData.filter(
      record => record.rollNumber === this.state.rollNumber
    );
    this.setState({ searchStat: true, searchData: data, page: 1 });
  };

  search = () => {
    if (this.state.submitted) {
        return (
          <div
            className="ui action input "
            style={{ float: "right", padding: "1%" }}
          >
            <input
              type="text"
              placeholder="Enter roll no."
              value={this.state.rollNumber}
              onChange={e => {
                this.setState({ rollNumber: e.target.value.toUpperCase() });
              }}
            />
            <button
              className="ui secondary button"
              onClick={this.getStudentData}
            >
              Search
            </button>
            <button
              className="ui button"
              onClick={() => {
                this.setState({ searchStat: false , rollNumber :"" });
              }}
            >
              <i className="x icon" />
            </button>
          </div>
        );   
  };
}

  render() {
    return (
      <div className="ui container">
        <h3 className="ui center aligned icon header">
          <i className="cogs icon" />
          <div className="content">
            Test Performance
            <div className="sub header">Student Performance in tests</div>
          </div>
        </h3>
        <div className="ui form">
          <div className="field">
            <label>Enter Year of Passing</label>
            <select
              value={this.state.yop}
              placeholder="Enter Year of passing"
              onChange={e => {
                this.setState({ yop: e.target.value });
              }}
            >
              <option value="">Select YOP</option>
              {this.yearDisplay()}
            </select>
          </div>
          <div className="field">
            <label>Select Branch : </label>
            <select
              placeholder="Select Branch"
              value={this.state.branch_code}
              onChange={e => {
                this.getSubjects(e.target.value);
                this.setState({ branch_code: e.target.value });
              }}
            >
              <option value={""}>Select Branch</option>
              <option value={"all"}>All</option>
              <option value={Number("5")}>CSE</option>
              <option value={Number("12")}>IT</option>
              <option value={Number("4")}>ECE</option>
              <option value={Number("3")}>MECH</option>
              <option value={Number("1")}>CIVIL</option>
              <option value={Number("2")}>EEE</option>
            </select>
          </div>

          <div className="field">
            <label>Select Subject:</label>
            <select
              value={this.state.subj}
              onChange={e => {
                this.setState({ subj: e.target.value });
              }}
            >
              <option value="">Select Subject</option>
              <option value="all">All</option>
              {this.subjectDisplay()}
            </select>
          </div>
          <button
            className="ui button"
            onClick={() => {
              this.enableContents();
              this.getTestDetails();
              this.getData();
            }}
          >
            <i className="check icon" />
          </button>
        </div>
        <div>
          <br />
          {this.displayMessage()}
        </div>
        <div>{this.search()}</div>
        <div>
          <br />
          <div className="ui rounded container" style={{ overflowX: "auto", 'display':'block' }}>
            <table
              className="ui blue celled  striped compact table"
              
            >
              <thead style={{ textAlign: "center" }} id="markDetails">
                <tr>
                  <th rowSpan={2}  style={{}}>Roll no.</th>
                  {this.testsDisplay()}
                  <th rowSpan={2} >Average</th>
                </tr>
                <tr>{this.subjDisplay()}</tr>
              </thead>
              <tbody>{this.tableData()}</tbody>
            </table>
          </div>
          <br />
          <div
            className="ui pagination menu"
            style={{ overflowX: "auto", display: "flex", width: "100%" }}
          >
            {this.pageCount()}
          </div>
          <br />
          <br />
        </div>
        <div
            className="ui action input "
            style={{ float: "right", padding: "1%" }}
          >
            <input
              type="text"
              placeholder="Enter file name"
              value={this.state.fileName}
              onChange={e => {
                this.setState({ fileName: e.target.value });
              }}
            />
        <ExportCSV
          csvData = {this.state.testData}
          testDetails = {this.state.testDetails}
          subject = {this.state.showTable.subject}
          subs = {this.state.subjects.subjects}
          fileName = {this.state.fileName}/>
        </div>
      </div>
    );
  }
}

export default TestPerformance;
