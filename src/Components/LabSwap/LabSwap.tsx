import React, { useState } from 'react'
import CourseBlock from './CourseBlock'
import Selection from './Selection'
import { SchedulingWindow } from './SchedulingWindow'
import { Button } from '@material-ui/core'
//for main component
//needs selection confirmation window
//submition ability
//render view

const LabSwap = () => {
  const [requests, setRequests] = useState<Array<any>>(new Array(0))
  const [offers, setOffers] = useState<Array<any>>(new Array(0))
  return (
    <>
      <div className="vstack"> {/*for selection and submit button */}
        <div className="hstack" >
          <Selection sections={requests} title="Request" />
          <Selection sections={offers} title="Offer"/>
        </div>
        <Button variant="outlined">Request Trade</Button>
      </div>
      <SchedulingWindow setRequests={setRequests} setOffers={setOffers}/>
    
    </>
  )
}

export default LabSwap