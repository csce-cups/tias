import React, { useState } from 'react'
import { GoogleLogin, GoogleLogout } from "react-google-login";

const tiasClientID : string = (process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID as string)
let clientUsername = ""

interface GoogleProps {
  onClick: () => void;
  disabled?: boolean | undefined;
}

const button = (renderProps: GoogleProps, text: string) => {
  return (
    <button onClick={renderProps.onClick} disabled={renderProps.disabled}>
      <div className="vstack">
        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg">
          <g fill="#000" fillRule="evenodd">
            <path d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z" fill="#EA4335"></path>
            <path d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z" fill="#4285F4"></path>
            <path d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z" fill="#FBBC05"></path>
            <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z" fill="#34A853"></path>
            <path fill="none" d="M0 0h18v18H0z"></path>
          </g>
        </svg>
      </div>
      <span>{text}</span>
    </button>
  )
}

export const GoogleButton = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const googleResponseCallback = (response: any) => {
    // Acquire the Google sign-in token.
    let id_token = response.getAuthResponse().id_token;
    // Obtain basic user info from the user's Google profile.
    let userBasicInfo = response.getBasicProfile();

    // Construct the request body to call
    // the API. All basic information is needed
    // to automatically generate a user if the 
    // user has not signed into the system before.
    let requestBody = 
    {
      token: id_token,
      firstName: userBasicInfo.getGivenName(),
      lastName: userBasicInfo.getFamilyName(),
      // email: userBasicInfo.getEmail()
      profilePhoto: userBasicInfo.getImageUrl(),
      isPeerTeacher: false,
      isTeachingAssistant: false,
      isProfessor: false,
      isAdmin: false    
    };

    // Establish a TIAS session.
    fetch('https://y7nswk9jq5.execute-api.us-east-1.amazonaws.com/prod/session', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    }).then(sessionResponse => sessionResponse.json())
      .then(responseData => document.cookie = `tias_user_id=${responseData.id}`);

    clientUsername = response.Du.VX
    setLoggedIn(true);
  };

  const logoutSuccess = () => {
    setLoggedIn(!loggedIn);
  }

  return (
    <>
      { (loggedIn)? 
        <GoogleLogout
          clientId={tiasClientID}
          buttonText={`Logged in as ${clientUsername}. Click to sign out.`}
          onLogoutSuccess={logoutSuccess}
          onFailure={() => {}}
          render={renderProps => (
            <div className="vstack google">
              {button(renderProps, `Logged in as ${clientUsername}. Click to sign out.`)}
            </div>
          )}
        />
        : 
        <GoogleLogin
          clientId={tiasClientID}
          buttonText="Sign in"
          onSuccess={googleResponseCallback}
          onFailure={(a: any) => console.log(a)}
          cookiePolicy={"single_host_origin"}
          isSignedIn={true}
          hostedDomain="tamu.edu"
          render={renderProps => (
            <div className="vstack google">
              {button(renderProps, 'Sign in with Google')}
            </div>
          )}
        />
      }
    </>
  )
}