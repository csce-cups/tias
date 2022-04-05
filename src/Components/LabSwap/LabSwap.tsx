import React, { useState, createContext, useContext } from "react";
import { LabSwapBlock } from "./LabSwapBlock";
import { Selection } from "./Selection";
import { Button } from "@material-ui/core";
import { APIUserQualification, CourseBlock, CourseBlockWeek } from "../../modules/API";
import contexts from '../APIContext'
import { SchedulingWindow } from "../Scheduling/SchedulingWindow";
import { CompressedCourseBlock, compressWeek } from "../../modules/BlockManipulation";
import { findScheduled } from "../../modules/FindSchedule";
//for main component
//needs selection confirmation window
//submition ability
//render viewce: string
interface Selections{
  offered: CourseBlock | null, //selected sections
  requested: CourseBlock | null,
}
export interface SelectInfo extends Selections{
 
  //qualifications: APIUserQualification[], //sections user can teach || Maybe not needed
  select: (course:CompressedCourseBlock, section:string, isOffer:boolean)=>void
}
export const SelectData = createContext<SelectInfo | null>(null); // TODO: These should be more strongly typed

export const LabSwap = () => {
  const [viableBlockWeek, setBlockWeek] = useContext(contexts.userViableCourses);

  
  // const [blocks,] = useContext(contexts.userViableCourses);
  const labsTaught = findScheduled(viableBlockWeek);
  let labsTaughtId:number[] = []
  labsTaught.forEach((c)=>{
    labsTaughtId.push(c.section_id);
  });
  let selections:Selections = {
    requested: null,
    offered: null
  }
  const selectSection = (course: CompressedCourseBlock, section: string, isOffer:boolean)=>{
    
    if (isOffer) selections.offered={...course, section_number:section};
    else selections.requested={...course, section_number:section};
  }
  let data:SelectInfo = { //for context 
    ...selections,
    select: selectSection
  }
  
  const submitTrade = () => {//post to API
    
  };

  const blocksPayload: [CourseBlockWeek, React.Dispatch<React.SetStateAction<CourseBlockWeek>>] = [compressWeek(viableBlockWeek), setBlockWeek];

  return (
    <div className="app-body">
      <SelectData.Provider value={data}>
        <div className="vstack sidebar">
          {/*for selection and submit button */}
          <div className="hstack">
            {/*TODO: Better CSS for these*/}
            <Selection title="Request" />
            <Selection title="Offer" />
          </div>
          <Button variant="outlined" onClick={submitTrade}>
            Request Trade
          </Button>
        </div>
        < contexts.blocks.Provider value={blocksPayload} >
            <SchedulingWindow renderBlockType={LabSwapBlock} options={{selectable: false}} />
        </ contexts.blocks.Provider >
      </SelectData.Provider>
    </div>
  );
};
