import React, { useContext } from 'react'
import { Admin } from '../Components/Admin/Admin';
import contexts from '../Components/APIContext';
import { ChangeoverFileUploadButton } from '../Components/Misc/ChangeoverFileUploadButton'

export const AdminPage = () => {
    const {doShowAdmin} = useContext(contexts.user);

  if (doShowAdmin) {
    return < Admin />
  } else if (doShowAdmin === false) {
    return <div className="page-text">You do not have permission to visit this page.</div>
  } else {
    return <div className="page-text">Loading...</div>
  }
}
