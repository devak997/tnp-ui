import React from "react";

class RoundsConfig extends React.Component {
  state = { showForm: false };

  formDisplay = () =>
    this.state.showForm ? (
      <tr>
        <td>
          <div className="ui input">
            <input type="text" placeholder="Round No" disabled />
          </div>
        </td>
        <td>
          <div className="ui input">
            <input type="text" placeholder="Round Name" />
          </div>
        </td>
        <td>
          <div className="ui basic icon buttons">
            <button className="ui button" onClick={() => console.log("Done")}>
              <i className="check icon" />
            </button>
            <button
              className="ui button"
              onClick={() => this.setState({ showForm: false })}
            >
              <i className="x icon" />
            </button>
          </div>
        </td>
      </tr>
    ) : null;

  render() {
    return (
      <div className="ui container">
        <button
          className="ui right floated secondary button"
          style={{ margin: "5px" }}
          onClick={() => this.setState({ showForm: !this.state.showForm })}
        >
          Add Round
        </button>
        <table className="ui blue table">
          <thead>
            <tr>
              <th>Round No.</th>
              <th>Round Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.formDisplay()}
            <tr>
              <td>1</td>
              <td>Technical</td>
              <td>
                <button
                  className="ui basic icon button"
                  onClick={() => console.log("delete")}
                >
                  <i className="trash icon" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default RoundsConfig;
