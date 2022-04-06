import React, { useContext } from 'react';
import './../Components/common.scss';
import { ProfileSidebar } from '../Components/Profile/ProfileSidebar';
import { ProfileStatusBar } from '../Components/Profile/ProfileStatusBar';
import { ProfileForm } from '../Components/Profile/ProfileForm';
import { PreferenceSelector } from '../Components/Profile/PreferenceSelector';
import contexts from '../Components/APIContext';

export const Profile = () => {
  const {doShowProfile} = useContext(contexts.user);

  if (doShowProfile || true) {
    return (
      <div className="Profile hstack">
        < ProfileSidebar />
        <div className="vstack main">
          < ProfileStatusBar />
          < ProfileForm />
          < PreferenceSelector />
        </div>
      </div>
    );
  } else {
    return <div>You do not have permission to visit this page.</div>
  }
}

export default Profile;