import React, { useContext } from 'react'
import contexts from '../Components/APIContext';
import { LabSwap } from '../Components/LabSwap/LabSwap'

export const LabSwapPage = () => {
    const {doShowLabSwap} = useContext(contexts.user);

  if (doShowLabSwap) {
    return < LabSwap />
  } else if (doShowLabSwap === false) {
    return <div className="page-text">You do not have permission to visit this page.</div>
  } else {
    return <div className="page-text">Loading...</div>
  }
}
