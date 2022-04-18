import React, { FC } from 'react';

interface Props {
  hours: number
  start: Date;
}

// https://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format
const formatAMPM = (date: Date, offset: number) => {
  var hours = (date.getHours() + offset) % 24;
  var minutes: number | string = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

export const SchedulingTimes: FC<Props> = ({hours, start}) => {
  let times = [];
  for (let i = 0; i < hours; i++) {
    // Needs a key
    const time = formatAMPM(start, i);
    times[i] = <div className="divider hover-divider" key={`SchedulingTimes-${time}`}>{time}</div>;
  }

  return (
    <div className="vstack day" style={{borderTop: '2px solid transparent', width: '4em'}}>
      <div className="day-label">&nbsp;</div>
      <div className="vstack day">
        { times }
      </div>
    </div>
  )
}
