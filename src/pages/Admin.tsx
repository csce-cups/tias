import React, { useContext } from 'react'
import contexts from '../Components/APIContext';
import { ChangeoverFileUpload } from '../Components/Misc/ChangeoverFileUpload'

export const Admin = () => {
    const {doShowAdmin} = useContext(contexts.user);

  if (doShowAdmin) {
    return < ChangeoverFileUpload />
  } else {
    return <div>You do not have permission to visit this page.</div>
  }
}
