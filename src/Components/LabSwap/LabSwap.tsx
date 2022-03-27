import React, { useState, createContext } from 'react'
import {CourseBlock} from './CourseBlock'
import {Selection} from './Selection'
import { SchedulingWindow } from './SchedulingWindow'
import { Button } from '@material-ui/core'
import { CourseInstance } from './SchedulingRender'
//for main component
//needs selection confirmation window
//submition ability
//render viewce: string

export const selectFunction = createContext<any>(null);
export const LabSwap = () => {
  const [requests, setRequests] = useState<any>({valid: false})
  const [offers, setOffers] = useState<any>({valid: false})
  const selectSection = (course: CourseInstance, section: number)=>{
    let data = {
      valid: true,
      ...course,
    }
    data.section_numbers=[section] //only include chosen course
    if(offers.valid){
      setRequests(data);
    }else{
      setOffers(data);
    }
  }
  
  const submitTrade = ()=>{
    setRequests({valid: false});
    setOffers({valid: false});
  }
  return (
    <>
      <div className="vstack sidebar"> {/*for selection and submit button */}
        <div className="hstack" >
          {/*TODO: Better CSS for these*/}
          <Selection sections={requests} title="Request"/>
          <Selection sections={offers} title="Offer"/>
        </div>
        <Button variant="outlined" onClick={submitTrade}>Request Trade</Button>
      </div>
      <selectFunction.Provider value={selectSection}>
        <SchedulingWindow/>
      </selectFunction.Provider>
    </>
  )
}
