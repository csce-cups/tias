import React from 'react';
import './../Components/common.scss';
import { ProfileSidebar } from '../Components/Profile/ProfileSidebar';
import { ProfileStatusBar } from '../Components/Profile/ProfileStatusBar';
import { ProfileForm } from '../Components/Profile/ProfileForm';
import { PreferenceSelector } from '../Components/Profile/PreferenceSelector';

export const Profile = () => {
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
}

export default Profile;