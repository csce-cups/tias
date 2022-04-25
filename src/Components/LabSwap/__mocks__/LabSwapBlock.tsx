import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { CompressedCourseBlock } from '../../../modules/BlockFunctions';
import uuid from '../../../uuid';
import contexts from '../../APIContext';
import "../../common.scss";
import RenderBlockProps, { blockColors, calcFlex } from '../../Scheduling/BlockBase';
import { selectedTradeBlocksContext } from './../LabSwap';

interface Props extends RenderBlockProps {
  data: {
    course_instance: CompressedCourseBlock
    linkIDs: number[] | null
  }
}

export const LabSwapBlock: FC<Props> = ({visible, size, inline, edge, bottom, data}) => {
    visible=true;
  const user = useContext(contexts.user);
  const [selectedTradeBlocks, setSelectedTradeBlocks] = useContext(selectedTradeBlocksContext);
  const [interacted, setInteracted] = useState<boolean>(true);
  const [requestEnabled, setRequestEnabled] = useState<boolean>(true);
  const [offerEnabled, setOfferEnabled] = useState<boolean>(true);
  const {course_instance} = data;
  const isScheduledFor = (user.user)? course_instance.scheduledAll.findIndex(sub => sub.includes(user!.user!.person_id)) : -1;
  const ref: any = useRef(null);
  const id = uuid();

  const enableButton = ((e: React.MouseEvent<HTMLInputElement>) => {
    if (e.currentTarget.getAttribute('request-type') === 'request') {
      setRequestEnabled(true);
      setOfferEnabled(false);
    } else {
      setRequestEnabled(false);
      setOfferEnabled(true);
    }
  });

  const selectBlockForTrade = ((e: React.MouseEvent<HTMLButtonElement>) => {
    const tradeType = e.currentTarget.getAttribute('request-type')!;
    const course = document.querySelector(`input[type=radio]:checked`);
    if (course === null) return;

    const selectedCourseIdx = +course.getAttribute('data-idx')!;
    const selectedCourse = {
      ...course_instance,
      section_number: course_instance.section_numbers[selectedCourseIdx],
      professor: course_instance.professors[selectedCourseIdx],
      section_id: course_instance.section_ids[selectedCourseIdx],
      scheduled: course_instance.scheduledAll[selectedCourseIdx]
    }

    const newSelected = {
      offered: (tradeType === "offer")? selectedCourse : selectedTradeBlocks.offered,
      requested: (tradeType === "request")? selectedCourse : selectedTradeBlocks.requested,
    }

    setSelectedTradeBlocks(newSelected);
    setInteracted(false);
  });
  
  // https://blog.logrocket.com/detect-click-outside-react-component-how-to/
  useEffect(() => { // Disables focus view on mouse click outside
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target) && interacted) {
        setInteracted(false);
        setRequestEnabled(false);
        setOfferEnabled(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  const resName = (prof: string) => {
    if (prof === "TBA") {
      return '(professor TBA)';
    } else if (prof !== "") {
      return `with ${prof} `;
    } else {
      return '';
    }
  }

  let formElementsOffers: JSX.Element[] = [];
  let formElementsRequests: JSX.Element[] = [];
  course_instance.section_ids.forEach((section_id, i) => {
    if (isScheduledFor === i) {
      formElementsOffers.push(
        <div key={`pref-row-${JSON.stringify(course_instance)}-${section_id}`} className="pref-row nowrap">
          <input name={id} id={`pref-row-checkbox-${course_instance.course_number}-${section_id}`} type="radio" request-type={"offer"} data-idx={i} onClick={enableButton}/>
          <label htmlFor={`pref-row-checkbox-${course_instance.course_number}-${section_id}`} >
            {course_instance.course_number}-{course_instance.section_numbers[i]} {resName(course_instance.professors[i])} (yours)
          </label>
        </div>
      )
    } else {
      formElementsRequests.push(
        <div key={`pref-row-${JSON.stringify(course_instance)}-${section_id}`} className="pref-row nowrap">
          <input name={id} id={`pref-row-checkbox-${course_instance.course_number}-${section_id}`} type="radio" request-type={"request"} data-idx={i} onClick={enableButton}/>
          <label htmlFor={`pref-row-checkbox-${course_instance.course_number}-${section_id}`} >
            {course_instance.course_number}-{course_instance.section_numbers[i]} {resName(course_instance.professors[i])}
          </label>
        </div>
      )
    }
  })
  

  let flex = calcFlex(visible, inline, size);
  const isVisible = {
    width: (visible)? undefined : 0,
    flex: flex,
    margin: visible? undefined : 0
  }
  
  let color = { 
    background: blockColors.get(course_instance.course_number)!,
  };
  
  let classes = `block ${(isScheduledFor !== -1)? '' : 'frosted'}`;
  if (interacted) {
    classes += " interacted " + edge;
    classes += (bottom)? ' bottom' : '';
  }
  else classes += " grow-h";

  let buttonOffer: React.ReactElement<any, any> | null = null;
  let buttonRequest: React.ReactElement<any, any> | null = null;
  if (isScheduledFor !== -1 && course_instance.section_ids.length > 1) {
    buttonRequest = <button data-testid="request" id={id} disabled={!requestEnabled} request-type="request" onClick={selectBlockForTrade} className="submit-button">Request!!! selected section</button>
    buttonOffer = <button data-testid="offer" id={id} disabled={!offerEnabled} request-type="offer" onClick={selectBlockForTrade} className="submit-button">Offer!!! selected section</button>
  } else if (isScheduledFor !== -1) {
    buttonOffer = <button data-testid="offer" id={id} disabled={!offerEnabled} request-type="offer" onClick={selectBlockForTrade} className="submit-button">Offer!!! selected section</button>;
  } else {
    buttonRequest = <button data-testid="request" id={id} disabled={!requestEnabled} request-type="request" onClick={selectBlockForTrade} className="submit-button">Request!!! selected section</button>;
  }

  return (
    <div ref={ref} className={classes} onClick={() => setInteracted(true)}
      title={`${course_instance.course_number}-${course_instance.section_number}`} 
      style={{...color, ...isVisible}}
    >
      { interacted? 
        <div className="pref-pane">
          { buttonRequest?
            <>
              <div className="pref-pane-title">Select course to request</div>
              { formElementsRequests }
              <div style={{marginBottom: '5px'}}/>
              <div className="fill"/>
              { buttonRequest }
            </>
            : <></>
          }

          { (buttonRequest && buttonOffer)?
            <>
              <div style={{marginBottom: '5px'}}/>
              <div className="pref-pane-title">~ OR ~</div>
              <div className="fill"/>
              <div style={{marginBottom: '5px'}}/>
            </>
            : <></>
          }

          { buttonOffer?
            <>
              <div className="pref-pane-title">Select course to offer</div>
              { formElementsOffers }
              <div style={{marginBottom: '5px'}}/>
              <div className="fill"/>
              { buttonOffer }
            </>
            : <></>
          }

        </div>
        : 
        <>
          <div className="fill"/>
          <div className={`block-text centered ${visible? '' : 'hidden'}`}>
            {course_instance.course_number}
          </div>
        </>
      }
    </div>
  )
}