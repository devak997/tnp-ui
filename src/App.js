import React from "react";
import {  Route, Switch } from "react-router-dom";

import SideBar from "./components/SideBar";
import Navbar from "./components/Navbar";

import Dashboard from './components/Dashboard';

import AddStudentsDisplay from './components/AddStudents';
import FilterStudentsDisplay from './components/FilterStudents';

import AddDriveDisplay from './components/AddDrive';
import DriveViewDisplay from './components/DriveView';
import RoundsConfigDisplay from './components/RoundsConfig';

import DriveAttendanceDisplay from './components/DriveAttendance';
import DrivePerformanceDisplay from './components/DrivePerformance';

import NewTestDisplay from './components/NewTestDisplay';
import TestPerformaceDisplay from './components/TestPerformace';





class App extends React.Component {
  state = { sidebarVisible: false };

  handleMenuClick = () => {
    this.setState({ sidebarVisible: !this.state.sidebarVisible });
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
          
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route path="/students/add" component={AddStudentsDisplay} />
            <Route path="/students/filter" component={FilterStudentsDisplay} />
            <Route path="/drives/add" component={AddDriveDisplay} />
            <Route path="/drives/view" component={DriveViewDisplay} />
            <Route path="/rounds/config" component={RoundsConfigDisplay} />
            <Route path="/drives/attendance" component={DriveAttendanceDisplay} />
            <Route path="/drives/performance" component={DrivePerformanceDisplay} />
            <Route path="/tests/new" component={NewTestDisplay} />
            <Route path="/tests/performance" component={TestPerformaceDisplay} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
