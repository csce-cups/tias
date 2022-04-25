import React, { createContext, ReactElement, useContext, useEffect, useState } from "react";
import API, {
  CourseBlock,
  CourseBlockWeek, TradeRequest
} from "../../modules/API";
import { compressWeek, loadSchedule, updateWithSchedule } from "../../modules/BlockFunctions";
import contexts from "../APIContext";
import { Scrollable } from "../Misc/Scrollable";
import { SchedulingWindow } from "../Scheduling/SchedulingWindow";
import { LabSwapBlock } from "./LabSwapBlock";
import { SwapSet, TradeInfo } from "./SwapSet";
import { TitleSet } from "./TitleSet";
//for main component
//needs selection confirmation window
//submition ability
//render viewce: string
export interface Selections {
  offered: CourseBlock | null; //selected sections
  requested: CourseBlock | null;
}
interface Submission {
  offered_id: number;
  requested_id: number;
}

type shortday = "M" | "T" | "W" | "R" | "F";

export const selectedTradeBlocksContext = createContext<
  [Selections, React.Dispatch<React.SetStateAction<Selections>>]
>([{ offered: null, requested: null }, 0 as any]);

export const LabSwap = () => {
  const user = useContext(contexts.user);
  const [viableBlockWeek, setBlockWeek] = useContext(contexts.userViableCourses);
  const [employees, setEmployees] = useContext(contexts.employees);
  const [blocks, setBlocks] = useContext(contexts.blocks);
  const [viableBlockWeekLocal, setBlockWeekLocal] = useState<CourseBlockWeek>(viableBlockWeek);
  const [schedule, setLoadedSchedule] = useContext(contexts.loadedSchedule);
  const [userTrades, setUserTrades] = useContext(contexts.userTrades);
  const selectedTradeBlocksState = useState<Selections>({
    offered: null,
    requested: null,
  });

  //Reset Button on new trade selection
  useEffect(() => {
    const btn = document.getElementById("request-trade-btn") as HTMLButtonElement;
    if (btn !== null && btn.innerHTML === "Done!") btn.innerHTML = "Request Trade";
  }, [selectedTradeBlocksState]);

  useEffect(() => {
    updateWithSchedule(schedule, viableBlockWeek, setBlockWeekLocal);
  }, [schedule, viableBlockWeek]);

  const submitTrade = () => {
    const btn = document.getElementById("request-trade-btn") as HTMLButtonElement;

    if (btn !== null) btn.innerHTML = "Sending request...";

    let temp = [
      selectedTradeBlocksState[0].offered,
      selectedTradeBlocksState[0].requested,
    ];

    const data: Submission = {
      offered_id: temp[0]?.section_id!,
      requested_id: temp[1]?.section_id!
    }
    
    API.submitTrade(data, user.user?.person_id).then(resp => {
      if (resp.msg || resp.err) {
        if (resp.msg) {
          if (btn !== null) btn.innerHTML = "Automatic Success";
          loadSchedule({employees, setEmployees, blocks, setBlocks, setLoadedSchedule})
          alert(resp.msg);
        }
        if (resp.err) {
          if (btn !== null) btn.innerHTML = "Failed";
          alert(resp.err);
        }
      } else if (btn !== null) {
         btn.innerHTML = 'Updating...';
      }
    }).then(() => {
      API.fetchUserTrades(user.user?.person_id).then(resp => {
        if (btn !== null) btn.innerHTML = "Done!";
        setTimeout(() => {
          setUserTrades(resp);
          selectedTradeBlocksState[1]({
            offered: null,
            requested: null
          });
        }, 1500);
      });
    }).catch(() => {
      if (btn !== null) btn.innerHTML = 'An error occurred';
    })
  };

  const userId = user.user?.person_id;

  interface DisplayBlock extends CourseBlock {
    days: shortday[];
  }

  const renderScheduled = (retData: CourseBlockWeek) => {
    const inputVal = [
      retData.Monday,
      retData.Tuesday,
      retData.Wednesday,
      retData.Thursday,
      retData.Friday,
    ].filter((day) => day !== null);
    const flat = inputVal.flat() as CourseBlock[];

    let retFormat: DisplayBlock[] = [];

    const shortDays = ["M", "T", "W", "R", "F"];
    const dayMap = new Map<string, shortday>([
      ["Monday", "M"],
      ["Tuesday", "T"],
      ["Wednesday", "W"],
      ["Thursday", "R"],
      ["Friday", "F"],
    ]);

    const cmpDay = (a: shortday, b: shortday) => {
      if (shortDays.indexOf(a) < shortDays.indexOf(b)) return -1;
      else if (shortDays.indexOf(a) > shortDays.indexOf(b)) return 1;
      return 0;
    };

    flat
      .sort((a, b) => {
        if (cmpDay(dayMap.get(a.weekday)!, dayMap.get(b.weekday)!) !== 0)
          return cmpDay(dayMap.get(a.weekday)!, dayMap.get(b.weekday)!);
        else if (a.start_time < b.start_time) return -1;
        else if (a.start_time > b.start_time) return 1;
        else if (a.course_number < b.course_number) return -1;
        else if (a.course_number > b.course_number) return 1;
        else if (a.section_number < b.section_number) return -1;
        else if (a.section_number > b.section_number) return 1;
        return 0;
      })
      .forEach((block) => {
        if (block !== undefined) {
          const where = retFormat.findIndex(
            (b) =>
              b.course_number === block.course_number &&
              b.section_number === block.section_number
          );
          if (where === -1)
            retFormat.push({
              ...block,
              days: [dayMap.get(block.weekday) as shortday],
            });
          else
            retFormat[where].days.push(dayMap.get(block.weekday) as shortday);
        }
      });
    return retFormat;
  };

  const reject = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, trade: TradeRequest) => {
    const target = event.currentTarget;
    trade.request_status = "Rejected";
    target.parentElement?.classList.add('working')
    target.innerHTML = "Working...";
    API.updateTrade(trade, user.user?.person_id).then(resp => {
      target.innerHTML = "Rejected!";
    }).catch((err) => {
      target.innerHTML = "Error.";
    }).finally(() => {
      setTimeout(() => {
        target.parentElement?.classList.remove('working');
        API.fetchUserTrades(user.user?.person_id).then(resp => {
          setUserTrades(resp);
        });
      }, 2000);
    })
  }

  const cancel = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, trade: TradeRequest) => {
    const target = event.currentTarget;
    trade.request_status = "Cancelled";
    target.parentElement?.classList.add('working')
    target.innerHTML = "Working...";
    API.updateTrade(trade, user.user?.person_id).then(resp => {
      target.innerHTML = "Canceled!";
    }).catch((err) => {
      target.innerHTML = "Error.";
    }).finally(() => {
      setTimeout(() => {
        target.parentElement?.classList.remove('working');
        API.fetchUserTrades(user.user?.person_id).then(resp => {
          setUserTrades(resp);
        });
      }, 2000);
    })
  }

  const accept = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, trade: TradeRequest) => {
    const target = event.currentTarget;
    trade.request_status = "Accepted";
    target.parentElement?.classList.add('working')
    target.innerHTML = "Working...";
    API.updateTrade(trade, user.user?.person_id).then(resp => {
      target.innerHTML = "Accepted!";
    }).catch((err) => {
      target.innerHTML = "Error.";
    }).finally(() => {
      setTimeout(() => {
        target.parentElement?.classList.remove('working');
        API.fetchUserTrades(user.user?.person_id).then(resp => {
          setUserTrades(resp);
        });
      }, 2000);
    })
  }

  const renderSwapSets = (retData: TradeRequest[], action: "Outstanding" | "Pending" | null, filter: (request: TradeRequest) => boolean) => {
    if (retData.filter(filter).length === 0) return <div className="loading-small ss-inside swap-section-subtitle">None</div>

    return retData.filter(filter).map((request) => {
      const allBlocks = renderScheduled(viableBlockWeek); // For easier iteration
      let sent: TradeInfo | null = null
      let received: TradeInfo | null = null
      allBlocks.forEach((block: DisplayBlock, _oidx: number) => {
        if (block.section_id === request.section_id_sender) {
          sent = { block, person: employees.find(p => p.person_id === request.person_id_sender)};
        }
        if (block.section_id === request.section_id_receiver) {
          received = { block, person: employees.find(p => p.person_id === request.person_id_receiver)};
        }
        if (sent && received) return;
      });

      if (request.person_id_receiver === userId) {
        [received, sent] = [sent, received]
      }

      let actions: ReactElement<any, any>[] = [];
      if (action !== null){
        if (action === 'Pending') { //we sent this out, action is cancel
          actions = [
            <button className="short green button fill button-dot" onClick={e => accept(e, request)} >Accept</button>,
            <button className="short red button fill button-dot" onClick={e => reject(e, request)}>Reject</button>
          ];
        } else if (action === 'Outstanding'){ //incoming requests, so actions are accept and reject
          actions = [
            <button className="short purple button fill button-dot" onClick={e => cancel(e, request)}>Cancel</button>
          ];
        }
      }
      return (
        <>
          < SwapSet key={`swapset-for-${JSON.stringify(request)}`} selected={[sent, received]} >
            {(actions.length !== 0) ? actions : undefined}
          </ SwapSet >
        </>
      )
    })
  }

  const blocksPayload: [
    CourseBlockWeek,
    React.Dispatch<React.SetStateAction<CourseBlockWeek>>
  ] = [compressWeek(viableBlockWeekLocal), setBlockWeek];

  return (
    <div className="app-body interact-blocks">
      <div className="vstack sidebar">
        <div className="swap-section vstack">
          <TitleSet titles={["Offer", "Request"]} />
          <SwapSet
            selected={[
              { block: selectedTradeBlocksState[0].offered, person: null},
              { block: selectedTradeBlocksState[0].requested, person: null},
            ]}
            height={"5.5em"}
          />
          <button
            disabled={selectedTradeBlocksState[0].offered === null || selectedTradeBlocksState[0].requested === null}
            id={"request-trade-btn"}
            className="blue button"
            onClick={submitTrade}
          >
            Request Trade
          </button>
        </div>
        <contexts.userTrades.Consumer>
          {([trades,]) => {
            if (trades === undefined) {
              return <></>
            } else {
              return (
                <Scrollable>
                  <div className="swap-section vstack">
                    <div className="swap-section-title"> Received Requests </div>
                    {renderSwapSets(trades, 'Pending', request => request.person_id_receiver === userId && request.request_status === 'Pending')}
                  </div>

                  <div className="swap-divider" />

                  <div className="swap-section vstack">
                    <div className="swap-section-title"> Sent Requests </div>
                    {renderSwapSets(trades, 'Outstanding', request => request.person_id_sender === userId && request.request_status === 'Pending')}
                  </div>

                  <div className="swap-divider" />

                  <div className="swap-section vstack">
                    <div className="swap-section-title"> Past Requests </div>
                      { trades.filter(request => (request.person_id_sender === userId || request.person_id_receiver === userId) && request.request_status === 'Accepted').length > 0? 
                        <>
                          <div className="swap-section-subtitle">
                            Accepted Requests
                          </div>
                          {renderSwapSets(trades, null, request => (request.person_id_sender === userId || request.person_id_receiver === userId) && request.request_status === 'Accepted')}
                        </>
                        :
                        <div className="swap-section-subtitle">
                          Accepted Requests
                          {renderSwapSets(trades, null, request => (request.person_id_sender === userId || request.person_id_receiver === userId) && request.request_status === 'Accepted')}
                        </div>
                      }
                      { trades.filter(request => (request.person_id_sender === userId || request.person_id_receiver === userId) && request.request_status === 'Rejected').length > 0? 
                        <>
                          <div className="swap-section-subtitle">
                            Rejected Requests
                          </div>
                          {renderSwapSets(trades, null, request => (request.person_id_sender === userId || request.person_id_receiver === userId) && request.request_status === 'Rejected')}
                        </>
                        :
                        <div className="swap-section-subtitle">
                          Rejected Requests
                          {renderSwapSets(trades, null, request => (request.person_id_sender === userId || request.person_id_receiver === userId) && request.request_status === 'Rejected')}
                        </div>
                      }
                      { trades.filter(request => (request.person_id_sender === userId || request.person_id_receiver === userId) && request.request_status === 'Cancelled').length > 0? 
                        <>
                          <div className="swap-section-subtitle">
                            Cancelled Requests
                          </div>
                          {renderSwapSets(trades, null, request => (request.person_id_sender === userId || request.person_id_receiver === userId) && request.request_status === 'Cancelled')}
                        </>
                        :
                        <div className="swap-section-subtitle">
                          Cancelled Requests
                          {renderSwapSets(trades, null, request => (request.person_id_sender === userId || request.person_id_receiver === userId) && request.request_status === 'Cancelled')}
                        </div>
                      }
                  </div>
                </Scrollable>
              );
            }
          }}
        </contexts.userTrades.Consumer>
        <div className="swap-divider" />
      </div>
      <selectedTradeBlocksContext.Provider value={selectedTradeBlocksState}>
        <contexts.blocks.Provider value={blocksPayload}>
          <SchedulingWindow
            renderBlockType={LabSwapBlock}
            options={{ selectable: false }}
          />
        </contexts.blocks.Provider>
      </selectedTradeBlocksContext.Provider>
    </div>
  );
};
