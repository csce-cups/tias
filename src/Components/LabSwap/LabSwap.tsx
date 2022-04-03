import React, { useState, createContext, useContext } from "react";
import { LabSwapBlock } from "./LabSwapBlock";
import { Selection } from "./Selection";
import { Button } from "@material-ui/core";
import { CourseBlockWeek } from "../../modules/API";
import contexts from '../APIContext'
import { SchedulingWindow } from "../Scheduling/SchedulingWindow";
import { CompressedCourseBlock, compressWeek } from "../../modules/BlockManipulation";
//for main component
//needs selection confirmation window
//submition ability
//render viewce: string

export const selectFunction = createContext<any>(null); // TODO: These should be more strongly typed
export const LabSwap = () => {
  const [blockWeek, setBlockWeek] = useContext(contexts.blocks);
  const [requests, setRequests] = useState<any>({ valid: false }); // TODO: These should be more strongly typed
  const [offers, setOffers] = useState<any>({ valid: false }); // TODO: These should be more strongly typed
  const selectSection = (course: CompressedCourseBlock, section: string) => {
    let data = {
      valid: true,
      ...course,
    };

    data.section_numbers = [section]; // only include chosen course
    if (offers.valid) setRequests(data);
    else setOffers(data);
  };

  const submitTrade = () => {
    setRequests({ valid: false });
    setOffers({ valid: false });
  };

  const blocksPayload: [CourseBlockWeek, React.Dispatch<React.SetStateAction<CourseBlockWeek>>] = [compressWeek(blockWeek), setBlockWeek];

  return (
    <div className="app-body">
      <div className="vstack sidebar">
        {/*for selection and submit button */}
        <div className="hstack">
          {/*TODO: Better CSS for these*/}
          <Selection sections={requests} title="Request" />
          <Selection sections={offers} title="Offer" />
        </div>
        <Button variant="outlined" onClick={submitTrade}>
          Request Trade
        </Button>
      </div>
      < contexts.blocks.Provider value={blocksPayload} >
        <selectFunction.Provider value={selectSection}>
          <SchedulingWindow renderBlockType={LabSwapBlock} options={{selectable: false}} />
        </selectFunction.Provider>
      </ contexts.blocks.Provider >
    </div>
  );
};
