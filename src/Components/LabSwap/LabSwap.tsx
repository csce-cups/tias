import React, { createContext, useContext, useState } from "react";
import { CourseBlock, CourseBlockWeek } from "../../modules/API";
import { compressWeek } from "../../modules/BlockManipulation";
import contexts from '../APIContext';
import { SchedulingWindow } from "../Scheduling/SchedulingWindow";
import { LabSwapBlock } from "./LabSwapBlock";
import { SwapSet } from "./SwapSet";
import { TitleSet } from "./TitleSet";
//for main component
//needs selection confirmation window
//submition ability
//render viewce: string
export interface Selections {
  offered: CourseBlock | null, //selected sections
  requested: CourseBlock | null,
}


export const selectedTradeBlocksContext = createContext<[Selections, React.Dispatch<React.SetStateAction<Selections>>]>([{ offered: null, requested: null }, 0 as any]);

export const LabSwap = () => {
  const [viableBlockWeek, setBlockWeek] = useContext(contexts.userViableCourses);
  const selectedTradeBlocksState = useState<Selections>({ offered: null, requested: null });
  
  const submitTrade = () => {//post to API
    const btn = document.getElementById('request-trade-btn') as HTMLButtonElement;
    if (btn !== null) btn.innerHTML = 'Sending request...';
    // API.sendThing.then(resp => {
      
    //   if (btn !== null) btn.innerHTML = 'Done!';
    // });
    if (btn !== null) btn.innerHTML = 'Done!';
  };

  const blocksPayload: [CourseBlockWeek, React.Dispatch<React.SetStateAction<CourseBlockWeek>>] = [compressWeek(viableBlockWeek), setBlockWeek];

  return (
    <div className="app-body interact-blocks">
      <div className="vstack sidebar">
        < TitleSet titles={["Offer", "Request"]} />
        < SwapSet selected={[selectedTradeBlocksState[0].offered, selectedTradeBlocksState[0].requested]} />
        <button disabled={selectedTradeBlocksState[0].offered === null || selectedTradeBlocksState[0].requested === null} id={'request-trade-btn'} className="blue button" onClick={submitTrade}>
          Request Trade
        </button>
      </div>
      <selectedTradeBlocksContext.Provider value={selectedTradeBlocksState}>
        < contexts.blocks.Provider value={blocksPayload} >
          <SchedulingWindow renderBlockType={LabSwapBlock} options={{selectable: false}} />
        </ contexts.blocks.Provider >
      </selectedTradeBlocksContext.Provider>
    </div>
  );
};
