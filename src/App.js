import React from "react";
import { Route, Switch } from "react-router-dom";

import SideBar from "./components/SideBar";
import Navbar from "./components/Navbar";

import Dashboard from "./components/Dashboard";

import AddStudentsDisplay from "./components/AddStudents";
import FilterStudentsDisplay from "./components/FilterStudents";

import AddDriveDisplay from "./components/AddDrive";
import DriveViewDisplay from "./components/DriveView";
import RoundsConfigDisplay from "./components/RoundsConfig";

import DriveAttendanceDisplay from "./components/DriveAttendance";
import DrivePerformanceDisplay from "./components/DrivePerformance";

import NewTestDisplay from "./components/NewTestDisplay";
import TestPerformaceDisplay from "./components/TestPerformace";

import tnpbase from "./api/tnpbase";

import "./App.css";

class App extends React.Component {
  state = { sidebarVisible: false, loading: 0 };

  handleMenuClick = () => {
    this.setState({ sidebarVisible: !this.state.sidebarVisible });
  };

  FileUploadHandler = files => {
    const data = new FormData();
    data.append("files", files);
    tnpbase.post("/students/add", data, {
      onUploadProgress: ProgressEvent => {
        this.setState({
          loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100
        });
      }
    }).then().catch(err => console.log(err))
  };

  render() {
    return (
      <div>
        <div>
          <Navbar handleMenuClick={this.handleMenuClick} />
          <SideBar
            isVisible={this.state.sidebarVisible}
            onClose={this.handleMenuClick}
          />

          <div style={{ marginLeft: "10px", marginRight: "10px" }}>
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route
                path="/students/add"
                render={() => (
                  <AddStudentsDisplay handleUpload={this.FileUploadHandler} />
                )}
              />
              <Route
                path="/students/filter"
                component={FilterStudentsDisplay}
              />
              <Route path="/drives/add" component={AddDriveDisplay} />
              <Route path="/drives/view" component={DriveViewDisplay} />
              <Route path="/rounds/config" component={RoundsConfigDisplay} />
              <Route
                path="/drives/attendance"
                component={DriveAttendanceDisplay}
              />
              <Route
                path="/drives/performance"
                component={DrivePerformanceDisplay}
              />
              <Route path="/tests/new" component={NewTestDisplay} />
              <Route
                path="/tests/performance"
                component={TestPerformaceDisplay}
              />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
