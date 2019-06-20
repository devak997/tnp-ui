import React from "react";
import tnpbase from "../api/tnpbase";
import Multiselect from "./Multiselect/MultiSelect";

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
    btechScore: "",
    class10Score: "",
    class12Score: "",
    alreadySelected: "yes",
    eamcetRank: "",
    branch: [],
    YOP: "",
    backLogs: 0,
    gender: "all",
    btechScoreType: "",
    class12ScoreType: "",
    class10ScoreType: ""
  };

  submitFilterDetails = () => {
    const data = {
      btech_score: this.state.btechScore,
      btech_score_type: this.state.btechScoreType,
      branch: this.state.branch,
      backlogs: this.state.backLogs,
      class12_score: this.state.class12Score,
      class12_score_type: this.state.class12ScoreType,
      class10_score: this.state.class10Score,
      class10_score_type: this.state.class10ScoreType,
      eamcet_rank: this.state.eamcetRank,
      gender: this.state.gender,
      isSelected: this.state.alreadySelected,
      year_of_passing: this.state.YOP
    };
    console.log(data);
    tnpbase
      .post("/students/filter", {data})
      .then((res) => console.log(res))
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div className="ui container">
        <h2 className="ui header center aligned">Filter Students</h2>
        <div className="ui form">
          <div className="two fields">
            <div className="field">
              <label>Btech Score</label>
              <div className="ui right labeled input">
                <input
                  type="number"
                  placeholder="Btech Score"
                  value={this.state.btechScore}
                  onChange={e => this.setState({ btechScore: e.target.value })}
                />
                <select
                  className="menu"
                  style={{ width: "100px" }}
                  value={this.state.btechScoreType}
                  onChange={e =>
                    this.setState({ btechScoreType: e.target.value })
                  }
                >
                  <option className="item" value="">
                    Select
                  </option>
                  <option className="item" value="cgpa">
                    CGPA
                  </option>
                  <option className="item" value="percentage">
                    Percentage
                  </option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>Backlogs</label>
              <input
                type="text"
                placeholder="Backlogs"
                value={this.state.backLogs}
                onChange={e => this.setState({ backLogs: e.target.value })}
              />
            </div>
          </div>
          <div className="three fields">
            <div className="field">
              <label>Class 12 Score</label>
              <div className="ui right labeled input">
                <input
                  type="number"
                  placeholder="Class 12 Score"
                  value={this.state.class12Score}
                  onChange={e =>
                    this.setState({ class12Score: e.target.value })
                  }
                />
                <select
                  className="menu"
                  style={{ width: "100px" }}
                  value={this.state.class12ScoreType}
                  onChange={e =>
                    this.setState({ class12ScoreType: e.target.value })
                  }
                >
                  <option className="item" value="">
                    Select
                  </option>
                  <option className="item" value="cgpa">
                    CGPA
                  </option>
                  <option className="item" value="percentage">
                    Percentage
                  </option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>Class 10 Score</label>
              <div className="ui right labeled input">
                <input
                  type="number"
                  placeholder="Class 10 Score"
                  value={this.state.class10Score}
                  onChange={e =>
                    this.setState({ class10Score: e.target.value })
                  }
                />
                <select
                  className="menu"
                  style={{ width: "100px" }}
                  value={this.state.class10ScoreType}
                  onChange={e =>
                    this.setState({ class10ScoreType: e.target.value })
                  }
                >
                  <option className="item">Select</option>
                  <option className="item" value="cgpa">
                    CGPA
                  </option>
                  <option className="item" value="percentage">
                    Percentage
                  </option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>Eamcet Rank</label>
              <input
                type="number"
                placeholder="Eamcet Rank"
                value={this.state.eamcetRank}
                onChange={e => this.setState({ eamcetRank: e.target.value })}
              />
            </div>
          </div>
          <div className="three fields">
            <div className="field">
              <label>Gender</label>
              <select
                value={this.state.gender}
                onChange={e => this.setState({ gender: e.target.value })}
              >
                <option value="all">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="field">
              <label>Year of Passing</label>
              <input
                type="number"
                placeholder="YOP"
                value={this.state.YOP}
                onChange={e => this.setState({ YOP: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Allow Students already selected?</label>
              <select
                value={this.state.alreadySelected}
                onChange={e =>
                  this.setState({ alreadySelected: e.target.value })
                }
              >
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label>Branch</label>
            <Multiselect
              options={data}
              onSelectOptions={res => this.setState({branch: res})}
            />
          </div>
          <button
            className="big ui secondary button"
            style={{ margin: "0 auto", display: "block" }}
            onClick={this.submitFilterDetails}
          >
            Filter
          </button>
        </div>
      </div>
    );
  }
}

export default FilterStudents;
