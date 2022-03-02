import React from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";

const googleResponseCallback = (response: any) => {
  console.log(response);
};

const logoutSuccess = () => {

}

export const NavBar = () => {
  return (
    <div className="navbar">
      <div className="left element major">TIAS</div>
      <div className="left element">Profile</div>
      <div className="left element">Scheduling</div>
      <div className="left element">LabSwap™</div>
      <div className="fill element"></div>
      <div className="element">
        <GoogleLogin
          clientId=""
          buttonText="Sign in with Google"
          onSuccess={googleResponseCallback}
          onFailure={googleResponseCallback}
          cookiePolicy={"single_host_origin"}
          isSignedIn={true}
        />
      </div>
      <div className="element">
        <GoogleLogout
          clientId=""
          onLogoutSuccess={logoutSuccess}
          onFailure={logoutSuccess}
          render={renderProps => (
            <u>Sign Out</u>
          )}
        />
      </div>
    </div>
  );
};
