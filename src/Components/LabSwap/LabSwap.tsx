import React, { useState } from 'react'
import CourseBlock from './CourseBlock'
import Selection from './Selection'
import { SchedulingWindow } from './SchedulingWindow'
import { Button } from '@material-ui/core'
//for main component
//needs selection confirmation window
//submition ability
//render view
interface CourseInstance { // Results of a join between course, course_section, and section_meetings
  course: number,   // Course_Number from Course
  section: number,  // Section_Number from Course_Section
  start: Date,      // Start_Time from Section_Meeting
  end: Date         // End_Time from Section_Meeting 
  sections: Array<number>
  // If the API returns more information from this I can add them to the interface here
}
const LabSwap = () => {
  const [requests, setRequests] = useState<any>({valid: false})
  const [offers, setOffers] = useState<any>({valid: false})
  const selectSection = (course: CourseInstance, section: number)=>{
    let data = {
      valid: true,
      course: course.course,
      section: section,
      start: course.start,
      end: course.end
    }
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
      <div className="vstack"> {/*for selection and submit button */}
        <div className="hstack" >
          <Selection sections={requests} title="Request" />
          <Selection sections={offers} title="Offer"/>
        </div>
        <Button variant="outlined" onClick={submitTrade}>Request Trade</Button>
      </div>
      <SchedulingWindow select={selectSection} />
    
    </>
  )
}

export default LabSwap