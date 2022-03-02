import React from "react";
import { GoogleButton } from "./GoogleButton"

export const NavBar = () => {
  return (
    <div className="navbar">
      <div className="left element major">TIAS</div>
      <div className="left element">Profile</div>
      <div className="left element">Scheduling</div>
      <div className="left element">LabSwap™</div>
      <div className="fill element"></div>
      < GoogleButton />
    </div>
  );
};
