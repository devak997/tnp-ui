import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const dataModify = props => {
  let tests = props.testDetails;
  let students = props.csvData;
  let sub = props.subject;
  let subjects = props.subs;
  let modData = [];
  let temp = [];
  if (sub === "all") {
    temp.push("Roll Number");
    for (let i = 0; i < Object.keys(tests).length; i++) {
      for (let j = 0; j < Object.values(tests)[i].length; j++) {
        if (j === Math.ceil(Object.values(tests).length))
          temp.push(Object.keys(tests)[i]);
        else temp.push("");
      }
    }
    temp.push("Average");
    modData.push(temp);
    temp = [];
    temp.push("");
    for (let i = 0; i < Object.keys(tests).length; i++) {
      for (let j = 0; j < Object.values(tests)[i].length; j++) {
        temp.push(Object.values(tests)[i][j]);
      }
    }
    temp.push("");
    modData.push(temp);
    temp = [];
    for (let i = 0; i < students.length; i++) {
      temp.push(students[i].rollNumber);
      for (let j = 0; j < Object.keys(tests).length; j++) {
        for (let k = 0; k < subjects.length; k++) {
          if (typeof students[i][Object.keys(tests)[j]] !== "undefined") {
            if (
              typeof students[i][Object.keys(tests)[j]][subjects[k]] ===
              "undefined"
            ) {
              temp.push(0);
            } else {
              temp.push(students[i][Object.keys(tests)[j]][subjects[k]]);
            }
          } else {
            temp.push("Absent");
          }
        }
      }
      temp.push(students[i].avg);
      modData.push(temp);
      temp = [];
    }
  } else {
    temp.push("Roll Number");
    for (let i = 0; i < Object.keys(tests).length; i++) {
      temp.push(Object.keys(tests)[i]);
    }
    temp.push("Average");
    modData.push(temp);
    temp = [];
    temp.push("");
    for (let i = 0; i < Object.keys(tests).length; i++) {
      for (let j = 0; j < Object.values(tests)[i].length; j++) {
        temp.push(Object.values(tests)[i][j]);
      }
    }
    temp.push("");
    modData.push(temp);
    temp = [];
    for (let i = 0; i < students.length; i++) {
      temp.push(students[i].rollNumber);
      for (let j = 0; j < Object.keys(tests).length; j++) {
        if (typeof students[i][Object.keys(tests)[j]] !== "undefined") {
          if (typeof students[i][Object.keys(tests)[j]][sub] === "undefined") {
            temp.push(0);
          } else {
            temp.push(students[i][Object.keys(tests)[j]][sub]);
          }
        } else {
          temp.push("Absent");
        }
      }
      temp.push(students[i].avg);
      modData.push(temp);
      temp = [];
    }
  }
  return modData;
};

export const ExportCSV = props => {
  let csvData = props.csvData;
  let fileName = props.fileName;
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (csvData, fileName) => {
    csvData = dataModify(props);
    const ws = XLSX.utils.aoa_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <button
      className="ui secondary button"
      onClick={e => exportToCSV(csvData, (fileName || 'reports'))}
    >
      ExportCSV
    </button>
  );
};

export default ExportCSV;
