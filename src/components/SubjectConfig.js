import React from "react";
import tnpbase from "../api/tnpbase";

class SubjectConfig extends React.Component {
  state = { showForm: false, subject: "", allSubjects: [] ,code: "" };

  fetchSubjects = () => {
      tnpbase.get("/subjects").then(res => {
          this.setState({allSubjects: res.data.result});
      }).catch(err => console.log(err));
  }

  addSubject = () => {
    let data = {subject: this.state.subject , code : this.state.code}
    tnpbase
      .post("/subjects/add", data)
      .then(() => {
        this.setState({ showForm: false , subject : "" ,code:""});
        this.fetchSubjects();
      })
      .catch(err => console.log(err));
  };

  deleteSubject = data => {
    tnpbase
      .post("/subject/delete",data)
      .then(() => this.fetchSubjects())
      .catch(err => console.log(err));
  };

  formDisplay = () =>
    this.state.showForm ? (
      <tr>
        <td>
          <div className="ui input">
            <input type="text" placeholder="Subject ID" disabled />
          </div>
        </td>
        <td>
          <div className="ui input">
            <input
              type="text"
              placeholder="Subject Name"
              value={this.state.subject}
              onChange={e => this.setState({ subject: e.target.value })}
            />
          </div>
        </td>
        <td>
          <div className="ui input">
            <input
              type="text"
              placeholder="Subject Code"
              value={this.state.code}
              onChange={e => this.setState({ code : e.target.value })}
            />
          </div>
        </td>
        <td>
          <div className="ui basic icon buttons">
            <button className="ui button" onClick={this.addSubject}>
              <i className="check icon" />
            </button>
            <button
              className="ui button"
              onClick={() => {
                this.setState({ showForm: false , subject :"" })}}
            >
              <i className="x icon" />
            </button>
          </div>
        </td>
      </tr>
    ) : null;

  displaySubjects = () => {
    if (this.state.allSubjects.length === 0) {
      return (
        <tr>
          <td colSpan={3} style={{ display: "" }}>
            <h3 style={{ textAlign: "center", padding: "10px" }}>
              It's lonely here
            </h3>
          </td>
        </tr>
      );
    }
    return this.state.allSubjects.map((subject, i) => {
      return (
        <tr key={i}>
          <td>{subject.id}</td>
          <td>{subject.sub_name}</td>
          <td>{subject.sub_code}</td>
          <td>
            <button
              className="ui basic icon button"
              onClick={() => this.deleteSubject(subject)}
            >
              <i className="trash icon" />
            </button>
          </td>
        </tr>
      );
    });
  };

  componentDidMount = () => {
    this.fetchSubjects();
  };

  render() {
    return (
      <div className="ui container">
        <button
          className="ui right floated secondary button"
          style={{ margin: "5px" }}
          onClick={() => this.setState({ showForm: !this.state.showForm  , subject : ""})}
        >
          Add Subject
        </button>
        <table className="ui copmact blue small table table-container">
          <thead>
            <tr>
              <th>Subject ID</th>
              <th>Subject Name</th>
              <th>Subject Code</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.formDisplay()}
            {this.displaySubjects()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default SubjectConfig;
