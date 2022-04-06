import React, { useContext } from 'react';
import contexts from '../Components/APIContext';
import { PreferenceSelector } from '../Components/Profile/PreferenceSelector';
import { ProfileForm } from '../Components/Profile/ProfileForm';
import { ProfileSidebar } from '../Components/Profile/ProfileSidebar';
import { ProfileStatusBar } from '../Components/Profile/ProfileStatusBar';
import './../Components/common.scss';

export const Profile = () => {
  const {doShowProfile} = useContext(contexts.user);

  if (doShowProfile || true) {
    return (
      <>
        <div className="Profile hstack">
          < ProfileSidebar />
          <div className="vstack main main-profile" style={{overflow: 'hidden'}}>
            < ProfileStatusBar />
            < ProfileForm />
            < PreferenceSelector />
            <div className='backdrop'>
              <div className="page-text">Select a dropdown menu to begin.</div>
            </div>
          </div>
        </div>
      </>
    );
  } else if (doShowProfile === false) {
    return <div className="page-text">You do not have permission to visit this page.</div>
  } else {
    return <div className="page-text">Loading...</div>
  }
}

export default Profile;