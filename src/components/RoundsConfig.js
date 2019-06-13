import React from "react";
import { connect } from "react-redux";
import { FetchRounds } from "../actions/";
import tnpbase from "../api/tnpbase";

class RoundsConfig extends React.Component {
  state = { showForm: false, round: "" };

  addRound = () => {
    console.log(typeof {data:this.state.round});
    tnpbase
      .put("/round/add", { data: this.state.round })
      .then(() => {
        this.setState({ showForm: false });
        this.props.FetchRounds();
      })
      .catch(err => console.log(err));
  };

  deleteRound = data => {
    console.log(typeof {id:data});
    data ={ id:data }
    tnpbase
      .post("/rounds/delete",data )
      .then(() => this.props.FetchPosts())
      .catch(err => console.log(err));
  };

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
            <input
              type="text"
              placeholder="Round Name"
              value={this.state.round}
              onChange={e => this.setState({ round: e.target.value })}
            />
          </div>
        </td>
        <td>
          <div className="ui basic icon buttons">
            <button className="ui button" onClick={this.addRound}>
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

  displayRounds = () => {
    if (this.props.rounds.length === 0) {
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
    return this.props.rounds.map((round, i) => {
      return (
        <tr key={i}>
          <td>{round.id}</td>
          <td>{round.round_name}</td>
          <td>
            <button
              className="ui basic icon button"
              onClick={() => this.deleteRound(round.id)}
            >
              <i className="trash icon" />
            </button>
          </td>
        </tr>
      );
    });
  };

  componentDidMount = () => {
    this.props.FetchRounds();
  };

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
        <table className="ui copmact blue small table table-container">
          <thead>
            <tr>
              <th>Round No.</th>
              <th>Round Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.formDisplay()}
            {this.displayRounds()}
          </tbody>
        </table>
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
  { FetchRounds }
)(RoundsConfig);
