/* Citation:
   Reading of input file and masking of file input element informed by:
   https://developer.mozilla.org/en-US/docs/Web/API/FileReader/result
   and
   https://medium.com/web-dev-survey-from-kyoto/how-to-customize-the-file-upload-button-in-react-b3866a5973d8 
*/

import React, { MutableRefObject } from 'react'
import { APIStudentUnavailability } from '../../modules/API';
import API from '../../modules/API';

export const ProfileStatusBar = () => {

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const parseICSFile = (icsFileAsText: any) => {
    const btn = document.getElementById('upload-schedule-button') as HTMLButtonElement;
    if (btn !== null) btn.innerHTML = 'Uploading...';

    let icsdata = icsFileAsText.split("\n");
    //ASSUMPTIONS:
    //EVERY event has the same number of lines
    //every invalid event is marked by the RRULE line having '=' at the end of the line
    //the header is always 5 lines
    let line = 5;
    let dayLine = -1;
    let startLine = -1;
    let endLine = -1;
    let len = 1;
    let temp;
    let r = false;
    while ((temp = icsdata[line + len].split(":"))[0] !== "END") {
      if (icsdata[line + len].charAt(icsdata[line + len].length - 1) === "\r") {
        r = true;
      }
      if (temp[0] === "RRULE") {
        dayLine = len;
      } else if (temp[0] === "DTSTART") {
        startLine = len;
      } else if (temp[0] === "DTEND") {
        endLine = len;
      }
      len++;
    }
    len++; //for the END line
    if (r) {
      icsdata = icsFileAsText.split("\r\n");
    }
    let data: APIStudentUnavailability[] = [];
    while (line < icsdata.length - 1) {
      let byday = icsdata[line + dayLine];
      let start = icsdata[line + startLine];
      let end = icsdata[line + endLine];
      let lastchr = byday.charAt(byday.length - 1);
      if (lastchr !== "=") {
        //then this is a good event
        let days = byday.split("=");
        let event: APIStudentUnavailability = {
          DTSTART: start.split(":")[1],
          DTEND: end.split(":")[1],
          BYDAY: days[days.length - 1],
        };
        data.push(event);
      }
      line += len;
    }

    API.saveUserUnavailability(data).then(() => {
      if (btn !== null) btn.innerHTML = 'Upload Successful!';
    }).catch(() => {
      if (btn !== null) btn.innerHTML = 'An error occurred.';
    })
  };

  const readInputICSFile = (icsFile: any) => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      parseICSFile(fileReader.result);
    }

    fileReader.readAsText(icsFile);
  }

  const handleClick = () => {
    if (fileInputRef.current !== null) {
      fileInputRef.current.click();
    }
  }

  const handleChange = (event: any) => {
    const inputICSFile = event.target.files[0];
    readInputICSFile(inputICSFile);

    // Reset target.value to allow user
    // to upload a new file if desired. 
    if (event.target.value !== null) {
      event.target.value = null;
    }
  }

  return (
    <div className="profile-status-bar">
      <input type="file" ref={fileInputRef} onChange={handleChange} style={{ display: "none" }}/>
      <button id="upload-schedule-button" className="blue button" onClick={handleClick}>Upload Schedule</button>
      <div className="profile-status">
        <div className="left element">Last Updated: </div>
        <div className="fill element" />
        <div className="element" style={{ marginRight: "5px" }}>
          Jan 1, 1970
        </div>
      </div>
    </div>
  );
}
