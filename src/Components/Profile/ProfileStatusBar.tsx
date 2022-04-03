/* Citation:
   Reading of input file and masking of file input element informed by:
   https://developer.mozilla.org/en-US/docs/Web/API/FileReader/result
   and
   https://medium.com/web-dev-survey-from-kyoto/how-to-customize-the-file-upload-button-in-react-b3866a5973d8 
*/

import React, { MutableRefObject } from 'react'
import { APIStudentUnavailabilityRequest } from '../../modules/API';
import API from '../../modules/API';

export const ProfileStatusBar = () => {

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const parseICSFile = (icsFileAsText: any) => {
    let icsdata = icsFileAsText.split("\n");
    API.saveUserUnavailability(data);
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
      <button className="blue button" onClick={handleClick}>Upload Schedule</button>
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
