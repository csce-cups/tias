import React, { createContext, useContext, useState } from "react";
import { CourseBlock, CourseBlockWeek, parseCookie, TradeRequest } from "../../modules/API";
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

  const userId = +parseCookie().tias_user_id;

  const renderSent = (retData: TradeRequest[]) => retData.filter(request => request.person_id_sender === userId).map((request) => (
    <div>
      <div>Sender ID: {request.person_id_sender}</div>
      <div>Sent Section ID: {request.section_id_sender}</div>
      <div>Receiver ID: {request.person_id_receiver}</div>
      <div>Received Section ID: {request.section_id_receiver}</div>
    </div>
  ))

  const renderReceived = (retData: TradeRequest[]) => retData.filter(request => request.person_id_receiver === userId).map((request) => (
    <div>
      <div>Sender ID: {request.person_id_sender}</div>
      <div>Sent Section ID: {request.section_id_sender}</div>
      <div>Receiver ID: {request.person_id_receiver}</div>
      <div>Received Section ID: {request.section_id_receiver}</div>
    </div>
  ))

  const blocksPayload: [CourseBlockWeek, React.Dispatch<React.SetStateAction<CourseBlockWeek>>] = [compressWeek(viableBlockWeek), setBlockWeek];

  return (
    <div className="app-body interact-blocks">
      <div className="vstack sidebar">
        <div className="swap-section vstack">
          < TitleSet titles={["Offer", "Request"]} />
          < SwapSet selected={[selectedTradeBlocksState[0].offered, selectedTradeBlocksState[0].requested]} />
          <button disabled={selectedTradeBlocksState[0].offered === null || selectedTradeBlocksState[0].requested === null} id={'request-trade-btn'} className="blue button" onClick={submitTrade}>
            Request Trade
          </button>
        </div>
        <contexts.userTrades.Consumer>
          {([trades,]) => {
            if (trades.length === 0) {
              return <></>
            } else {
              return (
                <>
                  <div className="schedule-info-container">
                    <div className="schedule-info-title">Outstanding:</div>
                    { renderReceived(trades) }
                  </div>
                  <div className="schedule-info-container">
                    <div className="schedule-info-title">Sent:</div>
                    { renderSent(trades) }
                  </div>
                </>
              )
            }
          }}
        </contexts.userTrades.Consumer>
        <div className="swap-divider"/>

        <div className="scrollable">
          <div className="swap-section vstack">
            <div className="swap-section-title"> Awaiting Action</div>
            < SwapSet selected={[selectedTradeBlocksState[0].offered, selectedTradeBlocksState[0].requested]} />
          </div>

          <div className="swap-divider"/>

          <div className="swap-section vstack">
            <div className="swap-section-title">Pending</div>
            < SwapSet selected={[selectedTradeBlocksState[0].offered, selectedTradeBlocksState[0].requested]} />
          </div>
        </div>
      </div>
      <selectedTradeBlocksContext.Provider value={selectedTradeBlocksState}>
        < contexts.blocks.Provider value={blocksPayload} >
          <SchedulingWindow renderBlockType={LabSwapBlock} options={{selectable: false}} />
        </ contexts.blocks.Provider >
      </selectedTradeBlocksContext.Provider>
    </div>
  );
};
