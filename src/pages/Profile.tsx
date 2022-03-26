import React from 'react';
import './../Components/common.scss';
import { ProfileFormRow } from '../Components/Profile/ProfileFormRow';
import { ProfileSidebar } from '../Components/Profile/ProfileSidebar';
import { ProfileStatusBar } from '../Components/Profile/ProfileStatusBar';
import { ProfileForm } from '../Components/Profile/ProfileForm';

export const Profile = () => {
  return (
    <div className="Profile hstack">
      < ProfileSidebar />
      <div className="vstack main">
        < ProfileStatusBar />
        < ProfileForm />
      </div>
    </div>
  );
}

export default Profile;